import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OrderInfo } from 'src/app/shared/models/OrderInfo/order-info';
import { Request } from 'src/app/shared/models/Request/request';
import { ExcelUploadServiceService } from 'src/app/shared/services/excel-upload-service/excel-upload-service.service';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-excel-order-upload',
  templateUrl: './excel-order-upload.component.html',
  styleUrls: ['./excel-order-upload.component.css']
})
export class ExcelOrderUploadComponent implements OnInit {

  requestParamModel = new Request();
  orderInfoList: OrderInfo[] = [];
  searchText = '';
  filteredOrderRequestList: OrderInfo[] = [];
  errLogList: any[] = [];
  isOrdersAlreadyHave = false;
  selectedFile: File | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  constructor (private orderService: ExcelUploadServiceService, private router: Router, private spinner: NgxSpinnerService
                , private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrderList();
    this.loadErrorLogs();
    this.filteredOrderRequestList = this.orderInfoList; 
  }

  onClickClearTables() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.orderService.clearAllTempTables(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("All Tables are Cleared", "Tables Clreared");
      } else {
        this.tostr.error("Error Occured.", "Table Clearing");
      }
    })

    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  // Triggered when file is selected
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {

      const token: any = sessionStorage.getItem("authToken");

      const formData: FormData = new FormData();
      formData.append('token', token);
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.spinner.show();
      this.orderService.importOrderExcelTemplateFile(formData).subscribe((resp: any) => {
        if (resp.code === 1) {
          this.tostr.success("Importing Success", "Excel Upload");
        } else {
          this.tostr.error("Error mOccured", resp.message);
        }

        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      this.spinner.hide();
    }
  }

  onClickProceedOrders() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.flag = sessionStorage.getItem("role");

    this.spinner.show();
    this.orderService.proceedTempOrders(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("Order Import Sucessfully", "Order Importing");
      } else {
        this.tostr.error("Import Error Occured", "Order Importing");
      }

      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    this.spinner.hide();
  }

  loadErrorLogs() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.flag = sessionStorage.getItem("role");

    this.orderService.getErrLogs(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        const dataList = JSON.parse(JSON.stringify(resp.data));

        dataList[0].forEach((el: any) => {
          this.errLogList.push(el);
        })
      }
    })
  }

  filterOrderRequestList() {
    if (!this.searchText) {
      this.filteredOrderRequestList = this.orderInfoList; // Reset to the original data if search text is empty
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredOrderRequestList = this.orderInfoList.filter(order =>
        Object.values(order).some(value =>
          value ? value.toString().toLowerCase().includes(searchTextLower) : false
        )
      );
    }
  }

  loadOrderList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.flag = sessionStorage.getItem("role");

    this.orderService.getExcelTempOrderList(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code == 1) {
        const dataList = JSON.parse(JSON.stringify(resp));

        dataList.data[0].forEach((eachOrder: OrderInfo) => {
          this.orderInfoList.push(eachOrder);
        })

        if (this.orderInfoList.length > 0) {
          this.isOrdersAlreadyHave = true;
        }
      }
    })
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    // this.loadOrderList();
  }

}
