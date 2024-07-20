import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Auth } from 'src/app/shared/models/Auth/auth';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  authModel = new Auth();
  registerResellerForm!: FormGroup;

  constructor (private formBuilder: FormBuilder, private router: Router, private authService: AuthService
              , private tostr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.initRegisterResellerForm();
  }

  onSubmitRegisterResellerForm() {
    const fullName = this.registerResellerForm.controls['fullName'].value;
    const bName = this.registerResellerForm.controls['bName'].value;
    const address = this.registerResellerForm.controls['address'].value;
    const phoneNumber = this.registerResellerForm.controls['phoneNumber'].value;
    const nicNumber = this.registerResellerForm.controls['nicNumber'].value;
    const email = this.registerResellerForm.controls['email'].value;
    const password = this.registerResellerForm.controls['password'].value;
    const refCode = this.registerResellerForm.controls['refCode'].value;

    if (fullName == "") {
      this.tostr.error("Empty Field Foud", "Full name is required.");
    } else if (bName == "") {
      this.tostr.error("Empty Field Foud", "Buidness Name is required.");
    } else if (address == "") {
      this.tostr.error("Empty Field Foud", "Address is required.");
    } else if (phoneNumber == "") {
      this.tostr.error("Empty Field Foud", "Mobile is required.");
    } else if (nicNumber == "") {
      this.tostr.error("Empty Field Foud", "NIC Number is required.");
    } else if (email == "") {
      this.tostr.error("Empty Field Foud", "Email is required.");
    } else if (password == "") {
      this.tostr.error("Empty Field Foud", "Passsword is required.");
    } else if (refCode == "") {
      this.tostr.error("Empty Field Foud", "RefCode is required.");
    } else {
      this.authModel.fullName = fullName;
      this.authModel.bName = bName;
      this.authModel.address = address;
      this.authModel.phoneNumber = phoneNumber;
      this.authModel.nicNumber = nicNumber;
      this.authModel.email = email;
      this.authModel.password = password;
      this.authModel.refCode = refCode;

      this.spinner.show();
      this.authService.registerNewReseller(this.authModel).subscribe((resp: any) => {

        if (resp.code === 1) {
          this.tostr.success("Register User", "Use Register Successfully");
        } else {
          this.tostr.error("Register User", resp.message);
        }

        this.spinner.hide();
      })
    }
  }

  initRegisterResellerForm() {

    this.registerResellerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      bName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      nicNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      refCode: ['', Validators.required]
    })
  }

}
