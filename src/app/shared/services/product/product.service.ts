import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProductList(requestModel: Request) {
    const path = environment.apiURL + "get-all-products";
    return this.http.post(path, requestModel);
  }

  getProductInfoById(requestParamModel: Request) {
    const path = environment.apiURL + "get-product-info";
    return this.http.post(path, requestParamModel);
  }
}
