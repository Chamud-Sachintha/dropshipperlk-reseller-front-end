import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderInfo } from 'src/app/shared/models/OrderInfo/order-info';
import { Request } from 'src/app/shared/models/Request/request';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {

  requestParamModel = new Request();
  orderInfoList: OrderInfo[] = [];
  searchText = '';
  filteredOrderRequestList: OrderInfo[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;


  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrderList();
    this.filteredOrderRequestList = this.orderInfoList; 
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    // this.loadOrderList();
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

  onClickCheckOrder(orderNumber: string) {
    this.router.navigate(['/app/check-order', orderNumber]);
  }

  loadOrderList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.flag = sessionStorage.getItem("role");
    
    this.orderService.getOrderList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp))

      if (resp.code === 1) {
        dataList.data[0].forEach((eachOrder: OrderInfo) => {
          this.orderInfoList.push(eachOrder);
        })
      }
    })
  }

}
