import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor (private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {}

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

    } else if (bName == "") {

    } else if (address == "") {

    } else if (address == "") {

    } else if (phoneNumber == "") {

    } else if (nicNumber == "") {

    } else if (email == "") {

    } else if (password == "") {

    } else if (refCode == "") {

    } else {
      this.authModel.fullName = fullName;
      this.authModel.bName = bName;
      this.authModel.address = address;
      this.authModel.phoneNumber = phoneNumber;
      this.authModel.nicNumber = nicNumber;
      this.authModel.email = email;
      this.authModel.password = password;
      this.authModel.refCode = refCode;

      this.authService.registerNewReseller(this.authModel).subscribe((resp: any) => {

        if (resp.code === 1) {
          console.log(resp);
        }
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
