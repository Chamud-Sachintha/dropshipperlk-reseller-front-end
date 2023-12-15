import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';
import { KYCInfo } from '../../models/KYCInfo/kycinfo';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfileInfo(requestParam: Request) {
    const path = environment.apiURL + "get-profile-data";
    return this.http.post(path, requestParam);
  }

  submitKYCInfo(kycInfoModel: KYCInfo) {
    const path = environment.apiURL + "add-kyc-info";
    return this.http.post(path, kycInfoModel);
  }
}
