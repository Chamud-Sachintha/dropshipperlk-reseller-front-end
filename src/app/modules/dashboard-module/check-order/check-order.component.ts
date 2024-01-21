import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckOrder } from 'src/app/shared/models/CheckOrder/check-order';
import { Request } from 'src/app/shared/models/Request/request';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-check-order',
  templateUrl: './check-order.component.html',
  styleUrls: ['./check-order.component.css']
})
export class CheckOrderComponent implements OnInit {

  requestModel = new Request();
  orderInfoModel = new CheckOrder();
  orderNumber!: string;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {

    this.orderNumber = this.activatedRoute.snapshot.params['orderNumber'];

    this.loadOrderInfo();
  }

  onClickCancleOrder() {
    this.requestModel.token = sessionStorage.getItem("authToken");
    this.requestModel.orderNumber = this.orderNumber;

    this.orderService.cancleOrder(this.requestModel).subscribe((resp: any) => {

      if (resp.code === 1) {
        location.reload();
      }
    })
  }

  loadOrderInfo() {
    this.requestModel.token = sessionStorage.getItem("authToken");
    this.requestModel.orderNumber = this.orderNumber;

    this.orderService.getOrderInfoByOrder(this.requestModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        this.orderInfoModel.productName = dataList.data[0].productName;
        this.orderInfoModel.quantity = dataList.data[0].quantity;
        this.orderInfoModel.totalAmount = dataList.data[0].totalAmount;
        this.orderInfoModel.orderStatus = dataList.data[0].orderStatus;
        this.orderInfoModel.paymentStatus = dataList.data[0].paymentStatus;
        this.orderInfoModel.cancleOrder = dataList.data[0].cancleOrder;
        this.orderInfoModel.teamCommision = dataList.data[0].teamCommision;
        this.orderInfoModel.directCommision = dataList.data[0].directCommision;
        this.orderInfoModel.orderCancled = dataList.data[0].orderCancled;
      }
    })
  }

}
