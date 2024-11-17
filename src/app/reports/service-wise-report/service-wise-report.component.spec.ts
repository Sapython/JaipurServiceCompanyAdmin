import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceWiseReportComponent } from './service-wise-report.component';

describe('ServiceWiseReportComponent', () => {
  let component: ServiceWiseReportComponent;
  let fixture: ComponentFixture<ServiceWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceWiseReportComponent]
    });
    fixture = TestBed.createComponent(ServiceWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
