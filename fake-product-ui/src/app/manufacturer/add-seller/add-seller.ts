import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Web3Service} from '../../services/web3.service';
import {PopupDialogComponent} from '../../shared/popup-dialog/popup-dialog';

@Component({
  selector: 'app-add-seller',
  imports: [
    FormsModule,
    PopupDialogComponent
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

  @ViewChild('popup') popup!: PopupDialogComponent;

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
        this.popup.open({
          success: true,
          message: "Seller added successfully."
        });
      } else {
        alert('Transaction failed. Please try again.');
      }
    }
    catch (error : any) {
      if (error.message) {
        this.popup.open({
          success: false,
          message: error.message || "Something went wrong"
        });
      } else {
        alert("Transaction failed. Check console.");
      }
    }
  }

  goBack() {
    window.history.back();
  }
}
