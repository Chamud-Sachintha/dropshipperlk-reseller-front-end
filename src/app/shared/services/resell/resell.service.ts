import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResellService {

  constructor(private http: HttpClient) { }

  resellProduct(requestParamModel: Request) {
    const path = environment.apiURL + "resell-product";
    return this.http.post(path, requestParamModel);
  }

  getResellProductList(requestParamModel: Request) {
    const path = environment.apiURL + "get-resell-product-list";
    return this.http.post(path, requestParamModel);
  }
}
