import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BookingService } from 'src/app/core/booking.service';
import { Booking } from 'src/app/core/booking.structure';

@Component({
  selector: 'app-day-wise-report',
  templateUrl: './day-wise-report.component.html',
  styleUrls: ['./day-wise-report.component.scss']
})
export class DayWiseReportComponent {
  range:FormGroup = new FormGroup({
    start:new FormControl(new Date(),[Validators.required]),
    end:new FormControl(new Date(),[Validators.required]),
  });
  allBookings:Booking[] = [];
  constructor(private bookingService:BookingService){
    this.range.valueChanges.subscribe(async (value)=>{
      console.log(value);
      if (value.start && value.end){
        this.allBookings = (await this.bookingService.getBookingsByDate(value.start,value.end)).docs.map((booking)=>{
          return {
            id:booking.id,
            ...booking.data()
          } as Booking
        });
      }
    });
  }

  downloadExcel() {
    let separator = ',';
    // Select rows from table_id
    var rows = document.querySelectorAll('table#reportTable tr');
    // Construct csv
    let baseData:any[] = [];
    var csv = [baseData.join(separator)];
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols: any = rows[i].querySelectorAll('td, th');
      for (var j = 0; j < cols.length; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/(\s\s)/gm, ' ');
        // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
        data = data.replace(/"/g, '""');
        // Push escaped string
        row.push('"' + data + '"');
      }
      csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // csv_string.replace('₹',' ')
    csv_string = csv_string.replace(/₹/g, ' ');
    // Download it
    var filename =
      'bill-wise' + new Date().toLocaleString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string),
    );
    console.log("csv_string",csv_string);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
