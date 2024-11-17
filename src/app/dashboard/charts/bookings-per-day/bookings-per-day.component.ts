import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bookings-per-day',
  templateUrl: './bookings-per-day.component.html',
  styleUrls: ['./bookings-per-day.component.scss']
})
export class BookingsPerDayComponent{

  ngOnInit(){
    new Chart("bookingsPerDay", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132,50)',
            fill:true,
            tension:0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}
