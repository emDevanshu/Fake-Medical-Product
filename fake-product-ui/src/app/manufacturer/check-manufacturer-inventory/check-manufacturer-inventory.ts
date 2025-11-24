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
  manufacturerName! : string;
  totalUnits: number = 0;

  constructor(private web3: Web3Service, private authService : AuthService, private cdr : ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.manufacturerAddress = this.web3.getAccount() || '';
    const mid = this.authService.getManufacturerId();
    const name = this.authService.getManufacturerName();
    if (mid) this.manufacturerID = mid;
    if (name) this.manufacturerName = name;
    await this.getInventory();
  }

  async getInventory() {
    try {
      this.loading = true;
      const result = await this.web3.queryManufacturerInventory(this.manufacturerID);
      this.inventory = result?.inventory;
      this.totalUnits = result?.totalUnits;
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    window.history.back();
  }
}
