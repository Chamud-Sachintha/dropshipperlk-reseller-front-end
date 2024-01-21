import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private resellService: ResellService, private formBuilder: FormBuilder, private orderService: OrderService
            , private router: Router) {}

  ngOnInit(): void {
    this.loadResellProductList();
    this.initPlaceOrderForm();
  }

  onClickCheckProduct(productId: string) {
    this.router.navigate(['/app/check-product', productId]);
  }

  setProductId(productId: string) {
    this.productId = productId;
  }

  onChangeBankSlip(event: any) {
    const file = (event.target as any).files[0]; 
    this.placeOrderForm.patchValue({"bankSlip": file});
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
    const bankSlip = this.placeOrderForm.controls['bankSlip'].value;

    if (name == "") {

    } else if (address == "") {

    } else if (city == "") {

    } else if (district == "") {

    } else if (firstContact == "") {

    } else if (secondContact == "") {

    } else if (paymentMethod == "") {

    } else {

      if (bankSlip != "") {
        this.convertImageToBase64(bankSlip).then((base64String) => {
          this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity, base64String);
        })
      } else {
        this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity);
      }
    }
  }

  placeOrder(name: string, address: string, city: string, district: string, firstContact: string, secondContact: string, paymentMethod: string, quantity: string, bankSlip = "") {
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

    if (bankSlip != "") {
      this.orderRequestModel.bankSlip = bankSlip;
    }

    this.orderService.placeNewOrder(this.orderRequestModel).subscribe((resp: any) => {

      if (resp.code === 1) {

      }
    })
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
      quantity: ['', Validators.required],
      bankSlip: ['', Validators.required]
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

  convertImageToBase64(fileInput: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const file: File = fileInput;
      const reader: FileReader = new FileReader();

      reader.onloadend = () => {
        // The result attribute contains the base64 string
        const base64String: string = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the image file as a Data URL
      reader.readAsDataURL(file);
    });
  }

}
