import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {saveAs} from 'file-saver';
import {NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [
    FormsModule,
    NgIf,
    RouterModule
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProductComponent {
  manufacturerID = 'M-001'; // auto-filled
  productName = '';
  productID = '';
  productBrand = '';
  productPrice = '';

  qrValue: string | null = null;
  qrImageSrc: string | null = null;

  addProduct() {
    // Generate random number for QR
    const randomNo = Math.floor(Math.random() * 1000) + 1;

    // Construct QR value
    this.qrValue = `${this.manufacturerID}@${this.productID}@${randomNo}`;

    // Generate QR image URL using API
    this.qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.qrValue}`;

    console.log('QR Value:', this.qrValue);
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
