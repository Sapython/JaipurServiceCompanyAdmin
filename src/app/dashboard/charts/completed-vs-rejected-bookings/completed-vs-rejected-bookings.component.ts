import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-completed-vs-rejected-bookings',
  templateUrl: './completed-vs-rejected-bookings.component.html',
  styleUrls: ['./completed-vs-rejected-bookings.component.scss']
})
export class CompletedVsRejectedBookingsComponent {
  ngOnInit(){
    new Chart("completedVsRejectedBookings", {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['13','76', '72', '9', '9',
								 '54', '73', '56'],
            backgroundColor:'#ff006e'
          },
          {
            label: "Sales",
            data: ['47','56', '52', '7', '2',
								 '57', '53', '57'],
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
