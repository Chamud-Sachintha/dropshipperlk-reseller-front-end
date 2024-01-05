import { TestBed } from '@angular/core/testing';

import { ResellService } from './resell.service';

describe('ResellService', () => {
  let service: ResellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
