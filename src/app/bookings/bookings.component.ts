import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from '../core/booking.structure';
import { BookingService } from '../core/booking.service';
import { Dialog } from '@angular/cdk/dialog';
import { SelectAgentComponent } from './select-agent/select-agent.component';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import Utils from '../Shared/shared-services/util';
import { CreateBookingComponent } from './modals/create-booking/create-booking.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { ModalsComponent } from './modals/modals.component';
import { LoaderService } from '../Shared/shared-services/loader.service';
import { NoBookingComponent } from './modals/no-booking/no-booking.component';
import { ConfirmationDialogComponent } from '../Shared/dialog/dialog.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit, OnDestroy {
  bookingSearchControl = new FormControl('');
  options: any[] = [];
  isFullWidth: boolean = false;
  isCreateModal: boolean = false;

  allBookings: Booking[] = [];
  dashboardBookings: Booking[] = [];
  selectedDate: string = `${moment(new Date())}`;
  selectedDateBooking: Booking[] = [];
  selectedDateBookingFiltered: Booking[] = [];
  bookingDateRange: any[] = [];
  bookingStages: any = {};
  activeBookingStages: any = {};
  activeCategory: any[] = [];
  timeSlots: any = {};
  timeSlotsMap: any = {};
  dateInputForm: FormGroup;
  maxFutureDate: any;
  activeBooking: any;
  selectedFilter: string[] = [];

  bookingSearchList$!: Observable<QuerySnapshot<DocumentData>>;
  private bookingSearchText$ = new Subject<string>();
  
  constructor(
    private bookingService: BookingService,
    private dialog: Dialog,
    private matdialog: MatDialog,
    public modalDialog: MatDialog,
    public _loaderService: LoaderService
  ) {
    this._loaderService.showLoader();
    this.maxFutureDate = moment().add('2', 'days').format('YYYY-MM-DD');
    this.bookingStages = Utils.stageMaster;
    this.addInitialFilters();

    //this.timeSlots = this._variableService.timeSlotMaster;
    this.dateInputForm = new FormGroup({
      date: new FormControl<Date | null>(null),
    });
    this.bookingService.getSlots().then((slots) => {
      this.timeSlots = slots.docs.map((slot) => {
        this.timeSlotsMap[slot.id] = slot.data();
        return { ...slot.data(), id: slot.id };
      });
      this.timeSlots = this.timeSlots.sort((a: any, b: any) =>
        a.index > b.index ? 1 : -1
      );
      this.generateDateRange(this.selectedDate);
      this._loaderService.hideLoader();
    });

    this.bookingService.refreshCounts.subscribe((data) => {
      if (data) {
        this.generateDateRange(this.selectedDate);
      }
    });
    this.bookingService.selectedDate.next(this.selectedDate);
    console.log(this.timeSlotsMap)
  }

  ngOnInit(): void {
    
    this.bookingSearchList$ = this.bookingSearchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(bookingInputValue => 
        this.bookingService
        .getBookingsByKey('id',bookingInputValue)
    ));
    
    this.bookingSearchList$.subscribe((bookings) => {
      const optionValues = bookings.docs.map((booking) => {
        return { id: booking.id, ...booking.data() } as Booking;
      });
      const controlValue = (this.bookingSearchControl.value+'').toLowerCase();
      this.options = optionValues.filter((item) => {
        return item.id.toLowerCase().indexOf(controlValue) == 0;
      });
    });
  }

  ngOnDestroy(): void {
    // this.bookingService.refreshCounts.unsubscribe();
  }

  openCreateBookingDialog(): void {
    const dialogRef = this.modalDialog.open(CreateBookingComponent, {
      data : {
        timeSlots: this.timeSlots
      },
      height: '90vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.data == true){
        this.onClickDateRange(this.selectedDate,true);
      }
    });
  }

  get date() {
    return this.dateInputForm.get('date');
  }

  dispDate() {
    this.selectedDate = this.dateInputForm.controls['date'].value;
    this.bookingService.selectedDate.next(this.selectedDate);
    this.generateDateRange(this.selectedDate);
  }

  selectAgent(booking: Booking) {
    let dialog = this.dialog.open(SelectAgentComponent);
    dialog.closed.subscribe(async (agent: any) => {
      await this.bookingService.assignAgent(
        booking.currentUser.userId,
        booking.id,
        agent.value
      );
      this.ngOnInit();
    });
  }

  getBookingSlotCss(bookingItem: any) {
    let jobDuration = bookingItem.billing.totalJobTime;
    const bookingItemIndex = this.timeSlots.findIndex((item:any) => item.id == bookingItem.timeSlot.id);
    return `slot-start-${bookingItemIndex} slot-width-${Math.round(jobDuration / 2)}`;
  }

  getBookingSlotGradient(stage: any) {
    return (
      stage &&
      this.bookingStages[stage] &&
      `${this.bookingStages[stage]['gradient']}`
    );
  }

  onClickDateRange(selectedDate: any, isActive: boolean) {
    this.selectedDate = selectedDate;
    this.bookingService.selectedDate.next(this.selectedDate);
    if (!isActive) {
      let dialog = this.modalDialog.open(NoBookingComponent);
    } else {
      this.generateDateRange(selectedDate);
    }
  }

  generateDateRange(currentDate: any) {
    const dateArr: any = {};
    const newPrevDate = moment(currentDate)
      .subtract(3, 'days')
      .format('YYYY-MM-DD');
    const newNextDate = moment(currentDate).add(4, 'days').format('YYYY-MM-DD');
    let start = new Date(newPrevDate);
    let end = new Date(newNextDate);
    const copyStart = start;
    const copyEnd = end;
    while (start < end) {
      const dateDiff = moment(moment(start).format('YYYY-MM-DD')).diff(
        moment().format('YYYY-MM-DD'),
        'days'
      );
      const dateObject = {
        fullDate: moment(start),
        dateText: moment(start).format('DD/MM'),
        isActive: dateDiff < 3,
        dateDiff: dateDiff,
        bookingCount: {},
      };
      dateArr[moment(start).format('YYYY-MM-DD')] = dateObject;
      const newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
    }
    this.bookingDateRange = dateArr;
    this.bookingService
      .getBookingsByDate(copyStart, copyEnd)
      .then((bookings) => {
        this.dashboardBookings = bookings.docs.map((booking) => {
          return { ...booking.data(), id: booking.id } as Booking;
        });
        this.selectedDateBooking = this.dashboardBookings.filter(
          (bookingItem) => {
            if (bookingItem.timeSlot) {
              return (
                moment(
                  moment(new Date(bookingItem.timeSlot.date.seconds * 1000)).format('YYYY-MM-DD')
                ).diff(moment(currentDate).format('YYYY-MM-DD'), 'days') == 0
              );
            }
            return null;
          }
        );
        this.activeBookingStages = {};
        this.activeCategory = [];
        this.selectedDateBooking.map((bookingItem: any) => {
          this.activeBookingStages[bookingItem.stage] =
            this.bookingStages[bookingItem.stage];
          const categoryObject = {
            id: bookingItem.mainCategory.id,
            name: bookingItem.mainCategory.name,
            image: bookingItem.mainCategory.image,
          };
          if (
            !this.activeCategory.find(
              (item) => item.id == bookingItem.mainCategory.id
            )
          ) {
            this.activeCategory.push(categoryObject);
          }
        });

        this.dashboardBookings.map((bookingItem: any) => {
          const bookingCreateAt: any = moment(
            new Date(bookingItem.timeSlot.date.seconds * 1000)
          ).format('YYYY-MM-DD');
          if (bookingItem.stage && this.bookingDateRange[bookingCreateAt]) {
            if (
              this.bookingDateRange[bookingCreateAt]?.bookingCount[
                bookingItem.stage
              ]
            ) {
              this.bookingDateRange[bookingCreateAt].bookingCount[
                bookingItem.stage
              ].count++;
            } else {
              this.bookingDateRange[bookingCreateAt].bookingCount[
                bookingItem.stage
              ] = {};
              this.bookingDateRange[bookingCreateAt].bookingCount[
                bookingItem.stage
              ]['count'] = 1;
                this.bookingDateRange[bookingCreateAt].bookingCount[
                  bookingItem.stage
                ]['css-class'] = this.bookingStages[bookingItem.stage]?.color;
            }
          }
        });
        this.filterSelectedDateBookings();
      });
  }

  getObjectValueOnKey(customObject: any, key: string) {
    return customObject && customObject[key];
  }

  getObjectSize(customObject: Object) {
    return Object.keys(customObject).length;
  }

  drop(event: any) {
    console.log(event);
  }

  changeSlotStatus($event: any, slotId: string, slotStatus: boolean) {
    this.matdialog.open(ConfirmationDialogComponent, {data: {message: 'Are you sure?'}})
      .afterClosed()
      .subscribe(async (data) => {
        if (data) {
          this.bookingService.updateSlotStatus(slotId, slotStatus);
          this.timeSlots = this.timeSlots.map((timeslot: any) => {
            if (timeslot.id === slotId) {
              timeslot.active = slotStatus;
            }
            return timeslot;
          });
        } else {
          this.timeSlots = this.timeSlots.map((timeslot: any) => {
            if (timeslot.id === slotId) {
              timeslot.active = !slotStatus;
            }
            return timeslot;
          });
          $event.target.checked = !slotStatus;
        }
    });
  }

  onSearchChange(bookingSearchInput:any){
    bookingSearchInput &&  this.bookingSearchText$.next(bookingSearchInput.target.value); 
  }

  onBookingDropdownSelect(event:any){
    const selectedSearchBookingId = event.option.value;
    const selectedSearchBooking = this.options.find(item => item.id == selectedSearchBookingId);
    //this.generateDateRange(moment(selectedSearchBooking.createdAt.toDate()).format('YYYY-MM-DD'));
    this.onClickBooking(selectedSearchBooking);
  }

  onClickBooking(booking:any){
    this.modalDialog.open(ModalsComponent, {disableClose: true,  data: {...booking}, autoFocus: false, })
    .afterClosed()
    .subscribe(async (data) => {
      // this.generateDateRange(this.selectedDate);
    });
  }

  onChangeBookingFilter(selectedFilters: string[]){
    this.selectedFilter = selectedFilters;
    this.filterSelectedDateBookings();
  }

  filterSelectedDateBookings(){
    this.selectedDateBookingFiltered = this.selectedDateBooking.filter((item):any => {
      return item.stage && this.selectedFilter.indexOf(item.stage) > -1;
    });
  }

  addInitialFilters(){
    Object.keys(this.bookingStages).map((item) => {
      this.selectedFilter.push(this.bookingStages[item].key);
    });
    this.selectedFilter.push(this.bookingStages.jobAccepted.key,this.bookingStages.jobStarted.key,this.bookingStages.paymentPending.key,this.bookingStages.paymentCompleted.key)
  }
}
