import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Request } from 'src/app/shared/models/Request/request';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm!: FormGroup;
  requestModel = new Request();

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  onSubmitLoginForm() {

    const userName = this.loginForm.controls['userName'].value;
    const password = this.loginForm.controls['password'].value;

    if (userName == "") {

    } else if (password == "") {

    } else {
      this.requestModel.userName = userName;
      this.requestModel.password = password;

      this.authService.loginSeller(this.requestModel).subscribe((resp: any) => {

        const dataList = JSON.parse(JSON.stringify(resp));

        sessionStorage.setItem("authToken", resp.token);

        if (resp.code === 1) {

        } else if (resp.code === 2) {
          this.router.navigate(['app/profile']);
        } else {
          
        }
      })
    }
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

}
