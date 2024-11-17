import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentWiseReportComponent } from './agent-wise-report.component';

describe('AgentWiseReportComponent', () => {
  let component: AgentWiseReportComponent;
  let fixture: ComponentFixture<AgentWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentWiseReportComponent]
    });
    fixture = TestBed.createComponent(AgentWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
