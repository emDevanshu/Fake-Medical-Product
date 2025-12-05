import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Web3Service} from '../../services/web3.service';
import {PopupDialogComponent} from '../../shared/popup-dialog/popup-dialog';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-seller',
  imports: [
    FormsModule,
    PopupDialogComponent,
    NgIf
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

  duplicatePopup = false;
  duplicateData: any = {};
  existingSellerToAdd: any = null;

  constructor(private authService : AuthService, private web3Service : Web3Service, private cdr : ChangeDetectorRef) {
  }

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
  }

  async addSeller() {
    this.popup.openLoading("Checking seller details...");
    try {
      const conflictInfo = await this.web3Service.checkSellerConflict(
        this.SellerID,
        this.SellerName,
        this.SellerBrand,
        this.SellerPhoneNumber,
        this.SellerManager,
        this.SellerAddress
      );

      console.log("Conflict Info → ", conflictInfo);

      // 2️⃣ If conflict exists → Show modal
      if (conflictInfo.hasConflict) {
        this.popup.close();
        this.duplicateData = {
          existing: conflictInfo.existingSeller,
          entered: conflictInfo.enteredSeller
        };
        this.existingSellerToAdd = conflictInfo.existingSeller;

        this.duplicatePopup = true;
        this.cdr.detectChanges();
        return; // ❗ STOP the addSeller flow here
      }

      // No conflict → directly add
      this.popup.openLoading("Creating blockchain transaction...");
      await this.proceedAddSeller();
    }
    catch (error : any) {
      this.popup.open({
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }

  async proceedAddSeller() {
    this.popup.openLoading("Creating blockchain transaction...");
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
        this.popup.open({
          success: true,
          message: "Seller added successfully."
        });
      } else {
        this.popup.open({
          success: false,
          message: "Transaction failed. Try again."
        });
      }

    } catch (error: any) {
      this.popup.open({
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }

  async addExistingSeller() {
    this.duplicatePopup = false;
    this.popup.openLoading("Adding existing seller from records...");
    try {
      const s = this.existingSellerToAdd;

      const success = await this.web3Service.addSeller(
        this.manufacturerID,
        s.sellerName,
        s.sellerBrand,
        s.sellerId,
        s.sellerNum,
        s.sellerManager,
        s.sellerAddress
      );

      if (success) {
        this.popup.open({
          success: true,
          message: "Existing seller added successfully."
        });
      }

    } catch (err: any) {
      this.popup.open({
        success: false,
        message: err.message || "Failed to add existing seller"
      });
    }
  }

  cancelAdd() {
    this.duplicatePopup = false;
    this.cdr.detectChanges();
  }

  goBack() {
    window.history.back();
  }
}
