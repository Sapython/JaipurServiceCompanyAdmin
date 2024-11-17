import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaWiseCatalogueService } from '../../area-wise-catalogue.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { NotificationService } from 'src/app/Shared/core/notification.service';
import Utils from 'src/app/Shared/shared-services/util';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss']
})
export class AddAreaComponent implements OnInit {
  areaAddForm: FormGroup = this.formBuilder.group({
    searchInput: ['', [Validators.required]],
    active: [true],
    category: ['', [Validators.required]],
  });
  areaSearchList$!: Observable<any>;
  private areaSearchText$ = new Subject<string>();
  searchedAreaDetails: any;

  areaOptions: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private areaWiseCatalogueService: AreaWiseCatalogueService,
    private dialog: Dialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
  ){
    
  }

  ngOnInit():void {
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

  addAreaInCity(){
    this.searchedAreaDetails['active'] = this.areaAddForm.get("active")?.value;
    this.searchedAreaDetails['serviceCatalogue'] = this.areaAddForm.get("category")?.value;
    this.areaWiseCatalogueService.addAreaInCity(this.data.selectedArea.stateId,this.data.selectedArea.cityId,this.searchedAreaDetails).then((response:any) => {
      this.notificationService.presentSuccessToast(
        'Area added successfully'
      );
      this.closeDialog();
    });
  }

  onAreaDropdownSelect(event:any){
    const placeId = event.place_id;
    this.areaWiseCatalogueService.getAreaDetailByPlaceId(placeId).subscribe((response:any) => {
      this.searchedAreaDetails = response.result;
      this.searchedAreaDetails = Utils.createDataForAddAreas(this.searchedAreaDetails)
      console.log(this.searchedAreaDetails);
    });
  }

  getAreaOnSearch(areaSearchInput:any){
    areaSearchInput &&  this.areaSearchText$.next(areaSearchInput.target.value); 
  }

  closeDialog(){
    this.dialog.closeAll();
  }

}
