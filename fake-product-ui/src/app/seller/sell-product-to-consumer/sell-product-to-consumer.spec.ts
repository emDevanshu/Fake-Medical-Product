import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellProductToConsumer } from './sell-product-to-consumer';

describe('SellProductToConsumer', () => {
  let component: SellProductToConsumer;
  let fixture: ComponentFixture<SellProductToConsumer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProductToConsumer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProductToConsumer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
