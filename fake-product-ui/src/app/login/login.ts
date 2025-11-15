import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit{
  userType: 'manufacturer' | 'seller' = 'manufacturer';
  title = '';
  username = '';
  password = '';
  extraId = '';
  message = '';

  private readonly manufacturerUsers = [
    {username: 'Cipla', password: 'password1', mid: '01'},
    {username: 'user2', password: 'password2', mid: '02'},
    {username: 'user3', password: 'password3', mid: '03'}
  ];

  private readonly sellerUsers = [
    {username: 'seller1', password: 'pass1', sid: '13'},
    {username: 'seller2', password: 'pass2', sid: '10'},
    {username: 'seller3', password: 'pass3', sid: '20'}
  ];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.route.paramMap.subscribe(params => {
      const type = params.get('userType');
      if (type === 'seller' || type === 'manufacturer') {
        this.userType = type;
        this.title = `${this.capitalize(type)} Login`;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'wallet-connection-failed') {
        alert("Wallet connection failed. Please try again.");
      }
    });
  }


  login() {
    if (this.userType === 'manufacturer') {
      const user = this.manufacturerUsers.find(u =>
        u.username === this.username &&
        u.password === this.password &&
        u.mid === this.extraId
      );

      if (user) {
        this.message = '✅ Manufacturer logged in successfully!';
        this.authService.setManufacturerId(user.mid);
        this.authService.setManufacturerName(user.username);
        setTimeout(() => this.router.navigate(['/manufacturer']), 500);
      } else {
        this.message = '❌ Invalid credentials or MID';
      }
    } else {
      const user = this.sellerUsers.find(u =>
        u.username === this.username &&
        u.password === this.password &&
        u.sid === this.extraId
      );

      if (user) {
        this.message = '✅ Seller logged in successfully!';
        this.authService.setSellerId(user.sid);
        setTimeout(() => this.router.navigate(['/seller']), 500);
      } else {
        this.message = '❌ Invalid credentials or SID';
      }
    }
  }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
