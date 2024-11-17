import { Component, OnInit } from '@angular/core';
import { BookingService } from '../core/booking.service';
import { Booking } from '../core/booking.structure';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private bookingService:BookingService){}
  bookingPerformance: any[] = [];
  mostRecentBookings: any[] = [];
  sales: any[] = [];
  orders: any[] = [];
  colorsArray = [
    '#35A1EB',
    '#FE6484',
    '#4CC0C0',
    '#FF9E40',
    '#9A66FF',
    '#FFCD56',
    '#C9CBCE'
  ]
  ngOnInit(): void {
    this.bookingService.getBookings().then((bookingsDocs) => {
      // console.log(bookings);
      let bookings:Booking[] = bookingsDocs.docs.map((booking) => {return {id:booking.id,...booking.data()} as Booking});
      console.log(bookings);
      // [
      //   { month: 'Jan', sales: 20 },
      //   { month: 'Feb', sales: 15 },
      //   { month: 'Mar', sales: 12 },
      //   { month: 'Apr', sales: 16 },
      //   { month: 'May', sales: 6 },
      //   { month: 'Jun', sales: 13 },
      //   { month: 'Jul', sales: 14 },
      //   { month: 'Aug', sales: 17 },
      //   { month: 'Sep', sales: 7 },
      //   { month: 'Oct', sales: 9 },
      //   { month: 'Nov', sales: 20 },
      //   { month: 'Dec', sales: 13 },
      // ]
      // generate this kind of data
      let bookingsByMonth:{[key:string]:number} = {};
      bookings.forEach((booking) => {
        let date = new Date(booking.createdAt.toDate());
        let month = date.toLocaleString('default',{month:'short'});
        if(bookingsByMonth[month]){
          bookingsByMonth[month] += 1;
        }else{
          bookingsByMonth[month] = 1;
        }
      });
      console.log("bookingsByMonth",bookingsByMonth);
      this.sales = Object.keys(bookingsByMonth).map((month) => {
        return {month:month,sales:bookingsByMonth[month]}
      });
      console.log("Sales",this.sales);
      // [
      //   { service: 'Appliance Repair', value: 100, color: '#0074C1' },
      //   { service: 'Bathroom Cleaning', value: 100, color: '#056230' },
      //   { service: 'Kitchen Cleaning', value: 100, color: '#07777B' },
      //   { service: 'Full Home Cleaning', value: 100, color: '#471337' },
      //   { service: 'Sofa carpet Cleaning', value: 100, color: '#004564' },
      //   { service: 'Women Spa & Salon', value: 100, color: '#444444' },
      //   { service: 'Car Cleaning', value: 100, color: '#FAE8FF' },
      //   { service: 'Water Tank Cleaning', value: 100, color: '#C263A5' },
      // ]
      // generate this kind of data
      let bookingsByService:{[key:string]:number} = {};
      bookings.forEach((booking) => {
        if(bookingsByService[booking.mainCategory.name]){
          bookingsByService[booking.mainCategory.name] += 1;
        }else{
          bookingsByService[booking.mainCategory.name] = 1;
        }
      });
      this.orders = Object.keys(bookingsByService).map((service,index) => {
        return {service:service,value:bookingsByService[service],color:this.colorsArray[index % this.colorsArray.length]}
      });
      console.log("ORders data",this.orders);
      
      //  [
      //   { service: 'Booking Left', value: 36, color: '#0074C1' },
      //   { service: 'Booking Complete', value: 64, color: '#056230' },
      // ];
      // get how many bookings are completed and how many are not
      let bookingsLeft = 0;
      let bookingsComplete = 0;
      bookings.forEach((booking) => {
        if(booking.stage == 'completed'){
          bookingsComplete += 1;
        }else{
          bookingsLeft += 1;
        }
      });
      this.bookingPerformance = [
        { service: 'Booking Left', value: bookingsLeft, color: '#0074C1' },
        { service: 'Booking Complete', value: bookingsComplete, color: '#056230' },
      ];

      // sort the bookings by createdDate

      let sortedBookings = bookings.sort((a,b) => {
        return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
      });
      this.mostRecentBookings = sortedBookings.slice(0,4).map((data)=>{
        return {
          id: data.id.substring(0,6),
          name: data.currentUser.name,
          address: data.address?.addressLine1+', '+data.address?.addressLine2+', '+data.address?.pinCode,
          service: data.mainCategory.name
        }
      });
    })
  }
}
