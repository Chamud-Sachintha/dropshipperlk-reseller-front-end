import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExcelUploadServiceService {

  constructor(private hhttp: HttpClient) { }

  getExcelTempOrderList(requestParamModel: Request) {
    const path = environment.apiURL + "get-temp-order-list";
    return this.hhttp.post(path, requestParamModel);
  }

  getErrLogs(requestParamModel: Request) {
    const path = environment.apiURL + "get-err-logs";
    return this.hhttp.post(path, requestParamModel);
  }

  proceedTempOrders(requestParamModel: Request) {
    const path = environment.apiURL + "proceed-temp-orders";
    return this.hhttp.post(path, requestParamModel);
  }
}
