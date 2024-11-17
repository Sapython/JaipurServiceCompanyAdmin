import { Component, OnInit, Inject } from '@angular/core';
import { serviceVariant, stageStructure, stageStructureUpdated, timeLineStructure } from './modals.structure';
import Utils from 'src/app/Shared/shared-services/util';
import { BookingService } from 'src/app/core/booking.service';
import moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/Shared/dialog/dialog.component';
import { AvailableAgentsComponent } from './available-agents/available-agents.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { JobImagesComponent } from './job-images/job-images.component';
import { BookingInvoiceService } from './invoice.service';
import { HttpClient } from '@angular/common/http';
import { UserNotificationService } from 'src/app/common/user-notification.service';
import { AgentsService } from 'src/app/agents/agents.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss'],
})
export class ModalsComponent implements OnInit {
  bookingStages:any;
  stages: stageStructure[] = [];
  timelineStages: timeLineStructure[] = [];
  timelineStagesUpdated: any[] = [];
  utils = Utils;
  dataOld: stageStructure = {
    name: '',
    title: '',
    colorClass: '',
    color: '',
    allStagesTime: '',
    bookingTime: '',
    serviceDate: '',
    slotTime: '',
    jobStartTime: '',
    jobEndTime: '',
    agentName: '',
    agentContactNo: '',
    stageStatus: false,
    progress: 0,
    button1: '',
    button2: '',
    button3: '',
  };

