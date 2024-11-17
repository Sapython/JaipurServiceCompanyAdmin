import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/Shared/core/notification.service';
import Utils from 'src/app/Shared/shared-services/util';
import { UserNotificationService } from 'src/app/common/user-notification.service';
import { BookingService } from 'src/app/core/booking.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
  otpInputForm = this.fb.group({
    inpt1: ['', Validators.required],
    inpt2: ['', Validators.required],
    inpt3: ['', Validators.required],
    inpt4: ['', Validators.required],
    inpt5: ['', Validators.required],
    inpt6: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OtpVerificationComponent>,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private bookingService: BookingService,
    private userNotificationService: UserNotificationService
  ) {
  }

  ngOnInit() {

  }

  focusNext(i: number) {
    const inputs: any = document.querySelectorAll('.inputBox');
    inputs[i].querySelector('input').focus();
  }

  verifyOtp() {
    const submittedOtp = `${this.otpInputForm.value['inpt1']}${this.otpInputForm.value['inpt2']}${this.otpInputForm.value['inpt3']}${this.otpInputForm.value['inpt4']}${this.otpInputForm.value['inpt5']}${this.otpInputForm.value['inpt6']}`;
    const otp = this.data.jobOtp;
    if (submittedOtp.toString() != otp.toString()) {
      this.notificationService.presentErrorToast("Invalid OTP");
      return;
    } else {
      this.bookingService.updateBooking(this.data.currentUser.userId, this.data.id, Utils.stageMaster.inProgress.key);
      this.userNotificationService.addUserNotification(this.data.currentUser.userId, this.userNotificationService.message.bookingOTPVerified);
      this.dialogRef.close({res: true});
    }
  }
}
