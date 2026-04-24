import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { PatientsComponent } from './pages/patients/patients';
import { AppointmentsComponent } from './pages/appointments/appointments';
import { EyeExamsComponent } from './pages/eye-exams/eye-exams';
import { PrescriptionsComponent } from './pages/prescriptions/prescriptions';
import { DoctorsComponent } from './pages/doctors/doctors';
import { BillingComponent } from './pages/billing/billing';
import { ProfileComponent } from './pages/profile/profile';
import { SettingsComponent } from './pages/settings/settings';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: SidebarLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'eye-exams', component: EyeExamsComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];