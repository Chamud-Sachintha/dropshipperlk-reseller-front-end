import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  requestParamModel = new Request();
  productList: Product[] = [];
  categoryList: any[] = [];
  selectedCategory: number | null = null;
  filteredProducts: Product[] = []; 
  searchText: string = '';
  uniqueCategories: string[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  constructor (private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllProductList();
   
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    // this.loadAllProductList();
  }

  seeProduct(pid: string) {
    this.router.navigate(['app/product', pid]);
    return false;
  }

  loadAllProductList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.productService.getAllProductList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));
      console.log('sd',resp.token);
      this.categoryList = resp.token;
      if (resp.code === 1) {
        dataList.data[0].forEach((eachProduct: Product) => {
          const thumbnailImageUrl = environment.fileServer + "images/" + eachProduct.images;
          eachProduct.images = thumbnailImageUrl;
         
          this.productList.push(eachProduct);
          this.filteredProducts.push(eachProduct);
          
          
        })
      }
    })
  }

  

  filterByCategory() {
    this.filteredProducts=[];
    console.log('filtering by ' + this.selectedCategory);
    if(this.selectedCategory == 99)
    {
      this.loadAllProductList();
    }
    else if(this.selectedCategory == 0){
      this.loadAllProductList();
    }
    else{
      this.requestParamModel.token = sessionStorage.getItem("authToken");
      this.requestParamModel.Cid = this.selectedCategory;
    
      this.productService.getAllProductIdList(this.requestParamModel).subscribe((resp: any) => {
        const dataList = JSON.parse(JSON.stringify(resp));
        console.log('sd', resp.token);
        this.categoryList = resp.token;
        if (resp.code === 1) {
          this.productList = []; 
          dataList.data[0].forEach((eachProduct: Product) => {
            const thumbnailImageUrl = environment.fileServer + "images/" + eachProduct.images;
            eachProduct.images = thumbnailImageUrl;
            //this.productList.push(eachProduct);
            this.filteredProducts.push(eachProduct);
          });
        }
      });
    }
    
  }

  calculateCardHeight(eachProduct: any): number {
   
    const cardHeaderHeight = 60; 
    const cardFooterHeight = 50; 
    const imageHeight = 200; 
   
    return cardHeaderHeight + imageHeight + cardFooterHeight;
  }

  filterProductsByName() {
    this.filteredProducts = this.productList.filter(product =>
      product.productName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
