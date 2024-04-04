import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ResellService } from 'src/app/shared/services/resell/resell.service';
import { environment } from 'src/environments/environment.development';

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
            , private resellService: ResellService, private tostr: ToastrService, private spinner: NgxSpinnerService) {}

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

      this.spinner.show();
      this.resellService.resellProduct(this.requestParamModel).subscribe((resp: any) => {

        if (resp.code === 1) {
          this.tostr.success("Resell Product", "Product Reselling Successfully");
        } else {
          this.tostr.error("Resell Product", resp.message);
        }

        this.spinner.hide();
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
        this.productInfoModel.inStock = dataList.data[0].StockStatus;
        this.productInfoModel.isResell = dataList.data[0].isResell;
        this.productInfoModel.in_colombo_charges = dataList.data[0].in_colombo_charges;
        this.productInfoModel.out_of_colombo_charges = dataList.data[0].out_of_colombo_charges;
        let productWeight = dataList.data[0].productWeigth;

        // Check if the weight is greater than or equal to 1000
        if (productWeight >= 1000) {
          // Convert to kilograms (Kg)
          productWeight = productWeight / 1000;
          this.productInfoModel.weigth =productWeight+"Kg";
        } else {
          this.productInfoModel.weigth =productWeight+"g";
        }
        
        this.productInfoModel.Stock = dataList.data[0].Stock;
        this.productInfoModel.image1 = environment.fileServer + "images/" + dataList.data[0].images.image0;
        this.productInfoModel.image2 = environment.fileServer + "images/" + dataList.data[0].images.image1;
        this.productInfoModel.image3 = environment.fileServer + "images/" + dataList.data[0].images.image2;
        this.productInfoModel.image4 = environment.fileServer + "images/" + dataList.data[0].images.image3;
      }
    })
  }

}
