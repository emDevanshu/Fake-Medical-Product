import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInventoryComponent } from './check-manufacturer-inventory';

describe('CheckInventoryComponent', () => {
  let component: CheckInventoryComponent;
  let fixture: ComponentFixture<CheckInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInventoryComponent]
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
