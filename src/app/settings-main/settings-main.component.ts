import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss'],
})
export class SettingsMainComponent {
  tabStatus: any = {
    users: true,
    admin: false,
    customer: false,
    agent: false,
  };

  changeTab(id: string) {
    Object.keys(this.tabStatus).forEach((key) => {
      this.tabStatus[key] = false;
    });
    this.tabStatus[id] = true;
  }
}
