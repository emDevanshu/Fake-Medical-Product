import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Web3Service} from '../../services/web3.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-add-seller',
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './add-seller.html',
  styleUrl: './add-seller.css',
})
export class AddSellerComponent implements OnInit{
  manufacturerID!: string;
  SellerName: string = '';
  SellerBrand: string = '';
  SellerID: string ='';
  SellerPhoneNumber!: number;
  SellerManager: string ='';
  SellerAddress: string ='';

  // Popup state
  showPopup = false;
  popupTitle = '';
  popupMessage = '';
  popupSuccess = false;

  constructor(private authService : AuthService, private web3Service : Web3Service, private cdr : ChangeDetectorRef) {
  }

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
  }

  async addSeller() {
    try {
      const success = await this.web3Service.addSeller(
        this.manufacturerID,
        this.SellerName,
        this.SellerBrand,
        this.SellerID,
        this.SellerPhoneNumber,
        this.SellerManager,
        this.SellerAddress
      );

      if (success) {
        console.log('✅ Showing success popup');
        this.openPopup(true, "Seller added successfully.");
      } else {
        alert('Transaction failed. Please try again.');
      }
    }
    catch (error : any) {
      if (error.message) {
        this.openPopup(false, error.message);
      } else {
        alert("Transaction failed. Check console.");
      }
    }
  }

  goBack() {
    window.history.back();
  }

  openPopup(success: boolean, message: string) {
    this.popupSuccess = success;
    this.popupTitle = success ? "Transaction Successful!" : "Transaction Unsuccessful!";
    this.popupMessage = message;
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  closePopup(): void {
    this.showPopup = false;
    this.goBack();
  }
}
