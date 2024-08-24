import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Request } from 'src/app/shared/models/Request/request';
import { ReportService } from 'src/app/shared/services/report/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  selectedReportType: string = '';
  reportType: string ='';
  requestDownload = new Request();
  selectedOrderNumbers: any;
  requestParamModel: any;


  constructor(private fb: FormBuilder, private printService: ReportService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
   
  }

  downloadReport(): void {
    this.requestDownload.selectedReportType = this.selectedReportType;
    this.requestDownload.token = sessionStorage.getItem('authToken');

    this.spinner.show();
    this.printService.DownOrderRepport(this.requestDownload).subscribe(
      (blob: Blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'simple_excel_sheet.xlsx'; // Set the desired filename
        link.click();
      },
      (error) => {
        console.error('Error downloading report:', error);
      }
    );

    this.spinner.hide();
  }
}
