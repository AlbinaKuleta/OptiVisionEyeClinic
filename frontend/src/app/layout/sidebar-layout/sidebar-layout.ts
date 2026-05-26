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
  role = localStorage.getItem('role') || '';

  allMenuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'assets/icons/home.svg', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { label: 'Patients', route: '/patients', icon: 'assets/icons/users.svg', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { label: 'Appointments', route: '/appointments', icon: 'assets/icons/calendar.svg', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { label: 'Eye Exams', route: '/eye-exams', icon: 'assets/icons/eye.svg', roles: ['Admin', 'Doctor'] },
    { label: 'Prescriptions', route: '/prescriptions', icon: 'assets/icons/document-text.svg', roles: ['Admin', 'Doctor'] },
    { label: 'Doctors', route: '/doctors', icon: 'assets/icons/user-group.svg', roles: ['Admin'] },
    { label: 'Billing', route: '/billing', icon: 'assets/icons/credit-card.svg', roles: ['Admin', 'Receptionist'] },
    { label: 'Users', route: '/users', icon: 'assets/icons/users.svg', roles: ['Admin'] },
    { label: 'Profile', route: '/profile', icon: 'assets/icons/user.svg', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { label: 'Settings', route: '/settings', icon: 'assets/icons/cog.svg', roles: ['Admin'] }
  ];

  menuItems = this.allMenuItems.filter(item => item.roles.includes(this.role));

  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}