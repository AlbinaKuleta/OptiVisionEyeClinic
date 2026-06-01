import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

import { LoginComponent } from './pages/login/login';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { PatientsComponent } from './pages/patients/patients';
import { AppointmentsComponent } from './pages/appointments/appointments';
import { EyeExamsComponent } from './pages/eye-exams/eye-exams';
import { PrescriptionsComponent } from './pages/prescriptions/prescriptions';
import { DoctorsComponent } from './pages/doctors/doctors';
import { BillingComponent } from './pages/billing/billing';
import { ProfileComponent } from './pages/profile/profile';
import { SettingsComponent } from './pages/settings/settings';
import { UsersComponent } from './pages/users/users';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Receptionist'])]
      },
      {
        path: 'patients',
        component: PatientsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Receptionist'])]
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Receptionist'])]
      },
      {
        path: 'eye-exams',
        component: EyeExamsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor'])]
      },
      {
        path: 'prescriptions',
        component: PrescriptionsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor'])]
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'billing',
        component: BillingComponent,
        canActivate: [roleGuard(['Admin', 'Receptionist'])]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Receptionist'])]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];