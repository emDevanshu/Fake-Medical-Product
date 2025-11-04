import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Spring Boot backend URL
  private jwtKey = 'jwt_token';
  private userKey = 'user_data';

  constructor(private http: HttpClient) {
  }

  getNonce(walletAddress: string) {
    return this.http.get<{ nonce: string }>(`${this.apiUrl}/nonce/${walletAddress}`);
  }

  verifySignature(walletAddress: string, signature: string, role : string) {
    return this.http.post<any>(`${this.apiUrl}/verify`, {walletAddress, signature, role});
  }

  registerUser(username: string, walletAddress: string, role: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, {username, walletAddress, role});
  }

  storeAuthData(token: string, user: any) {
    localStorage.setItem(this.jwtKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem(this.userKey);
  }







  private manufacturerIdKey = 'manufacturer_id';
  private sellerIdKey = 'seller_id';

  // ✅ Store manufacturer ID in localStorage
  setManufacturerId(id: string) {
    localStorage.setItem(this.manufacturerIdKey, id);
  }

  // ✅ Retrieve manufacturer ID
  getManufacturerId(): string | null {
    return localStorage.getItem(this.manufacturerIdKey);
  }

  // ✅ Store seller ID
  setSellerId(id: string) {
    localStorage.setItem(this.sellerIdKey, id);
  }

  // ✅ Retrieve seller ID
  getSellerId(): string | null {
    return localStorage.getItem(this.sellerIdKey);
  }

  // ✅ Clear everything on logout
  // logout() {
  //   localStorage.removeItem(this.manufacturerIdKey);
  //   localStorage.removeItem(this.sellerIdKey);
  // }
}
