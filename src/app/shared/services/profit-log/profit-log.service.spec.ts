import { TestBed } from '@angular/core/testing';

import { ProfitLogService } from './profit-log.service';

describe('ProfitLogService', () => {
  let service: ProfitLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
