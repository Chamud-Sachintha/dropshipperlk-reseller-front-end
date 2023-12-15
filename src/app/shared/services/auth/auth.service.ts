import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Auth } from '../../models/Auth/auth';
import { Request } from '../../models/Request/request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerNewReseller(authModel: Auth) {
    const path = environment.apiURL + "register";
    return this.http.post(path, authModel);
  }

  loginSeller(requestModel: Request) {
    const path = environment.apiURL + "login";
    return this.http.post(path, requestModel);
  }
}
