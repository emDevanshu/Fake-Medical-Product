import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Web3Service} from '../services/web3.service';

@Component({
  selector: 'app-seller',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './seller.html',
  styleUrl: './seller.css',
})
export class SellerComponent implements OnInit{
  isMenuOpen = false;
  dropdownOpen = false;
  companyName: string = "Devanshu";

  constructor(private web3: Web3Service, private router : Router, private authService: AuthService) {}

  async ngOnInit() {
    await this.web3.connectWallet();
    await this.web3.loadContract();
  }

  // alertMsg() {
  //   alert("You are being redirected to the home page.");
  //   return true;
  // }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    // Your logout logic
    this.authService.logout();
    this.router.navigate(['/login/seller']);
    console.log('Logging out...');
  }

}
