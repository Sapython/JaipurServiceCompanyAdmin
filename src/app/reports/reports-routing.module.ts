import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { DaySummaryComponent } from './day-summary/day-summary.component';
import { DayWiseReportComponent } from './day-wise-report/day-wise-report.component';

const routes: Routes = [{ path: '', component: ReportsComponent},{path:'day-wise-report',component:DayWiseReportComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
