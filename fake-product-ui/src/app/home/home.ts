import { Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [CommonModule, RouterLink],
  styleUrl: './home.css',
})
export class Home {
  account: string | null = null;
  balance: string | null = null;

  // async connectWallet() : Promise<void> {
  //   await this.web3.connectWallet();
  //   this.account = this.web3.getAccount();
  //   this.balance = await this.web3.getBalance();
  //   this.cdr.detectChanges();
  // }
}
