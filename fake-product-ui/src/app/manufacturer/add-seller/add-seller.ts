import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Web3Service} from '../../services/web3.service';

@Component({
  selector: 'app-add-seller',
  imports: [
    FormsModule
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

  constructor(private authService : AuthService, private web3Service : Web3Service) {
  }

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
  }

  async addSeller() {
    await this.web3Service.addSeller(
      this.manufacturerID,
      this.SellerName,
      this.SellerBrand,
      this.SellerID,
      this.SellerPhoneNumber,
      this.SellerManager,
      this.SellerAddress
    );
  }

  goBack() {
    window.history.back();
  }
}
