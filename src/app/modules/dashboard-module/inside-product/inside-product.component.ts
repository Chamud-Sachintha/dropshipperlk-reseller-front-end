import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ResellService } from 'src/app/shared/services/resell/resell.service';

@Component({
  selector: 'app-inside-product',
  templateUrl: './inside-product.component.html',
  styleUrls: ['./inside-product.component.css']
})
export class InsideProductComponent implements OnInit {

  requestParamModel = new Request();
  productInfoModel = new Product();
  resellProductForm!: FormGroup;
  productId!: string;

  constructor (private productService: ProductService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder
            , private resellService: ResellService) {}

  ngOnInit(): void {

    this.productId = this.activatedRoute.snapshot.params['pid'];

    this.loadProductInfo();
    this.initResellProductForm();
  }

  onSubmitResellForm() {
    
    const resellPrice = this.resellProductForm.controls['resellPrice'].value;

    if (resellPrice == "") {

    } else {
      this.requestParamModel.token = sessionStorage.getItem("authToken");
      this.requestParamModel.pid = this.productId;
      this.requestParamModel.resellPrice = resellPrice;

      this.resellService.resellProduct(this.requestParamModel).subscribe((resp: any) => {

        if (resp.code === 1) {

        }
      })
    }
  }

  onClickOpenResellForm() {
    this.resellProductForm.controls['productPrice'].setValue(this.productInfoModel.price)
    this.resellProductForm.controls['category'].setValue(this.productInfoModel.categoryName)
    this.resellProductForm.controls['teamCommision'].setValue(this.productInfoModel.teamCommision)
    this.resellProductForm.controls['directCommision'].setValue(this.productInfoModel.directCommision)
  }

  initResellProductForm() {
    this.resellProductForm = this.formBuilder.group({
      productPrice: ['', Validators.required],
      resellPrice: ['', Validators.required],
      category: ['' ,Validators.required],
      teamCommision: ['', Validators.required],
      directCommision: ['', Validators.required]
    })

    this.resellProductForm.controls['productPrice'].disable();
    this.resellProductForm.controls['category'].disable();
    this.resellProductForm.controls['teamCommision'].disable();
    this.resellProductForm.controls['directCommision'].disable();
  }

  loadProductInfo() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.pid = this.productId;

    this.productService.getProductInfoById(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        this.productInfoModel.productName = dataList.data[0].productName;
        this.productInfoModel.description = dataList.data[0].description;
        this.productInfoModel.price = dataList.data[0].price;
        this.productInfoModel.teamCommision = dataList.data[0].teamCommision;
        this.productInfoModel.directCommision = dataList.data[0].directCommision;
        this.productInfoModel.categoryName = dataList.data[0].cetagoryName;
        this.productInfoModel.inStock = dataList.data[0].inStock;
        this.productInfoModel.isResell = dataList.data[0].isResell;
      }
    })
  }

}
