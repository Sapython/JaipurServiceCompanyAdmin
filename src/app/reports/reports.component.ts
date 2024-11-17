import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reports:Report[]=[
    // {
    //   name:'Day Summary',
    //   description:'A summary view of all variables',
    //   icon:'today',
    //   route:'day-summary'
    // },
    // {
    //   name:'Service Wise Report',
    //   description:'See your sales according to the services',
    //   icon:'today',
    //   route:'service-wise-report'
    // },
    // {
    //   name:'Customer Wise Report',
    //   description:'See your sales according to customers',
    //   icon:'today',
    //   route:'customer-wise-report'
    // },
    // {
    //   name:'Agent Wise Report',
    //   description:'See your sales according to agents',
    //   icon:'today',
    //   route:'agent-wise-report'
    // },
    {
      name:'Day Wise Report',
      description:'See your sales according to days',
      icon:'today',
      route:'day-wise-report'
    }
  ];
}
export interface Report{
  name:string;
  description:string;
  icon:string; // material icon name
  route:string;
}