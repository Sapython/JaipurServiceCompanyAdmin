import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseReportComponent } from './customer-wise-report.component';

describe('CustomerWiseReportComponent', () => {
  let component: CustomerWiseReportComponent;
  let fixture: ComponentFixture<CustomerWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerWiseReportComponent]
    });
    fixture = TestBed.createComponent(CustomerWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
