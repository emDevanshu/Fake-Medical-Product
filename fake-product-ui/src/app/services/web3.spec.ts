import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { Web3Service } from './web3.service';
import {provideHttpClient} from '@angular/common/http';

describe('Web3Service', () => {
  let service: Web3Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    })
    .compileComponents();

    service = TestBed.inject(Web3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
