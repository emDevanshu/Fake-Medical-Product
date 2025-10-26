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

  private accountAddress: string | null = null;
  private accountBalance: string | null = null;

  constructor() {
    this.checkMetaMask();
  }

  private async checkMetaMask() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    } else {
      alert('MetaMask not detected! Please install MetaMask extension.');
    }
  }

  async connectWallet(): Promise<void> {
    if (!this.provider) return;

    // Request account access
    await (window as any).ethereum.request({method: 'eth_requestAccounts'});

    const signer = await this.provider.getSigner();
    this.accountAddress = await signer.getAddress();

    const balance = await this.provider.getBalance(this.accountAddress);
    this.accountBalance = ethers.formatEther(balance);
  }

  async getBalance() : Promise<string | null> {
    if(!this.provider || !this.accountAddress) return null;

    const balance = await this.provider.getBalance(this.accountAddress);
    return ethers.formatEther(balance);
  }

  getAccount(): string | null {
    return this.accountAddress;
  }
}
