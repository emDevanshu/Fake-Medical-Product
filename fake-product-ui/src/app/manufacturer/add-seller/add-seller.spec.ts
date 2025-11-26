import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { AddSellerComponent } from './add-seller';
import {provideHttpClient} from '@angular/common/http';

describe('AddSellerComponent', () => {
  let component: AddSellerComponent;
  let fixture: ComponentFixture<AddSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSellerComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
