import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { SellProductToConsumerComponent } from './sell-product-to-consumer';

describe('SellProductToConsumerComponent', () => {
  let component: SellProductToConsumerComponent;
  let fixture: ComponentFixture<SellProductToConsumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProductToConsumerComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProductToConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
