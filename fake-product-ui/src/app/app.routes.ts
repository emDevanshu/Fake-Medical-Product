import { Routes } from '@angular/router';
import { Home } from './home/home'
import {ManufacturerComponent} from './manufacturer/manufacturer';
import {LoginComponent} from './login/login';
import {SellerComponent} from './seller/seller';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login/:userType', component: LoginComponent},
  {path: 'manufacturer', component: ManufacturerComponent},
  {path: 'seller', component: SellerComponent},
  // {path: 'consumer', component: ConsumerComponent},
  // {path: 'about', component: AboutComponent},
];
