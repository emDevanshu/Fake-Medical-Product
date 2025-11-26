import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySellerComponent } from './query-seller';

describe('QuerySellerComponent', () => {
  let component: QuerySellerComponent;
  let fixture: ComponentFixture<QuerySellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuerySellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuerySellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
