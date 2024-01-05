import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KYCInfo } from 'src/app/shared/models/KYCInfo/kycinfo';
import { Profile } from 'src/app/shared/models/Profile/profile';
import { Request } from 'src/app/shared/models/Request/request';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileDetailsForm!: FormGroup;
  kycUploadForm!: FormGroup;
  requestModel = new Request();
  profileModel = new Profile();
  kycModel = new KYCInfo();
  isProfileModalOpen = false;
  isAddKYCModalOpen = false;

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initProfileDetailsForm();
    this.initKYCUploadForm();
    this.getProfileInfo();
    this.loadKYCList();
  }

  loadKYCList() {
    
  }

  onChangeFrontImage($event: any) {
    const frontImage = $event.target.files[0];
    this.kycUploadForm.patchValue({"frontImg": frontImage})
  }

  onChangeBackImage($event: any) {
    const backImage = $event.target.files[0];
    console.log($event.target)
    this.kycUploadForm.patchValue({"backImg": backImage})
  }

  onSubmitKycUploadForm() {

    console.log(this.kycUploadForm.value)

    const frontImage = this.kycUploadForm.controls['frontImg'].value;
    const backImage = this.kycUploadForm.controls['backImg'].value;

    if (frontImage == "") {

    } else if (backImage == "") {

    } else {
      this.kycModel.token = sessionStorage.getItem("authToken");
      
      this.convertImageToBase64(frontImage).then((base64String) => {
        this.kycModel.frontImg  =base64String;
      })

      this.convertImageToBase64(backImage).then((base64String) => {
        this.kycModel.backImg = base64String;
      }).then(() => {
        this.profileService.submitKYCInfo(this.kycModel).subscribe((resp: any) => {

          if (resp.code === 1) {
            
          }
        })
      })
    }
  }

  initKYCUploadForm() {
    this.kycUploadForm = this.formBuilder.group({
      frontImg: ['', Validators.required],
      backImg: ['', Validators.required]
    })
  }

  openEditProfileForm(type: number) {

    if (type == 1) {
      this.isProfileModalOpen = true;
      this.isAddKYCModalOpen = false;
    } else {
      this.isProfileModalOpen = false;
      this.isAddKYCModalOpen = true;
    }
  }

  getProfileInfo() {
    this.requestModel.token = sessionStorage.getItem("authToken");
    this.requestModel.flag = sessionStorage.getItem("role");

    this.profileService.getProfileInfo(this.requestModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        this.profileModel.fullName = dataList.data[0].fullName;
        this.profileModel.email = dataList.data[0].email;
        this.profileModel.address = dataList.data[0].address;
        this.profileModel.phoneNumber = dataList.data[0].phoneNumber;
        this.profileModel.buisnessName = dataList.data[0].buisnessName;
      }
    })
  }

  onSubmitUpdateProfileForm() {

    const fullName = this.profileDetailsForm.controls['fullName'].value;
    const buisnessName = this.profileDetailsForm.controls['buisnessName'].value;
    const address = this.profileDetailsForm.controls['address'].value;
    const email = this.profileDetailsForm.controls['email'].value;

    if (fullName == "") {

    } else if (buisnessName == "") {

    } else if (address == "") {

    } else if (email == "") {

    } else {

    }
  }

  initProfileDetailsForm() {
    this.profileDetailsForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      buisnessName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required]
    })
  }

  convertImageToBase64(fileInput: any): Promise<string> {
    console.log(fileInput);
    return new Promise<string>((resolve, reject) => {
      const file: File = fileInput;
      const reader: FileReader = new FileReader();

      reader.onloadend = () => {
        // The result attribute contains the base64 string
        const base64String: string = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the image file as a Data URL
      reader.readAsDataURL(file);
    });
  }

}
