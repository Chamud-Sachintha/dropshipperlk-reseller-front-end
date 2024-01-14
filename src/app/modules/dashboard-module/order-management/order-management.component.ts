import { Component, OnInit } from '@angular/core';
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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrderList();
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
