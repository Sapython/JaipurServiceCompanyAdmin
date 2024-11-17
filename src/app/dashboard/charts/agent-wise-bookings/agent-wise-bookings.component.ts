import { Component } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-agent-wise-bookings',
  templateUrl: './agent-wise-bookings.component.html',
  styleUrls: ['./agent-wise-bookings.component.scss']
})
export class AgentWiseBookingsComponent {
  ngOnInit(){
    new Chart("agentWiseBookings", {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: '#3a86ff',
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
