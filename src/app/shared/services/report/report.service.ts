import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../../models/Request/request';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  DownOrderRepport(requestParamModel: Request) {
    const path = environment.apiURL + "DownloadExcel";
    return this.http.post(path, requestParamModel, { responseType: 'blob' }); 
  }
}
