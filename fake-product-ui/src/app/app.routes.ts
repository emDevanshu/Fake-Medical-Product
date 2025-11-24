import { Routes } from '@angular/router';
import { Home } from './home/home'
import {ManufacturerComponent} from './manufacturer/manufacturer';
import {LoginComponent} from './login/login';
import {SellerComponent} from './seller/seller';
import {AddProductComponent} from './manufacturer/add-product/add-product';
import {CheckInventoryComponent} from './manufacturer/check-manufacturer-inventory/check-manufacturer-inventory';
import {AddSellerComponent} from './manufacturer/add-seller/add-seller';
import {QuerySellerComponent} from './manufacturer/query-seller/query-seller';
import {SellProductToSellerComponent} from './manufacturer/sell-product-to-seller/sell-product-to-seller';
import {SellProductToConsumerComponent} from './seller/sell-product-to-consumer/sell-product-to-consumer';
import {SellerInventoryComponent} from './seller/seller-inventory/seller-inventory';
import {ConsumerComponent} from './consumer/consumer';
import {PurchaseHistoryComponent} from './consumer/purchase-history/purchase-history';
import {ProductVerificationComponent} from './consumer/product-verification/product-verification';
import {SellerVerifyComponent} from './seller/seller-verify/seller-verify';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login/:userType', component: LoginComponent},
  {path: 'manufacturer', component: ManufacturerComponent},
  {path: 'seller', component: SellerComponent},
  {path: 'manufacturer/add-product', component: AddProductComponent},
  {path: 'manufacturer/check-inventory', component: CheckInventoryComponent},
  {path: 'manufacturer/add-seller', component: AddSellerComponent},
  {path: 'manufacturer/query-seller', component: QuerySellerComponent},
  {path: 'manufacturer/sell-product', component: SellProductToSellerComponent},
  {path: 'seller/sell-product', component: SellProductToConsumerComponent},
  {path: 'seller/check-inventory', component: SellerInventoryComponent},
  {path: 'seller/seller-verify', component: SellerVerifyComponent},
  {path: 'consumer', component: ConsumerComponent},
  {path: 'consumer/product-verification', component: ProductVerificationComponent},
  {path: 'consumer/purchase-history', component: PurchaseHistoryComponent},
  // {path: 'about', component: AboutComponent},
];
