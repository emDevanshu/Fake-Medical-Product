import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { QuerySellerComponent } from './query-seller';
import {provideHttpClient} from '@angular/common/http';

describe('QuerySellerComponent', () => {
  let component: QuerySellerComponent;
  let fixture: ComponentFixture<QuerySellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuerySellerComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuerySellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
