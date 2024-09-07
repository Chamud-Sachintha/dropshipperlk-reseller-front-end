import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelOrderUploadComponent } from './excel-order-upload.component';

describe('ExcelOrderUploadComponent', () => {
  let component: ExcelOrderUploadComponent;
  let fixture: ComponentFixture<ExcelOrderUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExcelOrderUploadComponent]
    });
    fixture = TestBed.createComponent(ExcelOrderUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
