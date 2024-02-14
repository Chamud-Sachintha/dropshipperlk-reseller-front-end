import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfitLogService {

  constructor(private http: HttpClient) { }

  getProfitLogList(requestParamModel: Request) {
    const path = environment.apiURL + "get-profit-log";
    return this.http.post(path, requestParamModel);
  }
}
