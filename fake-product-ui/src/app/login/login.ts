import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Web3Service} from '../services/web3.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  userType: 'manufacturer' | 'seller' = 'manufacturer';
  title = '';
  username = '';
  message = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private web3Service: Web3Service
  ) {
    this.route.paramMap.subscribe((params) => {
      const type = params.get('userType');
      if (type === 'seller' || type === 'manufacturer') {
        this.userType = type;
        this.title = `${this.capitalize(type)} Login`;
      }
    });
  }

  async login() {
    this.message = '';
    this.loading = true;

    try {
      // ✅ 1. Connect MetaMask via web3Service
      await this.web3Service.connectWallet();
      const walletAddress = this.web3Service.getAccount();
      if (!walletAddress) throw new Error('Wallet not connected.');

      console.log('🔗 Connected wallet:', walletAddress);

      // ✅ 2. Register user (first-time only)
      const registerResp = await this.authService
        .registerUser(this.username, walletAddress, this.userType.toUpperCase())
        .toPromise();

      if (!registerResp.success && registerResp.message !== 'Wallet already registered') {
        throw new Error(registerResp.message || 'Registration failed');
      }

      // ✅ 3. Get nonce from backend
      const nonceResp = await this.authService.getNonce(walletAddress).toPromise();
      const nonce = nonceResp?.nonce;
      if (!nonce) throw new Error('Nonce not received from backend.');
      console.log('🧾 Nonce received:', nonce);

      // ✅ 4. Sign nonce using MetaMask
      const provider = this.web3Service.getProvider();
      const signer = await provider?.getSigner();
      const signature = await signer?.signMessage(nonce);
      if (!signature) throw new Error('Signature not generated.');
      console.log('✍️ Signature:', signature);

      console.log("wallet:", walletAddress);
      console.log("signature:", signature);

      // ✅ 5. Verify signature on backend

      const verifyResp = await this.authService.verifySignature(walletAddress, signature, "MANUFACTURER").toPromise();
      if (!verifyResp.success) throw new Error(verifyResp.message);

      // ✅ 6. Store token and user data
      this.authService.storeAuthData(verifyResp.token, verifyResp.user);
      this.message = '✅ Login successful! Redirecting...';

      // ✅ 7. Navigate to dashboard
      setTimeout(() => {
        this.router.navigate([`/${this.userType}`]);
      }, 1000);
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      this.message = err.message || 'Login failed. Try again.';
    } finally {
      this.loading = false;
    }
  }








  // userType: 'manufacturer' | 'seller' = 'manufacturer';
  // title = '';
  // username = '';
  // password = '';
  // extraId = '';
  // message = '';
  //
  // private readonly manufacturerUsers = [
  //   {username: 'user1', password: 'password1', mid: '01'},
  //   {username: 'user2', password: 'password2', mid: '02'},
  //   {username: 'user3', password: 'password3', mid: '03'}
  // ];
  //
  // private readonly sellerUsers = [
  //   {username: 'seller1', password: 'pass1', sid: '13'},
  //   {username: 'seller2', password: 'pass2', sid: 'S02'},
  //   {username: 'seller3', password: 'pass3', sid: 'S03'}
  // ];
  //
  // constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  //   this.route.paramMap.subscribe(params => {
  //     const type = params.get('userType');
  //     if (type === 'seller' || type === 'manufacturer') {
  //       this.userType = type;
  //       this.title = `${this.capitalize(type)} Login`;
  //     }
  //   });
  // }
  //
  // login() {
  //   if (this.userType === 'manufacturer') {
  //     const user = this.manufacturerUsers.find(u =>
  //       u.username === this.username &&
  //       u.password === this.password &&
  //       u.mid === this.extraId
  //     );
  //
  //     if (user) {
  //       this.message = '✅ Manufacturer logged in successfully!';
  //       this.authService.setManufacturerId(user.mid);
  //       setTimeout(() => this.router.navigate(['/manufacturer']), 500);
  //     } else {
  //       this.message = '❌ Invalid credentials or MID';
  //     }
  //   } else {
  //     const user = this.sellerUsers.find(u =>
  //       u.username === this.username &&
  //       u.password === this.password &&
  //       u.sid === this.extraId
  //     );
  //
  //     if (user) {
  //       this.message = '✅ Seller logged in successfully!';
  //       this.authService.setSellerId(user.sid);
  //       setTimeout(() => this.router.navigate(['/seller']), 500);
  //     } else {
  //       this.message = '❌ Invalid credentials or SID';
  //     }
  //   }
  // }

  private capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  goBack() {
    window.history.back();
  }
}
