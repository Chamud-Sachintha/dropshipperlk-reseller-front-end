import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Request } from '../../models/Request/request';
import { environment } from 'src/environments/environment.development';
import { KYCInfo } from '../../models/KYCInfo/kycinfo';
import { BankDetails } from '../../models/BankDetails/bank-details'; 
import { Profile } from '../../models/Profile/profile';


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

  UpdateBankDeatils(bankDetails: BankDetails){
    const path = environment.apiURL + "update-bank-dtails";
    return this.http.post(path, bankDetails);
  }
  UpdateProfileDetails(profileModel: Profile) {
    const path = environment.apiURL + "update-Profile-dtails";
    return this.http.post<any>(path, profileModel); 
  }

  UpdateEditBankDeatils(bankDetails: BankDetails){
    const path = environment.apiURL + "update-edit-bank-dtails";
    return this.http.post(path, bankDetails);
  }

  UpdatePassword(requestParam: Request){
    const path = environment.apiURL + "update-reseller-password";
    return this.http.post(path, requestParam);
  }
}
