import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';

@Component({
  selector: 'app-purchase-history',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './purchase-history.html',
  styleUrl: './purchase-history.css',
})
export class PurchaseHistoryComponent {
  consumerId! : string;
  loading : boolean = false;
  consumerProducts: any[] = [];

  constructor(private web3Service : Web3Service, private cdr : ChangeDetectorRef) {
  }

  async getConsumerProducts() {
    this.loading = true;
    try {
      this.consumerProducts = await this.web3Service.getPurchaseHistory(this.consumerId);
    } catch (err) {
      console.error('Failed to fetch purchase history:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  goBack() {
    window.history.back();
  }

}
