import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { NotificationService } from 'src/app/Shared/core/notification.service';
import { LoaderService } from 'src/app/Shared/shared-services/loader.service';
import Utils from 'src/app/Shared/shared-services/util';
import { AreaWiseCatalogueService } from 'src/app/area-wise-catalogue/area-wise-catalogue.service';
import { BookingService } from 'src/app/core/booking.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {
  areaSearchList$!: Observable<any>;
  private areaSearchText$ = new Subject<string>();
  areaOptions: any[] = [];
  searchedAreaDetails: any;
  constructor(
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _bookingService: BookingService,
    public _loaderService : LoaderService,
    private notificationService:NotificationService,
    private fb : FormBuilder,
    private areaWiseCatalogueService: AreaWiseCatalogueService,
    ) {}

  ngOnInit(): void {
    this.areaSearchList$ = this.areaSearchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(areaInputValue => 
      this.areaWiseCatalogueService.getAreaOnSearch(areaInputValue)
    ));
    
    this.areaSearchList$.subscribe((response) => {
      this.areaOptions = response.results;
    });
  }

  
  addAddressForm = this.fb.group({
    name: ['', Validators.required],
    address1: ['', Validators.required],
    area: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required]
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleSubmit(){
   const addressObject ={
    ...this.addAddressForm.value,
    ...this.searchedAreaDetails
   }
   this._bookingService.addAddress(this.data?.customer.id,addressObject).then(() => {
    this._loaderService.hideLoader();
    this._bookingService.addressAdded.next(true);
    this.notificationService.presentSuccessToast(
      'Address added successfully'
    );
   });
   this.onNoClick();
  }

  onAreaDropdownSelect(event:any){
    const placeId = event.option.value.split("|")[1];
    this.areaWiseCatalogueService.getAreaDetailByPlaceId(placeId).subscribe((response:any) => {
      this.searchedAreaDetails = response.result;
      this.searchedAreaDetails = Utils.createDataForAddAreas(this.searchedAreaDetails)
    });
  }

  getAreaOnSearch(areaSearchInput:any){
    areaSearchInput &&  this.areaSearchText$.next(areaSearchInput.target.value); 
  }

}
