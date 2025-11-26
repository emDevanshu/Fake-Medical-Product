import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVerificationComponent } from './product-verification';

describe('ProductVerificationComponent', () => {
  let component: ProductVerificationComponent;
  let fixture: ComponentFixture<ProductVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
