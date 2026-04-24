import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-layout.html',
  styleUrls: ['./sidebar-layout.css']
})
export class SidebarLayoutComponent {
  fullName = localStorage.getItem('fullName') || 'User';

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'assets/icons/home.svg' },
    { label: 'Patients', route: '/patients', icon: 'assets/icons/users.svg' },
    { label: 'Appointments', route: '/appointments', icon: 'assets/icons/calendar.svg' },
    { label: 'Eye Exams', route: '/eye-exams', icon: 'assets/icons/eye.svg' },
    { label: 'Prescriptions', route: '/prescriptions', icon: 'assets/icons/document-text.svg' },
    { label: 'Doctors', route: '/doctors', icon: 'assets/icons/user-group.svg' },
    { label: 'Billing', route: '/billing', icon: 'assets/icons/credit-card.svg' },
    { label: 'Profile', route: '/profile', icon: 'assets/icons/users.svg' },
    { label: 'Settings', route: '/settings', icon: 'assets/icons/cog.svg' }
  ];

  logoutIcon = 'assets/icons/arrow-right-on-rectangle.svg';

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    this.router.navigate(['/login']);
  }
}