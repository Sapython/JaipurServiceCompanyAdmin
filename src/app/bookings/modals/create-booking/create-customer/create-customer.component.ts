import { Component, Inject, OnInit } from '@angular/core';
import { RecaptchaVerifier } from '@angular/fire/auth';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { NotificationService } from 'src/app/Shared/core/notification.service';
import { LoaderService } from 'src/app/Shared/shared-services/loader.service';
import { BookingService } from 'src/app/core/booking.service';
import { CustomerAuthService } from 'src/app/core/customer-auth.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  showOTP: boolean = false;
  showDetails: boolean = false;
  isValidMobile:boolean = false;

  gender = new FormControl('');
  imgSrc: any =
    'https://ik.imagekit.io/xji6otwwkb/Profile.png?updatedAt=1680849745697';

  genderOptions: string[] = ['Male', 'Female', 'Other'];
  phoneNumber:string= '';
  verifier:RecaptchaVerifier|undefined;
  customerForm = this.fb.group({
    phone: ['', Validators.required],
    otp: ['', Validators.required],
    name: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required]
  });
  customerData:any;
  constructor(
    public dialogRef: MatDialogRef<CreateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerAuthService: CustomerAuthService,
    private fb : FormBuilder,
    public _bookingService : BookingService,
    private notificationService : NotificationService,
    public _loaderService : LoaderService
  ) {}

  ngOnInit(): void {
    this.imgSrc = this.data.src;
  }

  isOTP(e: any) {
    if (e.target.value != '') this.showDetails = true;
    else this.showDetails = false;
  }

  imgUpload(e: any) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgSrc = reader.result;
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async sendOtp(){
    this._loaderService.showLoader();
    const phoneNumber = this.customerForm.get("phone")?.value ?? '';
    if (!this.verifier) this.verifier = new RecaptchaVerifier('recaptcha-container',{'size':'invisible'},this.customerAuthService.auth);
    this.customerAuthService.loginWithPhoneNumber(phoneNumber,this.verifier).then((login)=>{
      this.customerAuthService.loginConfirmationResult = login;
      this.showOTP = true;
      this._loaderService.hideLoader();
    }).catch((error)=>{
      console.log(error);
    }).finally(()=>{
    });
  } 

  submitOtp(){
    if(this.customerAuthService.loginConfirmationResult){
      this._loaderService.showLoader();
      const otp = this.customerForm.get("otp")?.value ?? '';
      this.customerAuthService.loginConfirmationResult.confirm(otp).then((result)=>{
        this.customerData = result.user;
        //this.customerAuthService.setUserData(result.user);
        this.showDetails = true;
        this.showOTP = false;
        this.isValidMobile = true;
        this._loaderService.hideLoader();
        this.customerForm.controls['phone'].disable();
      }).catch((error)=>{
      }).finally(()=>{
      })
    }
  }

  saveCustomer(){
    this._loaderService.showLoader();
    const userObject = {
      uid : this.customerData.uid,
      displayName: this.customerForm.get("name")?.value,
      phoneNumber: this.customerForm.get("phone")?.value,
      gender : this.customerForm.get("gender")?.value,
      dateofbirth : moment(this.customerForm.get("dateOfBirth")?.value).format("X"),
      photoURL :'',
      email : '',
      addresses : {
        addressLine1: this.customerForm.get("address1")?.value,
        addressLine2 : `${this.customerForm.get("address2")?.value},${this.customerForm.get("city")?.value},${this.customerForm.get("state")?.value}`,
        name: this.customerForm.get("name")?.value,
        pinCode : this.customerForm.get("pincode")?.value
      }
    }
    this.customerAuthService.setUserData(userObject).then((response) => {
      this._loaderService.hideLoader();
      this._bookingService.userAdded.next(true);
      this.notificationService.presentSuccessToast(
        'Customer added successfully'
      );
      this.onNoClick();
    });
  }
}
