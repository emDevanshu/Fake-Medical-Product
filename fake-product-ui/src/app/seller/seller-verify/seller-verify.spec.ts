import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerVerifyComponent } from './seller-verify';

describe('SellerVerify', () => {
  let component: SellerVerifyComponent;
  let fixture: ComponentFixture<SellerVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
