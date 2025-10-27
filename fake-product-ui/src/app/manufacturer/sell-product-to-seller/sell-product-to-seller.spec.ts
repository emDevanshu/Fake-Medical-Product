import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellProductToSeller } from './sell-product-to-seller';

describe('SellProductToSeller', () => {
  let component: SellProductToSeller;
  let fixture: ComponentFixture<SellProductToSeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProductToSeller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProductToSeller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
