import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { SellProductToSellerComponent } from './sell-product-to-seller';
import {provideHttpClient} from '@angular/common/http';

describe('SellProductToSellerComponent', () => {
  let component: SellProductToSellerComponent;
  let fixture: ComponentFixture<SellProductToSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProductToSellerComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProductToSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
