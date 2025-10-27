import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeller } from './add-seller';

describe('AddSeller', () => {
  let component: AddSeller;
  let fixture: ComponentFixture<AddSeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSeller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
