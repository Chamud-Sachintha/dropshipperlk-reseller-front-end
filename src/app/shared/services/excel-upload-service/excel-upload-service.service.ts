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
}
