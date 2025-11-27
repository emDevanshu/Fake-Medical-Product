import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

import { LoginComponent } from './login';
import { AuthService } from '../services/auth.service';
import { Web3Service } from '../services/web3.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockWeb3Service: jasmine.SpyObj<Web3Service>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'setManufacturerId',
      'setManufacturerName',
      'setSellerId'
    ]);
    mockWeb3Service = jasmine.createSpyObj('Web3Service', ['connectWallet']);

    // Mock ActivatedRoute with paramMap
    mockActivatedRoute = {
      paramMap: of(new Map([['userType', 'manufacturer']]))
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, CommonModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Web3Service, useValue: mockWeb3Service },
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Basic Component Tests
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.username).toBe('');
      expect(component.password).toBe('');
      expect(component.extraId).toBe('');
      expect(component.message).toBe('');
      expect(component.showPassword).toBeFalse();
    });

    it('should set title and userType based on route parameter - manufacturer', () => {
      expect(component.userType).toBe('manufacturer');
      expect(component.title).toBe('Manufacturer Login');
    });

    it('should set title and userType based on route parameter - seller', () => {
      // Update the mock route parameter
      mockActivatedRoute.paramMap = of(new Map([['userType', 'seller']]));

      // Create new component instance
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.userType).toBe('seller');
      expect(component.title).toBe('Seller Login');
    });
  });

  // Template Rendering Tests
  xdescribe('Template Rendering', () => {
    it('should display the title in multiple places', () => {
      component.title = 'Test Login';
      fixture.detectChanges();

      const titleElements = fixture.debugElement.queryAll(By.css('*'));
      const titlesInTemplate = titleElements.filter(el =>
        el.nativeElement.textContent?.includes('Test Login')
      );

      expect(titlesInTemplate.length).toBeGreaterThan(0);
    });

    it('should render username input field', () => {
      const usernameInput = fixture.debugElement.query(By.css('#username'));
      expect(usernameInput).toBeTruthy();
      expect(usernameInput.nativeElement.placeholder).toBe('Enter your username');
    });

    it('should render password input field with toggle button', () => {
      const passwordInput = fixture.debugElement.query(By.css('#password'));
      const toggleButton = fixture.debugElement.query(By.css('button[type="button"]'));

      expect(passwordInput).toBeTruthy();
      expect(toggleButton).toBeTruthy();
      expect(passwordInput.nativeElement.type).toBe('password');
    });

    xit('should show correct label for extraId based on userType', fakeAsync(() => {
      component.userType = 'manufacturer';
      fixture.detectChanges();
      tick();
      const label = fixture.debugElement.query(By.css('label[for="extraId"]'));
      expect(label.nativeElement.textContent.trim()).toBe('MID');

      component.userType = 'seller';
      fixture.detectChanges();
      tick();
      expect(label.nativeElement.textContent.trim()).toBe('SID');
    }));

    it('should show correct placeholder for extraId based on userType', () => {
      component.userType = 'manufacturer';
      fixture.detectChanges();

      const extraIdInput = fixture.debugElement.query(By.css('#extraId'));
      expect(extraIdInput.nativeElement.placeholder).toBe('Enter MID');

      component.userType = 'seller';
      fixture.detectChanges();

      expect(extraIdInput.nativeElement.placeholder).toBe('Enter SID');
    });

    it('should display go back button', () => {
      const goBackButton = fixture.debugElement.query(By.css('button'));
      expect(goBackButton.nativeElement.textContent).toContain('← Go Back');
    });
  });

  // Form Interaction Tests
  describe('Form Interactions', () => {
    it('should bind username input to component property', () => {
      const usernameInput = fixture.debugElement.query(By.css('#username'));
      usernameInput.nativeElement.value = 'testuser';
      usernameInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.username).toBe('testuser');
    });

    it('should bind password input to component property', () => {
      const passwordInput = fixture.debugElement.query(By.css('#password'));
      passwordInput.nativeElement.value = 'testpass';
      passwordInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.password).toBe('testpass');
    });

    it('should bind extraId input to component property', () => {
      const extraIdInput = fixture.debugElement.query(By.css('#extraId'));
      extraIdInput.nativeElement.value = '01';
      extraIdInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.extraId).toBe('01');
    });
  });

  // Password Visibility Toggle Tests
  xdescribe('Password Visibility Toggle', () => {
    it('should toggle password visibility', fakeAsync(() => {
      expect(component.showPassword).toBeFalse();

      const toggleButton = fixture.debugElement.query(By.css('button[type="button"]'));
      toggleButton.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.showPassword).toBeTrue();

      const passwordInput = fixture.debugElement.query(By.css('#password'));
      expect(passwordInput.nativeElement.type).toBe('text');
    }));

    it('should show correct icon based on password visibility state', () => {
      // Initially should show eye icon (password hidden)
      fixture.detectChanges();
      let eyeIcon = fixture.debugElement.query(By.css('svg'));
      expect(eyeIcon).toBeTruthy();

      // After toggle should show eye-slash icon (password visible)
      component.showPassword = true;
      fixture.detectChanges();

      const eyeSlashIcon = fixture.debugElement.query(By.css('svg'));
      expect(eyeSlashIcon).toBeTruthy();
    });
  });

  // Authentication Tests
  describe('Authentication Logic', () => {
    describe('Manufacturer Login', () => {
      beforeEach(() => {
        component.userType = 'manufacturer';
        mockWeb3Service.connectWallet.and.returnValue(Promise.resolve(true));
      });

      it('should login successfully with valid manufacturer credentials', async () => {
        component.username = 'Cipla';
        component.password = 'password1';
        component.extraId = '01';

        await component.login();

        expect(mockWeb3Service.connectWallet).toHaveBeenCalled();
        expect(mockAuthService.setManufacturerId).toHaveBeenCalledWith('01');
        expect(mockAuthService.setManufacturerName).toHaveBeenCalledWith('Cipla');
        expect(component.message).toBe('✅ Manufacturer logged in successfully!');

        // Check navigation after timeout
        setTimeout(() => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/manufacturer']);
        }, 600);
      });

      it('should fail login with invalid manufacturer credentials', async () => {
        component.username = 'invalid';
        component.password = 'invalid';
        component.extraId = 'invalid';

        await component.login();

        expect(component.message).toBe('❌ Invalid credentials or MID');
        expect(mockAuthService.setManufacturerId).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('should handle wallet connection failure', async () => {
        spyOn(window, 'alert');
        mockWeb3Service.connectWallet.and.returnValue(Promise.resolve(false));

        component.username = 'Cipla';
        component.password = 'password1';
        component.extraId = '01';

        await component.login();

        expect(window.alert).toHaveBeenCalledWith('Wallet connection failed. Please try again.');
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });

    describe('Seller Login', () => {
      beforeEach(() => {
        component.userType = 'seller';
      });

      it('should login successfully with valid seller credentials', async () => {
        component.username = 'Aryan';
        component.password = 'pass1';
        component.extraId = '13';

        await component.login();

        expect(mockAuthService.setSellerId).toHaveBeenCalledWith('13');
        expect(component.message).toBe('✅ Seller logged in successfully!');

        // Check navigation after timeout
        setTimeout(() => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/seller']);
        }, 600);
      });

      it('should fail login with invalid seller credentials', async () => {
        component.username = 'invalid';
        component.password = 'invalid';
        component.extraId = 'invalid';

        await component.login();

        expect(component.message).toBe('❌ Invalid credentials or SID');
        expect(mockAuthService.setSellerId).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });

      it('should test all valid seller credentials', async () => {
        const validSellers = [
          { username: 'Aryan', password: 'pass1', sid: '13' },
          { username: 'Dev', password: 'pass2', sid: '10' },
          { username: 'Soumik', password: 'pass3', sid: '20' }
        ];

        for (const seller of validSellers) {
          component.username = seller.username;
          component.password = seller.password;
          component.extraId = seller.sid;

          await component.login();

          expect(component.message).toBe('✅ Seller logged in successfully!');
        }
      });
    });

    it('should clear message at start of login attempt', async () => {
      component.message = 'Previous message';
      component.username = 'invalid';
      component.password = 'invalid';
      component.extraId = 'invalid';

      await component.login();

      expect(component.message).not.toBe('Previous message');
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    it('should navigate back to home when goBack is called', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call goBack when go back button is clicked', () => {
      spyOn(component, 'goBack');
      const goBackButton = fixture.debugElement.query(By.css('button'));

      goBackButton.nativeElement.click();

      expect(component.goBack).toHaveBeenCalled();
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    it('should call login method when form is submitted', () => {
      spyOn(component, 'login');
      const form = fixture.debugElement.query(By.css('form'));

      form.nativeElement.dispatchEvent(new Event('submit'));

      expect(component.login).toHaveBeenCalled();
    });

    it('should call login method when submit button is clicked', () => {
      spyOn(component, 'login');
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));

      submitButton.nativeElement.click();

      expect(component.login).toHaveBeenCalled();
    });
  });

  // Message Display Tests
  describe('Message Display', () => {
    it('should not display message when message is empty', () => {
      component.message = '';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('p[class*="text-center"]'));
      expect(messageElement).toBeFalsy();
    });

    it('should display success message with green color', () => {
      component.message = '✅ Login successful!';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('p[class*="text-center"]'));
      expect(messageElement).toBeTruthy();
      expect(messageElement.nativeElement.textContent.trim()).toBe('✅ Login successful!');
      expect(messageElement.nativeElement.className).toContain('text-green-700');
    });

    it('should display error message with red color', () => {
      component.message = '❌ Login failed!';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('p[class*="text-center"]'));
      expect(messageElement).toBeTruthy();
      expect(messageElement.nativeElement.textContent.trim()).toBe('❌ Login failed!');
      expect(messageElement.nativeElement.className).toContain('text-red-600');
    });
  });

  // Utility Method Tests
  describe('Utility Methods', () => {
    it('should capitalize strings correctly', () => {
      // Access private method for testing
      const capitalize = (component as any).capitalize.bind(component);

      expect(capitalize('manufacturer')).toBe('Manufacturer');
      expect(capitalize('seller')).toBe('Seller');
      expect(capitalize('test')).toBe('Test');
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle undefined route parameter gracefully', () => {
      mockActivatedRoute.paramMap = of(new Map());

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Should maintain default manufacturer type
      expect(component.userType).toBe('manufacturer');
    });

    it('should handle invalid route parameter', () => {
      mockActivatedRoute.paramMap = of(new Map([['userType', 'invalid']]));

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Should maintain default manufacturer type
      expect(component.userType).toBe('manufacturer');
    });

    it('should handle partial credentials', async () => {
      component.userType = 'manufacturer';
      component.username = 'Cipla';
      component.password = ''; // Empty password
      component.extraId = '01';

      await component.login();

      expect(component.message).toBe('❌ Invalid credentials or MID');
    });

    it('should handle Web3 service errors', async () => {
      spyOn(window, 'alert');
      mockWeb3Service.connectWallet.and.returnValue(Promise.reject(new Error('Web3 error')));

      component.userType = 'manufacturer';
      component.username = 'Cipla';
      component.password = 'password1';
      component.extraId = '01';

      try {
        await component.login();
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
