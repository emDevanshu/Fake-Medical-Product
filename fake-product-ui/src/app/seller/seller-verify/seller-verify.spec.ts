import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { SellerVerifyComponent } from './seller-verify';
import {provideHttpClient} from '@angular/common/http';

describe('SellerVerify', () => {
  let component: SellerVerifyComponent;
  let fixture: ComponentFixture<SellerVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerVerifyComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
