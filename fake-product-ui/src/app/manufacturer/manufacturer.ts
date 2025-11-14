import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Web3Service} from '../services/web3.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-manufacturer',
  imports: [
    NgIf, RouterModule
  ],
  templateUrl: './manufacturer.html',
  styleUrl: './manufacturer.css',
})
export class ManufacturerComponent implements OnInit{
  companyName : string = "Devanshu";
  dropdownOpen = false;

  constructor(private router : Router, private web3 : Web3Service, private authService : AuthService) {
    console.log("manufacturer is working !!!");
  }

  async ngOnInit() {
    const isConnected = await this.web3.connectWallet();
    if(!isConnected) {
      this.router.navigate(['/login', 'manufacturer'], {
        queryParams: {error: 'wallet-connection-failed'}
      });
      return;
    }
    await this.web3.loadContract();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    // Your logout logic
    this.authService.logout();
    this.router.navigate(['/login/manufacturer']);
    console.log('Logging out...');
  }

}
