import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-seller',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './seller.html',
  styleUrl: './seller.css',
})
export class SellerComponent {
  isMenuOpen = false;
  dropdownOpen = false;
  companyName: string = "Devanshu";

  constructor(private router : Router, private authService: AuthService) {}

  alertMsg() {
    alert("You are being redirected to the home page.");
    return true;
  }

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
