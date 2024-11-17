import { Component } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-service-wise-bookings',
  templateUrl: './service-wise-bookings.component.html',
  styleUrls: ['./service-wise-bookings.component.scss']
})
export class ServiceWiseBookingsComponent {
  ngOnInit(){
    new Chart("serviceWiseBookings", {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['Service1', 'Service2', 'Service3','Service4',
								 'Service5', 'Service6', 'Service7','Service8', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
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
