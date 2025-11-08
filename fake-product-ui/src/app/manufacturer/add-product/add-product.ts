import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {saveAs} from 'file-saver';
import {NgClass, NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Web3Service} from '../../services/web3.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-add-product',
  imports: [
    FormsModule,
    NgIf,
    RouterModule,
    NgClass
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProductComponent implements OnInit{
  manufacturerID! : string;
  productName = '';
  productID! : number;
  productBrand = '';
  productPrice! : number;
  productAdded : boolean = false;

  qrValue: string | null = null;
  qrImageSrc: string | null = null;

  constructor(private web3Service : Web3Service, private authService : AuthService, private cdr : ChangeDetectorRef) {}

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if(mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
  }

  async addProduct() {
    try {
      // Generate random number for QR
      const randomNo = Math.floor(Math.random() * 1000) + 1;

      // Construct QR value
      this.qrValue = `${this.manufacturerID}@${this.productID}@${randomNo}`;
      console.log('QR Value:', this.qrValue);

      const receipt = await this.web3Service.addProduct(this.manufacturerID, this.productName, this.qrValue, this.productBrand, this.productPrice, this.productID, new Date().toISOString());
      if (receipt?.status === 1) {
        this.qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.qrValue}`;
        this.productAdded = true;
        this.cdr.detectChanges();
      } else {
        console.log("❌Transaction Failed : status 0", receipt);
      }
    }
     catch (err) {
       console.error("Error while adding product:", err);
     }
  }

  downloadQR() {
    if (this.qrImageSrc && this.qrValue) {
      saveAs(this.qrImageSrc, `${this.qrValue}.png`);
    }
  }

  goBack() {
    window.history.back();
  }

}
