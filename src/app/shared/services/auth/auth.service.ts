import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Auth } from '../../models/Auth/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerNewReseller(authModel: Auth) {
    const path = environment.apiURL + "register";
    return this.http.post(path, authModel);
  }
}
