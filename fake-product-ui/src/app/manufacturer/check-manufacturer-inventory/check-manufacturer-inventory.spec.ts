import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { CheckInventoryComponent } from './check-manufacturer-inventory';
import {provideHttpClient} from '@angular/common/http';

describe('CheckInventoryComponent', () => {
  let component: CheckInventoryComponent;
  let fixture: ComponentFixture<CheckInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInventoryComponent],
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
