import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderRequest } from 'src/app/shared/models/OrderRequest/order-request';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ResellProduct } from 'src/app/shared/models/ResellProduct/resell-product';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ResellService } from 'src/app/shared/services/resell/resell.service';

@Component({
  selector: 'app-resell-products',
  templateUrl: './resell-products.component.html',
  styleUrls: ['./resell-products.component.css']
})
export class ResellProductsComponent implements OnInit {

  requestParamModel = new Request();
  placeOrderForm!: FormGroup;
  orderRequestModel = new OrderRequest();
  resellProductList: ResellProduct[] = [];
  productId!: string;

  constructor(private resellService: ResellService, private formBuilder: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadResellProductList();
    this.initPlaceOrderForm();
  }

  setProductId(productId: string) {
    this.productId = productId;
  }

  onSubmitPlaceOrder() {
    const name = this.placeOrderForm.controls['name'].value;
    const address = this.placeOrderForm.controls['address'].value;
    const city = this.placeOrderForm.controls['city'].value;
    const district = this.placeOrderForm.controls['district'].value;
    const firstContact = this.placeOrderForm.controls['firstContact'].value;
    const secondContact = this.placeOrderForm.controls['secondContact'].value;
    const paymentMethod = this.placeOrderForm.controls['paymentMethod'].value;
    const quantity = this.placeOrderForm.controls['quantity'].value;

    if (name == "") {

    } else if (address == "") {

    } else if (city == "") {

    } else if (district == "") {

    } else if (firstContact == "") {

    } else if (secondContact == "") {

    } else if (paymentMethod == "") {

    } else {

      this.orderRequestModel.token = sessionStorage.getItem("authToken");
      this.orderRequestModel.name = name;
      this.orderRequestModel.address = address;
      this.orderRequestModel.city = city;
      this.orderRequestModel.district = district;
      this.orderRequestModel.firstContact = firstContact;
      this.orderRequestModel.secondContact = secondContact;
      this.orderRequestModel.paymentMethod = paymentMethod;
      this.orderRequestModel.pid = this.productId;
      this.orderRequestModel.quantity = quantity;

      this.orderService.placeNewOrder(this.orderRequestModel).subscribe((resp: any) => {

        if (resp.code === 1) {

        }
      })
    }
  }

  initPlaceOrderForm() {
    this.placeOrderForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      firstContact: ['', Validators.required],
      secondContact: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      quantity: ['', Validators.required]
    })
  }

  loadResellProductList() {

    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.resellService.getResellProductList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        dataList.data[0].forEach((eachProduct: ResellProduct) => {
          this.resellProductList.push(eachProduct);
        })
      }
    })
  }

}
