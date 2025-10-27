import { Injectable } from '@angular/core';
import {ethers} from 'ethers';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';


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
  // private readonly CONTRACT_ADDRESS = '0x68deb564C861439EbaD08f3d07eF78D19230071b';
  private readonly ABI_PATH = 'assets/contracts/MedicalProduct.json';

  constructor( private http : HttpClient) {
    this.checkMetaMask();
  }

  private async checkMetaMask() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else {
      alert('MetaMask not detected! Please install MetaMask extension.');
    }
  }

  async connectWallet(): Promise<void> {
    if (!this.provider) return;

    // Request account access
    await (window as any).ethereum.request({method: 'eth_requestAccounts'});

    const signer = await this.provider.getSigner();
    this.accountAddress = await signer.getAddress();
    console.log("the account address is : " , this.accountAddress);

    const balance = await this.provider.getBalance(this.accountAddress);
    console.log("the balance is : ", balance);
    this.accountBalance = ethers.formatEther(balance);
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

  async loadContract(): Promise<void> {
    try {
      if (!this.provider) throw new Error('Provider not initialized');

      const contractJson = await firstValueFrom(this.http.get<any>(this.ABI_PATH));

      const abi = contractJson.abi;
      const CONTRACT_ADDRESS = contractJson.address;
      const signer = await this.provider.getSigner();

      this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      console.log('✅ Contract loaded at:', CONTRACT_ADDRESS);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  }

  getContract(): ethers.Contract | null {
    return this.contract;
  }


  // -------------------------
  //  Smart contract functions
  // -------------------------

  // ✅ 1. Add Product
  async addProduct(
    manufacturerId: string,
    productName: string,
    productSN: string,
    productBrand: string,
    productPrice: number,
    productId: number,
    productTime: string
  ): Promise<void> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      const tx = await this.contract['addProduct'](
        ethers.encodeBytes32String(manufacturerId),
        ethers.encodeBytes32String(productName),
        ethers.encodeBytes32String(productSN),
        ethers.encodeBytes32String(productBrand),
        productPrice,
        productId,
        ethers.encodeBytes32String(productTime)
      );
      console.log(`🚀 Transaction sent! Hash: ${tx.hash}`);

      // Wait for the transaction to be mined (1 confirmation)
      const receipt = await tx.wait();

      console.log('✅ Transaction confirmed!');
      console.log('📄 Receipt:', receipt);

      // await tx.wait();
      console.log('✅ Product added successfully!');
    } catch (error) {
      console.error('Error in addProduct:', error);
    }
  }

  // ✅ 2. Query Inventory
  async queryInventory(manufacturerId: string) : Promise<any[]> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      const encodedId = ethers.encodeBytes32String(manufacturerId);

      const [pids, pnames, pbrand, pcounts, count] = await this.contract['queryInventory'](encodedId);

      const inventory = pids.map((pid: any, i: number) => ({
        productId: pid.toString(),
        name: ethers.decodeBytes32String(pnames[i]),
        brand: ethers.decodeBytes32String(pbrand),
        units: Number(pcounts[i])
      }));

      console.log('✅ Inventory fetched:', inventory);
      return inventory;
    }
    catch (error) {
      console.error('Error querying inventory:', error);
      return [];
    }
  }

  // ✅ 3. Add Seller
  async addSeller(
      manufacturerId: string,
      sellerName: string,
      sellerBrand: string,
      sellerID: string,
      sellerNum: number,
      sellerManager: string,
      sellerAddress: string
  ): Promise<void> {
    try {
      if (!this.contract) throw new Error('Contract not loaded.');

      // Encode all string parameters to bytes32 (as required by Solidity)
      const encodedManufacturerId = ethers.encodeBytes32String(manufacturerId);
      const encodedSellerName = ethers.encodeBytes32String(sellerName);
      const encodedSellerBrand = ethers.encodeBytes32String(sellerBrand);
      const encodedSellerID = ethers.encodeBytes32String(sellerID);
      const encodedSellerManager = ethers.encodeBytes32String(sellerManager);
      const encodedSellerAddress = ethers.encodeBytes32String(sellerAddress);

      // Send the transaction
      const tx = await this.contract['addSeller'](
          encodedManufacturerId,
          encodedSellerName,
          encodedSellerBrand,
          encodedSellerID,
          sellerNum,
          encodedSellerManager,
          encodedSellerAddress
      );

      console.log('⏳ Transaction submitted:', tx);
      await tx.wait();
      console.log('✅ Seller successfully added!');
    } catch (error) {
      console.error('❌ Error adding seller:', error);
    }
  }

}
