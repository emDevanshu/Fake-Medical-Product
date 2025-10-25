import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manufacturer } from './manufacturer';

describe('Manufacturer', () => {
  let component: Manufacturer;
  let fixture: ComponentFixture<Manufacturer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manufacturer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manufacturer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
