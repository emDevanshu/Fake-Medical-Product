import {ChangeDetectorRef, Component} from '@angular/core';
import {Web3Service} from '../services/web3.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  account: string | null = null;
  balance: string | null = null;

  constructor(public web3 : Web3Service, private cdr : ChangeDetectorRef) {
  }

  // async connectWallet() : Promise<void> {
  //   await this.web3.connectWallet();
  //   this.account = this.web3.getAccount();
  //   this.balance = await this.web3.getBalance();
  //   this.cdr.detectChanges();
  // }

  async connectWallet() {
    await this.web3.connectWallet();
    this.account = this.web3.getAccount();
    this.balance = await this.web3.getBalance();
    this.cdr.detectChanges();
  }
}
