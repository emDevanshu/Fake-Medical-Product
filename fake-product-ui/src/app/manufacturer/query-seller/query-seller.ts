import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';
import {Web3Service} from '../../services/web3.service';

@Component({
  selector: 'app-query-seller',
  imports: [
    CommonModule
  ],
  templateUrl: './query-seller.html',
  styleUrl: './query-seller.css',
})
export class QuerySellerComponent implements OnInit{
  manufacturerID!: string;
  userAddress: string = '';
  sellers: any[] = [];

  constructor(private authService : AuthService, private web3Service : Web3Service, private cdr : ChangeDetectorRef) {}

  ngOnInit() {
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    else alert('Manufacturer ID not found! Please log in again.');
    this.QuerySellers();

  }

  async QuerySellers() {
    const result = await this.web3Service.querySellersList(this.manufacturerID);
    this.sellers = result;
    this.cdr.detectChanges();
  }

  goBack() {
    window.history.back();
  }
}
