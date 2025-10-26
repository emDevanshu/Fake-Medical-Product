import { Routes } from '@angular/router';
import { Home } from './home/home'
import {ManufacturerComponent} from './manufacturer/manufacturer';
import {LoginComponent} from './login/login';
import {SellerComponent} from './seller/seller';
import {AddProductComponent} from './manufacturer/add-product/add-product';
import {CheckInventoryComponent} from './manufacturer/check-manufacturer-inventory/check-manufacturer-inventory';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login/:userType', component: LoginComponent},
  {path: 'manufacturer', component: ManufacturerComponent},
  {path: 'seller', component: SellerComponent},
  {path: 'manufacturer/add-product', component: AddProductComponent},
  {path: 'manufacturer/check-inventory', component: CheckInventoryComponent}
  // {path: 'consumer', component: ConsumerComponent},
  // {path: 'about', component: AboutComponent},
];
