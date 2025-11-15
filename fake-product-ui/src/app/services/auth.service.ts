import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private manufacturerIdKey = 'manufacturer_id';
  private manufacturerNameKey = 'manufacturer_name';
  private sellerIdKey = 'seller_id';

  // ✅ Store manufacturer ID in localStorage
  setManufacturerId(id: string) {
    localStorage.setItem(this.manufacturerIdKey, id);
  }

  // ✅ Retrieve manufacturer ID
  getManufacturerId(): string | null {
    return localStorage.getItem(this.manufacturerIdKey);
  }

  // ✅ Store manufacturer name in localStorage
  setManufacturerName(username: string) {
    localStorage.setItem(this.manufacturerNameKey, username);
  }

  // ✅ Retrieve manufacturer name
  getManufacturerName(): string | null {
    return localStorage.getItem(this.manufacturerNameKey);
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
  logout() {
    localStorage.removeItem(this.manufacturerIdKey);
    localStorage.removeItem(this.sellerIdKey);
  }
}
