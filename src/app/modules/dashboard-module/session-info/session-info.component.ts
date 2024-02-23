import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Request } from 'src/app/shared/models/Request/request';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.css']
})
export class SessionInfoComponent implements OnInit {

  requestParamModel = new Request();
  cartItemsCount = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItemsCount();
  }

  onClickCheckCart() {
    this.router.navigate(['/app/cart']);
  }

  loadCartItemsCount() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    this.productService.getCartItemsCount(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        this.cartItemsCount = dataList.data[0].cartItemsCount;
      }
    })
  }

}
