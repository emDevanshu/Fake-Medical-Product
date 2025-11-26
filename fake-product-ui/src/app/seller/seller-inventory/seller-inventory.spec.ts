import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { SellerInventoryComponent } from './seller-inventory';
import {provideHttpClient} from '@angular/common/http';

describe('SellerInventoryComponent', () => {
  let component: SellerInventoryComponent;
  let fixture: ComponentFixture<SellerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerInventoryComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
