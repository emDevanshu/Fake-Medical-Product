import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInventory } from './seller-inventory';

describe('SellerInventory', () => {
  let component: SellerInventory;
  let fixture: ComponentFixture<SellerInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
