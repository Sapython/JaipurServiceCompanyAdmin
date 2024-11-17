import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { BookingService } from 'src/app/core/booking.service';
import { LoaderService } from 'src/app/Shared/shared-services/loader.service';
import moment from 'moment';
import { CreateBookingService } from 'src/app/core/create-booking.service';
import { BookingUpdated } from 'src/app/core/booking.structure';
import { Timestamp } from 'firebase/firestore';
import { Service } from 'src/app/service/service.structure';
import { NotificationService } from 'src/app/Shared/core/notification.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit, OnDestroy {
  minBookingDate: any;
  initialDatePickerValue:string ='Date of Service';
  datePickerText:string = ''
  userSearchList$!: Observable<any>;
  private userSearchText$ = new Subject<string>();
  timeSlots:any[] = [];
  bookingForm = this.fb.group({
    customerSearch: ['', Validators.required],
    bookingAddress: ['', Validators.required],
    bookingDate: ['', Validators.required],
    timeSlot: ['', Validators.required],
    category: ['', Validators.required],
    subCategory : ['', Validators.required],
    service : ['', Validators.required]
  });
  options: any[] = [];
  customerAddresses:any[] = [];
  selectedCustomerId:string = '';
  cartTotal : any = {
    subTotal: 0,
    discount: 0,
    tax: 0,
    total : 0
  };

  selectedCustomer:any;
  selectedCategory:any;
  selectedSubCategory:any;
  selectedServices:any;
  selectedAddress:any;
  selectedTimeSlot:any;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateBookingComponent>,
    private bookingService: BookingService,
    public _loaderService : LoaderService,
    private _createBookingService : CreateBookingService,
    private notificationService:NotificationService
  ) {
    this.timeSlots = data.timeSlots.filter((item:any) =>  item.active);
    this.minBookingDate = moment().format('YYYY-MM-DD');
  }

  address = new FormControl('');
  customer = new FormControl('');
  date = new FormControl(Date);

  categories:any[] = [];
  subCategories:any[] = [];
  services:any[] = [];
  variants:any[] = [];
  cartArray:any[] = [];
  taxes:any[] = [];
  discounts:any[] = [];
  applicableDiscounts:any[] = [];
  appliedCoupon : any;
  cartInitial:BookingUpdated = {
    id: '',
    subCategory: {
      id: '',
      name: '',
      image: ''
    },
    mainCategory: {
      id: '',
      name: '',
      image: '',
      icon: '',
    },
    services: [],
    billing: {
      grandTotal: 0,
      tax: 0,
      discount: 0,
      coupanDiscunt: undefined,
      subTotal: 0,
      totalJobTime: 0,
      totalJobAcceptanceCharge: 0
    },
    createdAt: Timestamp.fromDate(new Date()),
    jobOtp: '',
    currentUser: {
      userId: '',
      name: '',
      phoneNumber: ''
    }
  };

  cart:BookingUpdated = this.cartInitial;
  ngOnInit(): void {
    this.datePickerText = this.initialDatePickerValue;
    this.bookingForm?.get("customerSearch")?.valueChanges
    .subscribe((inputText: any) => {
      this.selectedCustomerId = '';
      this.bookingForm.get("bookingAddress")?.setValue("");
      this.customerAddresses = [];
      if(inputText){
        this.userSearchText$.next(inputText);
      }
    });

    this.bookingForm?.get("bookingDate")?.valueChanges
    .subscribe((inputText: any) => {
        this.datePickerText = inputText ? moment(inputText).format("DD-MMM-YYYY") : this.initialDatePickerValue;
    });

    this.userSearchList$ = this.userSearchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(async userInputValue => {
        return userInputValue.toUpperCase()
      }
        
    ));
    
    this.userSearchList$.subscribe(async (userValueInput) => {
      const result1 = this.bookingService
        .getUsersByText(userValueInput,'name');
        const result2 = this.bookingService
        .getUsersByText(userValueInput,'phoneNumber');
        const [titleSnap, titlesRSnap] = await Promise.all([
          result1,
          result2
        ]);
        const optionValues1 = titleSnap.docs.map((user:any) => {
          return { id: user.id, ...user.data() };
        });
        const optionValues2 = titlesRSnap.docs.map((user:any) => {
          return { id: user.id, ...user.data() };
        });
        let optionValues = [...optionValues1,...optionValues2];
        optionValues = optionValues.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.place === value.place && t.name === value.name
          ))
        )
        this.options = optionValues;
    });

    this.bookingService.userAdded.subscribe((subscriptionValue:boolean) => {
      if(subscriptionValue == true){
        this.bookingForm.get('customerSearch')?.setValue("");
      }
    });

    this.bookingService.addressAdded.subscribe((subscriptionValue:boolean) => {
      if(subscriptionValue == true){
        this.bookingService.getAddressByCustomerId(this.selectedCustomer.uid).then((addresses) => {
          this.customerAddresses = addresses.docs.map((address) => {
            return { ...address.data(), id: address.id };
          });
        });
      }
    });

    this.getCategories();

    this._createBookingService.cart$.subscribe((response) => {
      this.cart = response;
      const discountItems:any[] = [];
      this.cart?.services?.map((item) => {
        discountItems.push(item.discounts);
      });
      const discountList = [...discountItems.flat()];
      const filteredDiscounts = this.discounts.filter((s) => {
        const discountItems = discountList.filter((discount:string) => {
          return discount == s.id;
        });
        return discountItems.length;
      });
      this.applicableDiscounts = [...filteredDiscounts];
      this._createBookingService.applicableDiscounts = this.applicableDiscounts;
    });
  }

  ngOnDestroy(): void {
    this._createBookingService.cart$.next(this._createBookingService.cartInitial);
    this._createBookingService.cart = this._createBookingService.cartInitial;
  }

  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(CreateCustomerComponent, {
      data: {},
    });
  }

  openAddressDialog(): void {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data : {
        customer: this.selectedCustomer
      }
    });
  }

  onNoClick(refresh: boolean = false): void {
    this.dialogRef.close({event:'close',data:refresh});
  }

  onCustomerDropdownSelect(event:any){
    const inputValue =event.option.value.split(" | ");
    const customerName = inputValue[0];
    const customerPhone = inputValue[1];
    this.selectedCustomer = this.options.find((item) => {
      return item.name == customerName && item.phoneNumber == customerPhone;
    });
    this._createBookingService.currentCustomer = this.selectedCustomer;
    this.selectedCustomerId = this.selectedCustomer.uid;
    this.bookingService.getAddressByCustomerId(this.selectedCustomer.uid).then((addresses) => {
      this.customerAddresses = addresses.docs.map((address) => {
        return { ...address.data(), id: address.id };
      });
    });
  }

  getSelectedAddressValue(address:any){
    return address.phoneNumber ? `${address.name} | ${address.phoneNumber}` : address.name;
  }

  getCategories(){
    this.bookingService.getCategories().then((categories) => {
      this.categories = categories.docs.map((category) => {
        return { ...category.data(),id: category.id };
      });
    });
  }

  onCategoryChange(event:any){
    this.selectedCategory = event;
    this.bookingService.getSubCategories(event.id).then((categories) => {
      this.subCategories = categories.docs.map((subCategory) => {
        return { ...subCategory.data(),id: subCategory.id };
      });
    });
  }

  onSubCategoryChange(event:any){
    this.selectedSubCategory = event
    const categoryId = this.bookingForm.get("category")?.value ?? '';
    this.bookingService.getServices(categoryId,event.id).then((services) => {
      this.services = services.docs.map((service) => {
        return { ...service.data(),id: service.id };
      });
    });
  }

  onServiceChange(event:any){
    this.selectedServices = event;
    this.variants = this.selectedServices.variants;
    this.bookingService.getTaxes().then((taxes) => {
      this.taxes = taxes.docs.map((tax) => {
        return { ...tax.data(),id: tax.id };
      });
    });
    this.bookingService.getDiscounts().then((discounts) => {
      this.discounts = discounts.docs.map((discount) => {
        return { ...discount.data(),id: discount.id };
      });
    });
  }

  onAddressChange(event:any){
    this.selectedAddress = event;
  }

  onTimeSlotChange(event:any){
    this.selectedTimeSlot = event;
  }

  addToCart(variant:any){

    const taxesList = this.selectedServices.taxes;
    const filteredTaxes = this.taxes.filter((s) => {
      const taxesItems = taxesList.filter((tax:string) => {
        return tax == s.id;
      });
      return taxesItems.length;
    });
    this.selectedServices.taxes = filteredTaxes;
    this._createBookingService.addToCart(variant.id,this.selectedServices,this.selectedCategory,this.selectedSubCategory,filteredTaxes);
  }

  increaseCartQuantity(service : any, cartItem:any){
    this._createBookingService.incrementQuantity(service,cartItem);
  }

  decreaseCartQuantity(service : any, cartItem:any){
    this._createBookingService.decrementQuantity(service,cartItem);
  }

  deleteCartItem(service : any, cartItem:any){
    this._createBookingService.removeFromCart(service,cartItem)
  }

  handleSubmit(){
    if(!(this.cart?.services?.length > 0)){
      this.notificationService.presentErrorToast('Please add a service to proceed')
    }
    else if(!this.bookingForm.valid){
      this.notificationService.presentErrorToast('Please add all required fields.')
    }
    else{
      this._loaderService.showLoader();
      this.cart.address = this.selectedAddress;
      const startTime = this.selectedTimeSlot.start;
      const endTime = this.selectedTimeSlot.end;
      this.cart.currentUser =  { ...this.selectedCustomer, userId: this.selectedCustomer.id };
      this.cart.timeSlot = {
        date: Timestamp.fromDate(new Date(this.bookingForm.get("bookingDate")?.value ?? '')),
        time: {
          startTime : Timestamp.fromDate(new Date(this.bookingForm.get("bookingDate")?.value+" "+moment(startTime.toString(),'HH:mm:ss').format("HH:mm:ss"))),
          endTime : Timestamp.fromDate(new Date(this.bookingForm.get("bookingDate")?.value+" "+moment(endTime.toString(),'HH:mm:ss').format("HH:mm:ss"))),
        },
        id : this.selectedTimeSlot.id
      }
      this.bookingService.addBooking(this.cart,this.selectedCustomerId,).then((response) => {
        this.onNoClick(true);
        this.notificationService.presentSuccessToast(
          'Booking Created successfully'
        );
        this._loaderService.hideLoader();
      });
    }
  }

  onApplyCoupon(discount:any){
    this.appliedCoupon = discount;
    this.cart.appliedCoupon = discount;
    
    this._createBookingService.calculateBilling(this.cart);
  }

  onRemoveCoupon(discount:any){
    delete this.cart["appliedCoupon"];
    this._createBookingService.calculateBilling(this.cart);
  }

  getIsAppliedCoupon(discount:any){
    return this.cart.appliedCoupon?.id == discount.id;
  }
}
