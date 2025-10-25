import { Injectable } from '@angular/core';
import {ethers} from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider : ethers.BrowserProvider | null = null;
  private signer : ethers.Signer | null = null;
  private account : string | null = null;

  constructor() {}

  async connectWallet() : Promise<void> {
    if(typeof window.ethereum === 'undefined') {
      alert('MetaMask not found. Please install it first.');
      return
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.account = accounts[0];
      this.signer = await this.provider.getSigner();
      console.log('Connected account:', this.account);
    }
    catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }

  async getBalance() : Promise<string | null> {
    if(!this.provider || !this.account) return null;
    const balance = await this.provider.getBalance(this.account);
    return ethers.formatEther(balance);
  }

  getAccount(): string | null {
    return this.account;
  }
}
