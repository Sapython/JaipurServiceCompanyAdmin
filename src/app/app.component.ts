import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { DataProviderService } from './core/data-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'JaipurServiceCompanyAdmin';
  constructor(
    private router: Router,
    public auth: AuthService,
    public dataProvider: DataProviderService
  ) {}
  labels = [
    {
      icon: 'dashboard',
      name: 'Dashboard',
      link: '/dashboard',
      active: false,
    },
    {
      icon: 'date_range',
      name: 'Bookings',
      link: '/bookings',
      active: true,
    },
    {
      icon: 'person_outline',
      name: 'Customers',
      link: '/customers',
      active: false,
    },
    {
      icon: 'person_outline',
      name: 'Agent',
      link: '/agents',
      active: false,
    },
    {
      icon: 'build',
      name: 'Service',
      link: '/service',
      active: true,
    },
    {
      icon: 'assignment',
      name: 'Reports',
      link: '/reports',
      active: false,
    },
    {
      icon: 'settings',
      name: 'Settings',
      link: '/settings',
      active: false,
    },
  ];

  isSidebarVisible() {
    // Hide the sidebar when the route is 'login'
    return (
      this.router.url !== '/login' &&
      this.router.url !== '/forgot-password' &&
      this.router.url !== '/change-password' &&
      this.router.url !== '/not-admin' &&
      this.router.url !== '/privacy-policy' &&
      this.router.url !== '/terms-and-conditions'
    );
  }
}
