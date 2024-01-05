import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  requestParamModel = new Request();
  productList: Product[] = [];

  constructor (private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllProductList();
  }

  seeProduct(pid: string) {
    console.log(pid)
    this.router.navigate(['app/product', pid]);
  }

  loadAllProductList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.productService.getAllProductList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        dataList.data[0].forEach((eachProduct: Product) => {
          this.productList.push(eachProduct);
        })
      }
    })
  }

}
