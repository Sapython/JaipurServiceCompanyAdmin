import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { DaySummaryComponent } from './day-summary/day-summary.component';
import { ServiceWiseReportComponent } from './service-wise-report/service-wise-report.component';
import { CustomerWiseReportComponent } from './customer-wise-report/customer-wise-report.component';
import { AgentWiseReportComponent } from './agent-wise-report/agent-wise-report.component';
import { DayWiseReportComponent } from './day-wise-report/day-wise-report.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportsComponent,
    DaySummaryComponent,
    ServiceWiseReportComponent,
    CustomerWiseReportComponent,
    AgentWiseReportComponent,
    DayWiseReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
