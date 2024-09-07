import { TestBed } from '@angular/core/testing';

import { ExcelUploadServiceService } from './excel-upload-service.service';

describe('ExcelUploadServiceService', () => {
  let service: ExcelUploadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelUploadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
