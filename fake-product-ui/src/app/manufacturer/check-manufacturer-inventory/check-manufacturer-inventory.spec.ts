import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckManufacturerInventory } from './check-manufacturer-inventory';

describe('CheckManufacturerInventory', () => {
  let component: CheckManufacturerInventory;
  let fixture: ComponentFixture<CheckManufacturerInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckManufacturerInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckManufacturerInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
