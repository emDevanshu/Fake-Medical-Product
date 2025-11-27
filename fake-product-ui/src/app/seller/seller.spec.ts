// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { provideZonelessChangeDetection } from '@angular/core';
// import { SellerComponent } from './seller';
// import { Web3Service } from '../services/web3.service';
// import { AuthService } from '../services/auth.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
//
// fdescribe('SellerComponent', () => {
//   let component: SellerComponent;
//   let fixture: ComponentFixture<SellerComponent>;
//   let web3ServiceSpy: jasmine.SpyObj<Web3Service>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let routerSpy: jasmine.SpyObj<Router>;
//
//   beforeEach(async () => {
//     web3ServiceSpy = jasmine.createSpyObj('Web3Service', ['connectWallet', 'loadContract']);
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//
//     await TestBed.configureTestingModule({
//       imports: [SellerComponent], // Standalone component
//       providers: [
//         { provide: Web3Service, useValue: web3ServiceSpy },
//         { provide: AuthService, useValue: authServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             queryParams: of({})
//           }
//         },
//         provideZonelessChangeDetection()
//       ]
//     })
//       .compileComponents();
//
//     fixture = TestBed.createComponent(SellerComponent);
//     component = fixture.componentInstance;
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   describe('ngOnInit', () => {
//     it('should connect wallet and load contract if connection is successful', fakeAsync(() => {
//       web3ServiceSpy.connectWallet.and.returnValue(Promise.resolve(true));
//       web3ServiceSpy.loadContract.and.returnValue(Promise.resolve());
//
//       component.ngOnInit();
//       tick();
//
//       expect(web3ServiceSpy.connectWallet).toHaveBeenCalled();
//       expect(web3ServiceSpy.loadContract).toHaveBeenCalled();
//       expect(routerSpy.navigate).not.toHaveBeenCalled();
//     }));
//
//     it('should redirect to login if wallet connection fails', fakeAsync(() => {
//       web3ServiceSpy.connectWallet.and.returnValue(Promise.resolve(false));
//
//       component.ngOnInit();
//       tick();
//
//       expect(web3ServiceSpy.connectWallet).toHaveBeenCalled();
//       expect(web3ServiceSpy.loadContract).not.toHaveBeenCalled();
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/login', 'seller'], {
//         queryParams: { error: 'wallet-connection-failed' }
//       });
//     }));
//   });
//
//   describe('toggleDropdown', () => {
//     it('should toggle dropdownOpen state', () => {
//       expect(component.dropdownOpen).toBeFalse();
//
//       component.toggleDropdown();
//       expect(component.dropdownOpen).toBeTrue();
//
//       component.toggleDropdown();
//       expect(component.dropdownOpen).toBeFalse();
//     });
//   });
//
//   describe('logout', () => {
//     it('should call authService.logout and navigate to login', () => {
//       component.logout();
//
//       expect(authServiceSpy.logout).toHaveBeenCalled();
//       expect(routerSpy.navigate).toHaveBeenCalledWith(['/login/seller']);
//     });
//   });
// });
