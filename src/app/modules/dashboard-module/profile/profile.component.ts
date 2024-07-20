import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BankDetails } from 'src/app/shared/models/BankDetails/bank-details';
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
  passwordchangeForm!:  FormGroup;
  BankDetailsForm!: FormGroup;
  kycUploadForm!: FormGroup;
  requestModel = new Request();
  profileModel = new Profile();
  BankDetails = new BankDetails();
  kycModel = new KYCInfo();
  isProfileModalOpen = false;
   isAddKYCModalOpen = false;

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder, private router: Router
            , private tostr: ToastrService, private spinner: NgxSpinnerService, private fb: FormBuilder) {

              this.passwordchangeForm = this.fb.group({
                NewPassword: ['', [Validators.required]],
              });

              this.BankDetailsForm = this.fb.group({
                BankName: ['', Validators.required],
                AccountNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
                BranchName: ['', Validators.required],
                Name: ['', Validators.required],
              });
            }

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
      this.tostr.error("Empty Field Founded", "Front Image is required.");
    } else if (backImage == "") {
      this.tostr.error("Empty Field Founded", "Back Image is required.");
    } else {
      this.kycModel.token = sessionStorage.getItem("authToken");
      
      this.convertImageToBase64(frontImage).then((base64String) => {
        this.kycModel.frontImg  =base64String;
      })

      this.convertImageToBase64(backImage).then((base64String) => {
        this.kycModel.backImg = base64String;
      }).then(() => {
        this.spinner.show();
        this.profileService.submitKYCInfo(this.kycModel).subscribe((resp: any) => {

          if (resp.code === 1) {
            this.tostr.success("KYC Documets Upload", "KYC Documents Uploading Successfully.");
          } else {
            this.tostr.error("KYC Socument Uploadiung", resp.message);
          }

          this.spinner.hide();
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

  openEditBankForm() {

   
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
        this.BankDetails.BankName = dataList.data[0].bank_name;
        this.BankDetails.AccountNumber = dataList.data[0].account_number;
        this.BankDetails.Name = dataList.data[0].resellr_name;
        this.BankDetails.BranchCode = dataList.data[0].branch_code;
      }
    })
  }

  onSubmitUpdateProfileForm() {

    const fullName = this.profileDetailsForm.value['fullname'];
    const buisnessName = this.profileDetailsForm.value['buisnessName'];
    const address = this.profileDetailsForm.value['address'];
    const email = this.profileDetailsForm.value['email'];
    console.log(this.profileDetailsForm);

    if (fullName == "") {
      this.tostr.error("Full Name Required");
    } else if (buisnessName == "") {
      this.tostr.error("Buisness Name Name Required");
    } else if (address == "") {
      this.tostr.error("Address Required");
    } else if (email == "") {
      this.tostr.error("Email Required");
    } else {
      this.profileModel.token = sessionStorage.getItem("authToken");
      this.profileModel.fullName = fullName;
      this.profileModel.address = address;
      this.profileModel.buisnessName = buisnessName;
      this.profileModel.email = email;

      this.profileService.UpdateProfileDetails(this.profileModel).subscribe((resp: any) => {
        if (resp.code === 1) {
          this.tostr.success(" Data Update Successfully.");
          window.location.reload();
        } else {
          this.tostr.error("Error In Data", resp.message);
        }   
      })
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

  onSubmitUpdateBankForm(){

    if (this.BankDetailsForm.valid) {
     
    const BankName = this.BankDetailsForm.value['BankName'];
    const  AccountNumber = this.BankDetailsForm.value['AccountNumber'] ;
    const  BranchCode = this.BankDetailsForm.value['BranchName'];
    const Name = this.BankDetailsForm.value['Name'];

    this.BankDetails.token = sessionStorage.getItem("authToken");
    this.BankDetails.BankName = BankName;
    this.BankDetails.AccountNumber = AccountNumber;
    this.BankDetails.BranchCode = BranchCode;
    this.BankDetails.Name = Name;

    this.profileService.UpdateBankDeatils(this.BankDetails).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("Bank Data Upload Successfully.");
        window.location.reload();
      } else {
        this.tostr.error("Error In Data", resp.message);
      }   
    })

    console.log(Name);
    } else {
      this.markFormAsTouched(this.BankDetailsForm);
    }
    
    

  }
  onSubmitEditBankForm(){
    if (this.BankDetailsForm.valid) {
     
      const BankName = this.BankDetailsForm.value['BankName'];
      const  AccountNumber = this.BankDetailsForm.value['AccountNumber'] ;
      const  BranchCode = this.BankDetailsForm.value['BranchName'];
      const Name = this.BankDetailsForm.value['Name'];
  
      this.BankDetails.token = sessionStorage.getItem("authToken");
      this.BankDetails.BankName = BankName;
      this.BankDetails.AccountNumber = AccountNumber;
      this.BankDetails.BranchCode = BranchCode;
      this.BankDetails.Name = Name;
  
      this.profileService.UpdateEditBankDeatils(this.BankDetails).subscribe((resp: any) => {
        if (resp.code === 1) {
          this.tostr.success("Bank Data Upload Successfully.");
          window.location.reload();
        } else {
          this.tostr.error("Error In Data", resp.message);
        }   
      })
  
      console.log(Name);
      } else {
        this.markFormAsTouched(this.BankDetailsForm);
      }
      
  }

  markFormAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onSubmitPasswordchange(){
    this.requestModel.token = sessionStorage.getItem("authToken");
    this.requestModel.NewPassword = this.passwordchangeForm.value['NewPassword'] ;

    this.profileService.UpdatePassword(this.requestModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        this.tostr.success("Bank Data Upload Successfully.");
        window.location.reload();
      }
      else {
        this.tostr.error("Error In Data", resp.message);
      } 
    })
  }

}
