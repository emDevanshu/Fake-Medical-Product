import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerification } from './product-verification';

describe('ProductVerification', () => {
  let component: ProductVerification;
  let fixture: ComponentFixture<ProductVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
