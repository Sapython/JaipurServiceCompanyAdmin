import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayWiseReportComponent } from './day-wise-report.component';

describe('DayWiseReportComponent', () => {
  let component: DayWiseReportComponent;
  let fixture: ComponentFixture<DayWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayWiseReportComponent]
    });
    fixture = TestBed.createComponent(DayWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
