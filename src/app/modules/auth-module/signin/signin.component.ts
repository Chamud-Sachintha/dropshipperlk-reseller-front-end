import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder
              , private tostr: ToastrService, private spinner: NgxSpinnerService) {}

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

      this.spinner.show();
      this.authService.loginSeller(this.requestModel).subscribe((resp: any) => {

        const dataList = JSON.parse(JSON.stringify(resp));

        sessionStorage.setItem("authToken", resp.token);
        sessionStorage.setItem("kycStatus", resp.code);

        if (resp.code === 1) {
          this.tostr.success("User Authentication", "Login Sucess");
          this.router.navigate(['app/home']);
        } else if (resp.code === 2) {
          this.tostr.success("User Authentication", "Login Sucess");
          this.router.navigate(['app/profile']);
        } else if (resp.code === 3){
          this.tostr.success("User Authentication", "Login Sucess");
          this.router.navigate(['app/profile']);
        } else {
          this.tostr.success("User Authentication", resp.message);
        }

        this.spinner.hide();
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
