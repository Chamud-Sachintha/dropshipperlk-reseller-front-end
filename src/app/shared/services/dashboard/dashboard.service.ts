import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashbboardData(requestModel: Request) {
    const path = environment.apiURL +  "dashboard-data";
    return this.http.post(path, requestModel);
  }
}
