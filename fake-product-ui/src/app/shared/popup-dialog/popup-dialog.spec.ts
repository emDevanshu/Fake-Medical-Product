import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { PopupDialogComponent } from './popup-dialog';

describe('PopupDialogComponent', () => {
  let component: PopupDialogComponent;
  let fixture: ComponentFixture<PopupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupDialogComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
