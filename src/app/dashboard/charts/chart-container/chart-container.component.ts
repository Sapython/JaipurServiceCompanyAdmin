import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent {
  @Input() center: boolean = false;
  @Input() title: string = '';
}
