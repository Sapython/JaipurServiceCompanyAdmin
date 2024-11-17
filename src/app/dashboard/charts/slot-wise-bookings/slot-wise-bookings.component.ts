import { Component } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-slot-wise-bookings',
  templateUrl: './slot-wise-bookings.component.html',
  styleUrls: ['./slot-wise-bookings.component.scss']
})
export class SlotWiseBookingsComponent {
  ngOnInit(){
    new Chart("slotWiseBookings", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['12','1', '13', '54', '6',
								 '3', '43', '5'],
            borderColor: '#ffbe0b',
          },
          {
            label: "Sales",
            data: ['1','2', '2', '2', '4',
								 '12', '5', '14'],
            borderColor: '#fb5607',
          },
          {
            label: "Sales",
            data: ['12','34', '54', '2', '9',
								 '8', '17', '14'],
            borderColor: '#ff006e',
          },
          {
            label: "Sales",
            data: ['12','11', '9', '19', '23',
								 '12', '34', '57'],
            borderColor: '#8338ec',
          },
          {
            label: "Sales",
            data: ['47','57', '52', '7', '2',
								 '54', '53', '76'],
            borderColor: '#3a86ff',
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