  dataUpdated: stageStructureUpdated = {
    id: '',
    name: '',
    title: '',
    colorClass: '',
    color: '',
    allStagesTime: '',
    bookingTime: '',
    serviceDate: '',
    slotTime: '',
    jobStartTime: '',
    jobEndTime: '',
    agentName: '',
    agentContactNo: '',
    stageStatus: false,
    progress: 0,
    button1: '',
    button2: '',
    button3: '',
    jobOTP: '',
    jobAcceptanceCharge : '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    billing : {
      discount: '',
      grandTotal: '',
      tax: '',
      subTotal : '',
    },
    variants : [],
    stage: '',
    cancelReason: '',
    cancelReasonText: '',
  };
  bookingAssignment: any[] = [];
  agentBookingSlot: any[] = [];

  showOtpmessage:boolean = false;
  agentDetails: any;

  constructor(
    public _bookingService: BookingService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalsComponent>,
    private bookingInvoiceService: BookingInvoiceService,
    private http: HttpClient,
    private userNotificationService: UserNotificationService,
    private agentsService: AgentsService
  ) {
    this.bookingStages = Utils.stageMaster;
    this.timelineStagesUpdated = Utils.timelineStages;
  }

  ngOnInit(): void {
    this.init();
    this.getBookingsAssignment();
    if (this.data.stage === Utils.stageMaster.acceptancePending.key) {
      this.getAgentBookingSlots();
    }
    this.getAgentDetails();
  }

  init() {
    const bookingVariants : serviceVariant[] = [];
    this.data.services.forEach((item: any) => {
      item.variants.forEach((element: any) => {
        bookingVariants.push(element);
      });
    });
    this.getAgentDetails().then((data) => {
      this.dataUpdated = {
        id: this.data.id,
        name: this.bookingStages[this.data.stage]['text'],
        title: this.data.stage,
        color: this.bookingStages[this.data.stage]['textColor'],
        colorClass : this.bookingStages[this.data.stage]['color'],
        allStagesTime: this.data.billing.totalJobTime,
        bookingTime: moment(this.data.createdAt.toDate()).format('DD MMM YYYY'),
        serviceDate: moment(
          new Date(this.data.timeSlot.date.seconds * 1000)
        ).format('DD MMM YYYY'),
        slotTime: moment(
          new Date(this.data.timeSlot.time.startTime.seconds * 1000)
        ).format('HH:mm a'),
        jobStartTime: this.data.otpAt? moment(new Date(this.data.otpAt.seconds * 1000)).format('HH:mm a') : '',
        jobEndTime: this.data.completedAt ? moment(new Date(this.data.completedAt.seconds * 1000)).format('HH:mm a') : '',
        agentName: this.agentDetails?.name || '',
        agentContactNo: this.agentDetails?.phoneNumber || '',
        stageStatus: false,
        stage: this.data.stage,
        progress: 0,
        button1: 'Download booking',
        button2: 'Cancel booking',
        button3: 'Complete booking',
        jobOTP : this.data.jobOtp,
        jobAcceptanceCharge : this.data.billing.totalJobAcceptanceCharge,
        customerName: this.data.address.name,
        customerPhone: this.data.currentUser.phoneNumber,
        customerAddress: this.data.address.addressLine1 + " " + this.data.address.area,
        billing : {
          discount: this.data.billing.discount,
          grandTotal: this.data.billing.grandTotal,
          tax: this.data.billing.tax,
          subTotal : this.data.billing.subTotal
        },
        variants : bookingVariants,
        cancelReason: this.data.cancelReason,
        cancelReasonText: this.data.cancelReasonText,
      };
    })
    if (this.data.stage == this.bookingStages.expired.key || this.data.stage == this.bookingStages.discarded.key) {
      for (let j = 0; j < this.timelineStagesUpdated.length; j++) {
        this.timelineStagesUpdated[j].status = false;
      }
    } 
    else{
      const activeTimelineIndex = this.timelineStagesUpdated.findIndex(item => item.key == this.data.stage);
      for (let j = 0; j < this.timelineStagesUpdated.length; j++) {
        this.timelineStagesUpdated[j].status = j < activeTimelineIndex ? true : false;
        if (this.data.stage === Utils.stageMaster.inProgress.key || this.data.stage === Utils.stageMaster.completed.key) {
          this.timelineStagesUpdated[j].status = j <= activeTimelineIndex ? true : false;
        }
      }
    }
    this.timelineStagesUpdated = this.timelineStagesUpdated.map((item) => {
      item.date = '---';
      item.time = '---';
      if (item.dateKey && this.data[item.dateKey]) {
        item.date = Utils.formatDate(this.data[item.dateKey].seconds, 'DD MMM');
        item.time = Utils.formatDate(this.data[item.dateKey].seconds, 'hh:mm A');
      }
      return item;
    });
  }

  async getAgentDetails() {
    if (!this.data.assignedAgent) {
      return of();
    }
    return await this.agentsService.getAgentById(this.data.assignedAgent).then((data) => {
      data.docs.map((agent) => {
        this.agentDetails = agent.data();
      })
    })
  }

  getBookingsAssignment() {
    try{
      this._bookingService.getBookingsAssignment(this.data.currentUser.userId, this.data.id).then((assignments) => {
        assignments.docs.map((assignment: any) => {
          if (!assignment.data().actionPerformed && assignment.data().agentId === this.data.assignedAgent) {
            this.bookingAssignment.push({...assignment.data(), id: assignment.id});
          }
        });
      });
    } catch(e) {
    }
  }

  getAgentBookingSlots() {
    this._bookingService.getAgentBookingSlots(this.data.assignedAgent, moment(new Date(this.data.timeSlot.time.startTime.seconds * 1000)).format('YYYY-MM-DD')).then((slots) => {
      slots.docs.map((slot: any) => {
        this.agentBookingSlot.push({...slot.data(), id: slot.id});
      });
    });
  }

  stageChange(id: any) {
    for (let i = 0; i < this.stages.length; i++) {
      if (id == this.stages[i].name) {
        this.data = {
          name: this.stages[i].name,
          title: this.stages[i].title,
          color: this.stages[i].color,
          allStagesTime: this.stages[i].allStagesTime,
          bookingTime: this.stages[i].bookingTime,
          serviceDate: this.stages[i].serviceDate,
          slotTime: this.stages[i].slotTime,
          jobStartTime: this.stages[i].jobStartTime,
          jobEndTime: this.stages[i].jobEndTime,
          agentName: this.stages[i].agentName,
          agentContactNo: this.stages[i].agentContactNo,
          stageStatus: this.stages[i].stageStatus,
          progress: this.stages[i].progress,
          button1: this.stages[i].button1,
          button2: this.stages[i].button2,
          button3: this.stages[i].button3,
        };
        if (id == Utils.stageMaster.expired.key || id == Utils.stageMaster.discarded.key) {
          for (let j = 0; j < this.timelineStages.length; j++) {
            this.timelineStages[j].status = false;
          }
        } else
          for (let j = 0; j < this.timelineStages.length; j++) {
            if (j <= i) this.timelineStages[j].status = true;
            else this.timelineStages[j].status = false;
          }
        break;
      }
    }
  }

  copyToClipboard(dataToCopy:string){
    navigator.clipboard.writeText(dataToCopy);
    this.showOTPCopiedMessage();
  }

  showOTPCopiedMessage(){
    this.showOtpmessage = true;
    setTimeout(() => {
      this.showOtpmessage = false;
    },1000);
  }

  async refreshData() {
    await this._bookingService.getBookingsById(this.data.currentUser.userId, this.data.id).then((bookings)=> {
      bookings.docs.map((booking) => {
        this.data = { ...booking.data(), id: booking.id };
        this.init();
      })
    });
  }

  cancelBooking() {
    this.dialog.open(CancelBookingComponent, {data: {...this.data}})
      .afterClosed()
      .subscribe(async (data) => {
        if (data) {
          await this.refreshData();
        }
    });
  }

  async allotBooking() {
    this.dialog.open(AvailableAgentsComponent, {data: {...this.data}})
    .afterClosed()
    .subscribe(async (data) => {
      await this.refreshData();
      await this.getAgentBookingSlots();
    });
  }

  acceptBooking() {
    this.dialog.open(ConfirmationDialogComponent, {data: {message: 'Are you sure?'}})
      .afterClosed()
      .subscribe(async (data) => {
        if (data) {
          await this._bookingService.updateBooking(
            this.data.currentUser.userId,
            this.data.id,
            Utils.stageMaster.jobAccepted.key
          );
          await this._bookingService.updAgentBookingSlots(
            this.data.assignedAgent,
            this.agentBookingSlot[0].id,
            {
              ...this.agentBookingSlot[0],
              bookings: [
                ...this.agentBookingSlot[0].bookings,
                {
                  slotId: this.data.timeSlot.id,
                  bookingId: this.data.id
                }
              ]
            }
          );
          await this.bookingAssignment && this.bookingAssignment.length && this._bookingService.updateBookingAssignment(
            this.data.currentUser.userId,
            this.data.id,
            this.bookingAssignment[0].id,
            {
              accepted: true,
              actionPerformed: true
            }
          );
          await this.userNotificationService.addUserNotification(this.data.currentUser.userId, this.userNotificationService.message.bookingAccepted);
          await this.refreshData();
        }
    });
  }

  enterOTP() {
    this.dialog.open(OtpVerificationComponent, {data: {...this.data}})
    .afterClosed()
    .subscribe(async (data) => {
      await this.refreshData();
      this.uploadImages(false);
    });
  }

  completeBooking() {
    this.dialog.open(InvoiceComponent, {data: {...this.data}})
      .afterClosed()
      .subscribe(async (data) => {
          await this.refreshData();
      });
  }

  uploadImages(after: boolean) {
    this.dialog.open(JobImagesComponent, {disableClose: true, data: {...this.data, after}})
      .afterClosed()
      .subscribe(async (data) => {
        await this.refreshData();
      });
  }

  downloadInvoice() {
    this.bookingInvoiceService.downloadInvoice(this.data);
  }
}
