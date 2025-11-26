import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ProductVerificationComponent } from './product-verification';
import {provideHttpClient} from '@angular/common/http';

describe('ProductVerificationComponent', () => {
  let component: ProductVerificationComponent;
  let fixture: ComponentFixture<ProductVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerificationComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
