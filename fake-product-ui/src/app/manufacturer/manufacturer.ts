import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-manufacturer',
  imports: [
    NgIf, RouterModule
  ],
  templateUrl: './manufacturer.html',
  styleUrl: './manufacturer.css',
})
export class ManufacturerComponent {
  companyName : string = "Devanshu";
  dropdownOpen = false;

  constructor() {
    console.log("manufacturer is working !!!");
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    // Your logout logic
    console.log('Logging out...');
  }

}
