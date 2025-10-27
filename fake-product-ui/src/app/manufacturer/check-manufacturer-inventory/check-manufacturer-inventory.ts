import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Web3Service} from '../../services/web3.service';
import {CommonModule, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-check-manufacturer-inventory',
  templateUrl: './check-manufacturer-inventory.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./check-manufacturer-inventory.css']
})
export class CheckInventoryComponent implements OnInit {
  manufacturerAddress: string = '';
  inventory: any[] = [];
  loading = false;
  manufacturerID! : string;

  constructor(private web3: Web3Service, private authService : AuthService, private cdr : ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.manufacturerAddress = this.web3.getAccount() || '';
    const mid = this.authService.getManufacturerId();
    if (mid) this.manufacturerID = mid;
    await this.getInventory();
  }

  async getInventory() {
    try {
      this.loading = true;

      const inventory = await this.web3.queryInventory(this.manufacturerID);
      this.inventory = inventory;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    window.history.back();
  }
}
