import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySeller } from './query-seller';

describe('QuerySeller', () => {
  let component: QuerySeller;
  let fixture: ComponentFixture<QuerySeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuerySeller]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuerySeller);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
