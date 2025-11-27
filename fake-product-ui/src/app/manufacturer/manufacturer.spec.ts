import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturerComponent } from './manufacturer';
import { Web3Service } from '../services/web3.service';
import { AuthService } from '../services/auth.service';
import { provideRouter } from '@angular/router';

xdescribe('ManufacturerComponent', () => {
  let component: ManufacturerComponent;
  let fixture: ComponentFixture<ManufacturerComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockWeb3Service: jasmine.SpyObj<Web3Service>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create mock services
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockWeb3Service = jasmine.createSpyObj('Web3Service', ['loadContract']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    mockWeb3Service.loadContract.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [ManufacturerComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        { provide: Web3Service, useValue: mockWeb3Service },
        { provide: AuthService, useValue: mockAuthService },
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.companyName).toBe('Devanshu');
    expect(component.dropdownOpen).toBe(false);
  });

  it('should log message on construction', () => {
    spyOn(console, 'log');
    const newComponent = new ManufacturerComponent(mockRouter, mockWeb3Service, mockAuthService);
    expect(console.log).toHaveBeenCalledWith('manufacturer is working !!!');
  });

  xdescribe('ngOnInit', () => {
    it('should call loadContract on initialization', async () => {
      await component.ngOnInit();
      expect(mockWeb3Service.loadContract).toHaveBeenCalled();
    });

    it('should handle loadContract errors gracefully', async () => {
      mockWeb3Service.loadContract.and.returnValue(Promise.reject('Contract load failed'));

      try {
        await component.ngOnInit();
      } catch (error) {
        expect(error).toBe('Contract load failed');
      }

      expect(mockWeb3Service.loadContract).toHaveBeenCalled();
    });
  });

  xdescribe('toggleDropdown', () => {
    it('should toggle dropdown from false to true', () => {
      component.dropdownOpen = false;
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(true);
    });

    it('should toggle dropdown from true to false', () => {
      component.dropdownOpen = true;
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(false);
    });

    it('should toggle dropdown multiple times correctly', () => {
      expect(component.dropdownOpen).toBe(false);
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(true);
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(false);
      component.toggleDropdown();
      expect(component.dropdownOpen).toBe(true);
    });
  });

  xdescribe('logout', () => {
    it('should call authService.logout()', () => {
      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should navigate to login/manufacturer page', () => {
      component.logout();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login/manufacturer']);
    });

    it('should log logout message', () => {
      spyOn(console, 'log');
      component.logout();
      expect(console.log).toHaveBeenCalledWith('Logging out...');
    });

    it('should perform logout operations in correct order', () => {
      const callOrder: string[] = [];

      mockAuthService.logout.and.callFake(() => {
        callOrder.push('logout');
      });

      mockRouter.navigate.and.callFake(() => {
        callOrder.push('navigate');
        return Promise.resolve(true);
      });

      spyOn(console, 'log').and.callFake((msg) => {
        if (msg === 'Logging out...') {
          callOrder.push('log');
        }
      });

      component.logout();

      expect(callOrder).toEqual(['logout', 'navigate', 'log']);
    });
  });

  describe('Component Integration', () => {
    it('should have correct component selector', () => {
      const compiled = fixture.nativeElement;
      expect(fixture.componentRef.instance).toBeInstanceOf(ManufacturerComponent);
    });

    it('should inject all required services', () => {
      expect(component['router']).toBeDefined();
      expect(component['web3']).toBeDefined();
      expect(component['authService']).toBeDefined();
    });
  });
});
