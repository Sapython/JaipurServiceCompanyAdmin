import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { agentStruture, bookings, tabs } from './bookings.structure';
import { agentColor, agents, expandableTabs } from './bookings.data';
import { BookingService } from 'src/app/core/booking.service';
import { Booking } from 'src/app/core/booking.structure';
import { FormControl, FormGroup } from '@angular/forms';
import { AvailableAgentsService } from './available-agents.service';
import Utils from 'src/app/Shared/shared-services/util';
import { MatDialog } from '@angular/material/dialog';
import { ModalsComponent } from '../modals/modals.component';
import moment from 'moment';

@Component({
  selector: 'app-expandable-cards',
  templateUrl: './expandable-cards.component.html',
  styleUrls: ['./expandable-cards.component.scss'],
})
export class ExpandableCardsComponent implements OnInit, OnDestroy {
  tabs: tabs[] = [...expandableTabs]; // Hard Coded
  agents: agentStruture[] = []; // Fetched from DB
  bookings: any[] = []; // Fetched from DB
  pendingCount: number[] = [0, 0, 0];
  completedCount: number = 0;
  inProgressCount: number = 0;
  cancelledCount: number = 0;
  expiredCount: number = 0;
  @Output() selectedBookingFilter = new EventEmitter<any>();
  availableAgents: any[] | undefined;
  utils = Utils

  stages: any = {
    started: 'Pending',
    unassigned: 'Pending',
    assigned: 'Pending',
    completed: 'Completed',
    inProgress: 'In-Progress',
    cancelled: 'Cancelled',
  };

  constructor(
    private bookingService: BookingService,
    private availableAgentsService: AvailableAgentsService,
    private dialog: MatDialog,
  ) {
    this.bookingService.refreshCounts.subscribe((data) => {
      if (data) {
        this.allBookings(this.bookingService.selectedDate.value);
      }
    });

    this.bookingService.selectedDate.subscribe((data) => {
      if (data) {
        this.allBookings(data);
      }
    });
  }

  ngOnInit(): void {
    // this.allBookings();
    this.getAvailableAgents();
  }

  ngOnDestroy(): void {
    // this.bookingService.refreshCounts.unsubscribe();
  }

  async getAvailableAgents() {
    const today = moment().format('YYYY-MM-DD');
    await this.availableAgentsService.getAvailableAgents(today).then((data: any) => {
      this.tabs[0].allBookings = [];
      this.tabs[0].filteredBookings = [];
      data?.map((item: any) => {
        const obj = {...item, color: agentColor[item.present]};
        this.tabs[0].allBookings.push(obj);
        this.tabs[0].filteredBookings.push(obj);
        return data;
      });
    });
  }

  getAgentCount(status: string) {
    return this.tabs[0].allBookings.filter(item => item['present'] === status).length;
  }

  async allBookings(date: string): Promise<void> {
    await this.bookingService.getBookings(date).then((res) => {
        this.bookings = [];  
        res.docs.map((booking) => {
          if (moment(new Date(date)).format('YYYY-MM-DD') === moment(new Date(booking.data()['timeSlot']?.date.seconds * 1000)).format('YYYY-MM-DD')) {
            this.bookings.push({
              id: booking.id,
              ...booking.data(),
            });
          }
        });
      }
    );

    this.pendingCount = [0, 0, 0];
    this.completedCount = 0;
    this.inProgressCount = 0;
    this.cancelledCount = 0;
    this.expiredCount = 0;
    this.tabs.forEach((tab: any) => {
      if (tab.title != Utils.stageMaster.availableAgents.text) {
        tab.allBookings = [];
        tab.filteredBookings = [];
      }
    });

    this.bookings.map((booking) => {
      booking.tabTitle = this.stages[booking?.stage];
      if (booking.billing) {
        booking.billing.grandTotal = Math.round(booking.billing?.grandTotal);
      }
      if (booking.stage === Utils.stageMaster.allotmentPending.key) {
        this.pendingCount[0] = this.pendingCount[0] + 1;
      } else if (booking.stage === Utils.stageMaster.otpVerificationPending.key) {
        this.pendingCount[1] = this.pendingCount[1] + 1;
      } else if (booking.stage === Utils.stageMaster.acceptancePending.key) {
        this.pendingCount[2] = this.pendingCount[2] + 1;
      } else if (booking.stage === Utils.stageMaster.completed.key) {
        this.completedCount = this.completedCount + 1;
      } else if (booking.stage === Utils.stageMaster.inProgress.key || booking.stage === Utils.stageMaster.paymentPending.key || booking.stage === Utils.stageMaster.paymentCompleted.key || booking.stage === Utils.stageMaster.jobAccepted.key || booking.stage === Utils.stageMaster.jobStarted.key) {
        this.inProgressCount = this.inProgressCount + 1;
      } else if (booking.stage === Utils.stageMaster.discarded.key) {
        this.cancelledCount = this.cancelledCount + 1;
      } else if (booking.stage === Utils.stageMaster.expired.key){
        this.expiredCount = this.expiredCount + 1;
      }

      this.tabs.forEach((tab: any) => {
        if (tab.title != Utils.stageMaster.availableAgents.text && tab.filterKeys.includes(booking.stage)) {
          tab.allBookings.push(booking);
          tab.filteredBookings.push(booking);
        }
      });
    });
  }

  searchBookings(e: any, title: string): void {
    const searchValue = e.target.value;
    this.tabs.forEach((tab) => {
      if (tab.title === title) {
        if (!searchValue) {
          tab.filteredBookings = tab.allBookings;
          return;
        }
        tab.filteredBookings = tab.allBookings.filter(
          (booking) =>
            (booking?.id && booking?.id.toLowerCase().includes(searchValue.toLowerCase())) ||
            (booking?.mainCategory?.name && booking?.mainCategory?.name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
            (booking?.name && booking?.name
              .toLowerCase()
              .includes(searchValue.toLowerCase())) ||
            (booking?.phoneNumber && booking?.phoneNumber
                .toLowerCase()
                .includes(searchValue.toLowerCase()))
        );
      }
    });
  }

  applyFilterOnDashboard(index : number){
    this.tabs[index].isFilterSliderActive = !this.tabs[index].isFilterSliderActive;
    const activeFilterTabs:any[] = [];
    this.tabs.map((item) => {
      item.isFilterSliderActive && activeFilterTabs.push(item.filterKeys);
    });
    this.selectedBookingFilter.emit(activeFilterTabs.flat())
  }

  onClickBooking(booking:any){
    this.dialog.open(ModalsComponent, {disableClose: true,  data: {...booking}, autoFocus: false, })
    .afterClosed()
    .subscribe(async (data) => {
      this.bookingService.refreshCounts.next(true);
    });
  }
}
