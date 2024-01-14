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
}
