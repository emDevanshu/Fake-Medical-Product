import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-seller-inventory',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './seller-inventory.html',
  styleUrl: './seller-inventory.css',
})
export class SellerInventoryComponent implements OnInit{
  loading = false;
  userAddress!: string;
  sellerId! : string;
  inventory : any[] = [];

  constructor(private web3Service : Web3Service, private authService : AuthService, private cdr : ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.userAddress = this.web3Service.getAccount() || '';
    const sid = this.authService.getSellerId();
    if (sid) this.sellerId = sid;
    console.log("sid", sid);
    console.log("userAddress", this.userAddress);
    await this.querySellerInventory();
  }

  async querySellerInventory() {
    this.loading = true;
    try {
      this.inventory = await this.web3Service.querySellerInventory(this.sellerId);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    window.history.back();
  }

}
