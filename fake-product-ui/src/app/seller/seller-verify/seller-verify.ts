import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Html5Qrcode} from "html5-qrcode";
import {Web3Service} from '../../services/web3.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-seller-verify',
  templateUrl: './seller-verify.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./seller-verify.css']
})
export class SellerVerifyComponent implements OnInit, OnDestroy {

  sellerId = ''; // fill from logged-in seller account
  scannedSN = '';
  productDetails: any = null;
  productsDispatched: string[] = [];
  scanner?: Html5Qrcode;
  scanning = false;
  errorMessage = '';
  loading = false;

  constructor(private web3: Web3Service, private cdr : ChangeDetectorRef) {
  }

  async ngOnInit() {
    // fetch sellerId from AuthService
    const storedSellerId = localStorage.getItem('seller_id');
    if (storedSellerId) {
      this.sellerId = storedSellerId;
    }
    await this.loadDispatched();
  }

  ngOnDestroy() {
    this.stopScanner();
  }

  async loadDispatched() {
    try {
      this.productsDispatched = await this.web3.getProductsForSeller(this.sellerId);
      this.cdr.detectChanges();
    } catch (err: any) {
      console.error('Error loading dispatched list', err);
      this.productsDispatched = [];
    }
  }

  startScanner() {
    if (this.scanning) return;
    this.scanner = new Html5Qrcode("qr-reader");
    const config = {fps: 10, qrbox: 250};
    this.scanning = true;

    this.scanner.start(
      {facingMode: "environment"},
      config,
      (decodedText, decodedResult) => {
        // on success
        console.log('QR decoded:', decodedText);
        this.onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // ignore scan errors
      }
    ).catch(err => {
      console.error('Scanner start error', err);
      this.errorMessage = 'Unable to start camera scanner. Please allow camera access or use manual input.';
      this.scanning = false;
    });
  }

  stopScanner() {
    if (this.scanner && this.scanning) {
      this.scanner.stop().then(() => {
        this.scanner?.clear();
        this.scanning = false;
      }).catch(err => console.warn('scanner stop error', err));
    }
  }

  async onScanSuccess(decodedText: string) {
    // assume QR contains exactly the productSN string
    this.scannedSN = decodedText.trim();
    this.stopScanner();
    await this.lookupProduct(this.scannedSN);
  }

  // manual lookup (if paste input)
  async lookupProduct(productSN: string) {
    if (!productSN) return;
    this.loading = true;
    this.productDetails = null;
    this.errorMessage = '';

    try {
      const details = await this.web3.verifyProductForSeller(productSN);
      if (!details) {
        this.errorMessage = 'Product not found on chain (unknown productSN)';
      } else {
        this.productDetails = details;
      }
      this.cdr.detectChanges();
    } catch (err: any) {
      console.error('verifyProduct err', err);
      this.errorMessage = err?.message || 'Verification failed';
    } finally {
      this.loading = false;
    }
  }

  // Acknowledge delivery of scanned product
  async acknowledge(productSN: string) {
    try {
      this.loading = true;
      const ok = await this.web3.acknowledgeDelivery(productSN, this.sellerId);
      if (ok) {
        alert('✅ Delivery acknowledged on-chain');
        // refresh lists/details
        await this.loadDispatched();
        await this.lookupProduct(productSN);
      } else {
        alert('🛑 Acknowledgement transaction reverted');
      }
    } catch (err: any) {
      alert(err?.message || 'Error acknowledging delivery');
    } finally {
      this.loading = false;
    }
  }

  goBack(){
    window.history.back();
  }
}
