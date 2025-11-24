import { Injectable } from '@angular/core';
import {ethers} from 'ethers';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {CheckMetaMask} from './check-metamask.decorator';


declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider : ethers.BrowserProvider | null = null;
  private accountAddress: string | null = null;
  private accountBalance: string | null = null;
  private contract: ethers.Contract | null = null;
  private readonly ABI_PATH = 'assets/contracts/MedicalProduct.json';

  constructor( private http : HttpClient) {
    this.checkMetaMask();
  }

  private async checkMetaMask() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
      }
      // Check if wallet is connected by checking for selected address
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        // Wallet not connected, so connect
        alert("Wallet not connected. Please connect the wallet");
        const ok = await this.connectWallet();
        if(!ok) {
          this.contract = null;
          throw new Error("Wallet not connected");
        }
        await this.loadContract();
        return;
      }
      await this.loadContract();
    } else {
      alert('MetaMask not detected! Please install MetaMask extension.');
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      if (!this.provider) {
        console.error("No provider found");
        return false;
      }

      // Check if already connected
      const accounts = await (window as any).ethereum.request({method: 'eth_accounts'});

      if(!accounts || accounts.length === 0) {
        try {
          // Request account access
          await (window as any).ethereum.request({method: 'eth_requestAccounts'});
        } catch (err: any) {
          this.contract = null;
          return false;
        }
      }

      const signer = await this.provider.getSigner();
      this.accountAddress = await signer.getAddress();
      console.log("the account address is : ", this.accountAddress);

      const balance = await this.provider.getBalance(this.accountAddress);
      console.log("the balance is : ", balance);
      this.accountBalance = ethers.formatEther(balance);

      return true;
    } catch (error) {
      this.contract=null;
      console.error("Wallet connection failed:", error);
      return false; // failed
    }
  }

  async getBalance() : Promise<string | null> {
    if(!this.provider || !this.accountAddress) return null;

    const balance = await this.provider.getBalance(this.accountAddress);
    return ethers.formatEther(balance);
  }

  getAccount(): string | null {
    return this.accountAddress;
  }

  // -------------------------
  //  Load smart contract
  // -------------------------

  async loadContract(requireSigner: boolean = true): Promise<void> {
    try {
      if (!this.provider) throw new Error('Provider not initialized');

      const contractJson = await firstValueFrom(this.http.get<any>(this.ABI_PATH));

      const abi = contractJson.abi;
      const CONTRACT_ADDRESS = contractJson.address;

      let contract;
      if (requireSigner) {
        const signer = await this.provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        console.log('✅ Contract loaded with signer (MetaMask)');
      } else {
        contract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.provider);
        console.log('✅ Contract loaded in read-only mode');
      }

      // const signer = await this.provider.getSigner();

      // this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      this.contract = contract;
      console.log('✅ Contract loaded at:', CONTRACT_ADDRESS);
    } catch (error) {
      console.error('Error loading contract:', error);
      throw error;
    }
  }

  async getContract() {
    if(!this.contract) {
      await this.loadContract();
    }
    return this.contract;
  }


  // -------------------------
  //  Smart contract functions
  // -------------------------

  // ✅ 1. Add Product
  @CheckMetaMask()
  async addProduct(
    manufacturerId: string,
    manufacturerName: string,
    productName: string,
    productSN: string,
    productBrand: string,
    productPrice: number,
    productId: number,
    productTime: string
  ): Promise<any> {
    try {
      if (!this.contract) {
        console.log("Contract not working metamask is down add product");
        throw new Error('Contract not loaded.');
      }

      const tx = await this.contract['addProduct'](
        ethers.encodeBytes32String(manufacturerId),
        ethers.encodeBytes32String(manufacturerName),
        ethers.encodeBytes32String(productName),
        ethers.encodeBytes32String(productSN),
        ethers.encodeBytes32String(productBrand),
        productPrice,
        productId,
        ethers.encodeBytes32String(productTime)
      );
      console.log("time = ", productTime);
      console.log("time = ", ethers.encodeBytes32String(productTime));
      console.log(`🚀 Transaction sent! Hash: ${tx.hash}`);

      // Wait for the transaction to be mined (1 confirmation)
      const receipt = await tx.wait();

      console.log('✅ Transaction confirmed!');
      console.log('📄 Receipt:', receipt);

      // await tx.wait();
      console.log('✅ Product added successfully!');
      return receipt;
    } catch (error) {
      console.error('Error in addProduct:', error);
      throw error;
    }
  }

  // ✅ 2. Query Manufacturer Inventory
  @CheckMetaMask()
  async queryManufacturerInventory(manufacturerId: string) : Promise<{inventory: any[], totalUnits: number}> {
    try {
      const contract = await this.getContract();
      if (!this.contract) throw new Error('Contract not loaded.');

      const encodedId = ethers.encodeBytes32String(manufacturerId);

      const [pids, pnames, pbrand, pcounts, count] = await this.contract['queryInventory'](encodedId);

      const inventory = pids.map((pid: any, i: number) => ({
        productId: pid.toString(),
        name: ethers.decodeBytes32String(pnames[i]),
        brand: ethers.decodeBytes32String(pbrand[i]),
        units: Number(pcounts[i]),
      }));
      const totalUnits = Number(count);

      console.log('✅ Inventory fetched:', inventory);
      console.log('✅ totalUnits fetched:', totalUnits);
      return {inventory, totalUnits};
    }
    catch (error) {
      console.error('Error querying inventory:', error);
      return {inventory: [], totalUnits: 0};
    }
  }

  // ✅ 3A. Add Seller first check conflict
  async checkSellerConflict(
    sellerID: string,
    sellerName: string,
    sellerBrand: string,
    sellerNum: number,
    sellerManager: string,
    sellerAddress: string
  ) {
    if (!this.contract) throw new Error('Contract not loaded.');

    const encodedSellerID = ethers.encodeBytes32String(sellerID);
    const encodedSellerName = ethers.encodeBytes32String(sellerName);
    const encodedSellerBrand = ethers.encodeBytes32String(sellerBrand);
    const encodedSellerManager = ethers.encodeBytes32String(sellerManager);
    const encodedSellerAddress = ethers.encodeBytes32String(sellerAddress);

    const [exists, hasConflict, existingSeller] =
      await this.contract['checkSellerConflict'](
        encodedSellerID,
        encodedSellerName,
        encodedSellerBrand,
        sellerNum,
        encodedSellerManager,
        encodedSellerAddress
      );

    let decodedExisting: any = null;

    if (exists) {
      decodedExisting = {
        sellerId: sellerID,
        sellerName: ethers.decodeBytes32String(existingSeller.sellerName),
        sellerBrand: ethers.decodeBytes32String(existingSeller.sellerBrand),
        sellerNum: existingSeller.sellerNum,
        sellerManager: ethers.decodeBytes32String(existingSeller.sellerManager),
        sellerAddress: ethers.decodeBytes32String(existingSeller.sellerAddress)
      }
    }

    return {
      exists,
      hasConflict,
      existingSeller: decodedExisting,
      enteredSeller: {
        sellerId: sellerID,
        sellerName,
        sellerBrand,
        sellerNum,
        sellerManager,
        sellerAddress
      }
    };
  }

  // ✅ 3B. Add Seller
  async addSeller(
      manufacturerId: string,
      sellerName: string,
      sellerBrand: string,
      sellerID: string,
      sellerNum: number,
      sellerManager: string,
      sellerAddress: string
  ): Promise<boolean> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode all string parameters to bytes32 (as required by Solidity)
      const encodedManufacturerId = ethers.encodeBytes32String(manufacturerId);
      const encodedSellerName = ethers.encodeBytes32String(sellerName);
      const encodedSellerBrand = ethers.encodeBytes32String(sellerBrand);
      const encodedSellerID = ethers.encodeBytes32String(sellerID);
      const encodedSellerManager = ethers.encodeBytes32String(sellerManager);
      const encodedSellerAddress = ethers.encodeBytes32String(sellerAddress);

      try {
        await this.contract['addSeller'].staticCall(encodedManufacturerId, encodedSellerName, encodedSellerBrand, encodedSellerID, sellerNum, encodedSellerManager, encodedSellerAddress);
      } catch (staticError: any) {
        let message = "Transaction failed";
        if (staticError.reason) message = staticError.reason;
        throw new Error(message);
      }

      // Send the transaction
      const tx = await this.contract['addSeller'](encodedManufacturerId,encodedSellerName,encodedSellerBrand,encodedSellerID,sellerNum, encodedSellerManager, encodedSellerAddress);

      console.log('⏳ Transaction submitted:', tx);
      const receipt = await tx.wait();
      if (receipt.status !== 1) {
        console.log("transaction reverted")
        return false;
      }
      console.log('✅ Seller successfully added!');
      return true;
    } catch (error: any) {
      console.error('❌ Error adding seller:', error);
      throw error;
    }
  }

  // ✅ 4. Query Sellers
  async querySellersList(manufacturerId: string): Promise<any[]> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      const encodedManufacturerId = ethers.encodeBytes32String(manufacturerId);

      const [sellerIds, snames, sbrands, snums, smanagers, saddress] =
          await this.contract['querySellersList'](encodedManufacturerId);

      const sellers = sellerIds.map((sid: string, i: number) => ({
        sellerId: ethers.decodeBytes32String(sid),
        sellerName: ethers.decodeBytes32String(snames[i]),
        sellerBrand: ethers.decodeBytes32String(sbrands[i]),
        sellerNum: Number(snums[i]),
        sellerManager: ethers.decodeBytes32String(smanagers[i]),
        sellerAddress: ethers.decodeBytes32String(saddress[i])
      }));

      return sellers;
    } catch (error) {
      console.error('❌ Error querying sellers list:', error);
      return [];
    }
  }

  // ✅ 5. Manufacturer → Sell Product to Seller
  async manufacturerSellProduct(productSN: string, sellerID: string, manufacturerID: string): Promise<boolean> {
    try {
      if (!this.contract) {
        console.log("Contract not working metamask is down");
        throw new Error('Contract not loaded.');
      }

      // Encode inputs to bytes32
      const encodedProductSN = ethers.encodeBytes32String(productSN);
      const encodedSellerID = ethers.encodeBytes32String(sellerID);
      const encodedmanufacturerID = ethers.encodeBytes32String(manufacturerID);
      const encodedProductTime = ethers.encodeBytes32String(new Date().toISOString());

      // Making a static call to the contract to get the error if any
      try {
        await this.contract['manufacturerSellProduct'].staticCall(encodedProductSN, encodedSellerID, encodedmanufacturerID, encodedProductTime);
      } catch (staticError: any) {
        let message = "Transaction failed";
        if (staticError.reason) message = staticError.reason;
        console.log(message);
        throw new Error(message);
      }

      // Call the smart contract function
      const tx = await this.contract['manufacturerSellProduct'](
          encodedProductSN,
          encodedSellerID,
          encodedmanufacturerID,
          encodedProductTime
      );

      console.log('📦 Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      if(receipt.status !== 1) {
        console.log("transaction reverted")
        return false;
      }
      console.log('✅ Product sold successfully! Tx confirmed:', receipt.transactionHash);
      return true;
    } catch (error: any) {
      console.error('❌ Error selling product to seller:', error);
      throw error;
    }
  }

  // ✅ 6. Seller → Sell Product to Consumer
  async sellerSellProduct(productSN: string, consumerID: string): Promise<boolean> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode to bytes32
      const encodedProductSN = ethers.encodeBytes32String(productSN);
      const encodedConsumerID = ethers.encodeBytes32String(consumerID);
      const encodedProductTime = ethers.encodeBytes32String(new Date().toISOString());

      console.log('🧾 Selling product:', {
        productSN,
        consumerID,
        encodedProductSN,
        encodedConsumerID,
        encodedProductTime
      });

      // Send transaction to blockchain
      const tx = await this.contract['sellerSellProduct'](
        encodedProductSN,
        encodedConsumerID,
        encodedProductTime
      );

      console.log('⏳ Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);

      return true;
    } catch (error) {
      console.error('❌ Error selling product to consumer:', error);
      return false;
    }
  }

  // ✅ 7. Check seller inventory
  async querySellerInventory(sellerId: string): Promise<any[]> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode seller ID to bytes32
      const encodedSellerId = ethers.encodeBytes32String(sellerId);

      // Call the smart contract function
      const [mids, productSNs, pnames, pbrands, pprices, pstatus] =
        await this.contract['queryProductsList'](encodedSellerId);

      // Map and decode each product entry
      const products = productSNs.map((sn: any, i: number) => ({
        manufacturerId: ethers.decodeBytes32String(mids[i]),
        productSN: ethers.decodeBytes32String(sn),
        name: ethers.decodeBytes32String(pnames[i]),
        brand: ethers.decodeBytes32String(pbrands[i]),
        price: Number(pprices[i]),
        status: ethers.decodeBytes32String(pstatus[i])
      }));

      console.log('✅ Products fetched:', products);
      return products;
    } catch (error) {
      console.error('❌ Error querying products list:', error);
      return [];
    }
  }

  // ✅ 8. Consumer purchase history
  async getPurchaseHistory(consumerId: string): Promise<any[]> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode consumer ID to bytes32
      const encodedConsumerId = ethers.encodeBytes32String(consumerId);

      // Call the smart contract function
      const [
        productSNs,
        manufacturerIDs,
        manufacturingTimes,
        sellerIDs,
        manufacToSellerTimes,
        sellingTimes
      ] = await this.contract['getPurchaseHistory'](encodedConsumerId);

      const formatTime = (bytes32Time: string) => {
        const decoded = ethers.decodeBytes32String(bytes32Time);
        return decoded ? new Date(decoded).toLocaleString() : '-';
      };

      // Map and decode each product entry
      const history = productSNs.map((sn: any, i: number) => ({
        productSN: ethers.decodeBytes32String(sn),
        manufacturerId: ethers.decodeBytes32String(manufacturerIDs[i]),
        manufacturingTime: formatTime(manufacturingTimes[i]),
        sellerId: ethers.decodeBytes32String(sellerIDs[i]),
        manufacturerToSellerTime: formatTime(manufacToSellerTimes[i]),
        sellingTime: formatTime(sellingTimes[i])
      }));

      console.log('✅ Purchase history fetched:', history);
      return history;
    } catch (error) {
      console.error('❌ Error querying purchase history:', error);
      return [];
    }
  }

  // ✅ 9. Verify Product
  async verifyProduct(productSN: string, consumerId: string): Promise<{ isVerified: boolean; actualConsumer: string }> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode inputs to bytes32
      const encodedProductSN = ethers.encodeBytes32String(productSN);
      const encodedConsumerId = ethers.encodeBytes32String(consumerId);

      // Call the smart contract function
      const [isVerified, actualConsumerBytes] = await this.contract['verifyProduct'](
        encodedProductSN,
        encodedConsumerId
      );

      // Decode the returned consumer ID
      let actualConsumer = '';
      try {
        actualConsumer = ethers.toUtf8String(actualConsumerBytes).replace(/\u0000/g, '');
      } catch {
        actualConsumer = actualConsumerBytes; // fallback: raw hex
      }

      console.log('✅ Product verification result:', {isVerified, actualConsumer});

      return {
        isVerified,
        actualConsumer,
      };
    } catch (error) {
      console.error('❌ Error verifying product:', error);
      return {isVerified: false, actualConsumer: ''};
    }
  }


}
