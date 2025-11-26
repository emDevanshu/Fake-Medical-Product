import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellProductToSellerComponent } from './sell-product-to-seller';

describe('SellProductToSellerComponent', () => {
  let component: SellProductToSellerComponent;
  let fixture: ComponentFixture<SellProductToSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProductToSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProductToSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
