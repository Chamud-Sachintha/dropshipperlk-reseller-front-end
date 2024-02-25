import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { OrderRequest } from '../../models/OrderRequest/order-request';
import { Request } from '../../models/Request/request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeNewOrder(orderRequestModel: OrderRequest) {
    const path = environment.apiURL + "place-order";
    return this.http.post(path, orderRequestModel)
  }

  getOrderList(requestParamModel: Request) {
    const path = environment.apiURL + "get-order-list";
    return this.http.post(path, requestParamModel);
  }

  getOrderInfoByOrder(requestParamModel: Request) {
    const path = environment.apiURL + "get-order-info";
    return this.http.post(path, requestParamModel);
  }

  cancleOrder(requestParamModel: Request) {
    const path = environment.apiURL + "cancle-order";
    return this.http.post(path, requestParamModel);
  }

  placeOrderByCart(orderRequestModel: OrderRequest) {
    const path = environment.apiURL + "place-order-by-cart";
    return this.http.post(path, orderRequestModel);
  }

  getCartTotal(requestParamModel: Request) {
    const path = environment.apiURL + "get-cart-total";
    return this.http.post(path, requestParamModel);
  }
}
