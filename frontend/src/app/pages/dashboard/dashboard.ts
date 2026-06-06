import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientService } from '../../services/patient';
import { DoctorService } from '../../services/doctor';
import { AppointmentService } from '../../services/appointment';
import { UserService } from '../../services/user';

import { Patient } from '../../models/patient';
import { Doctor } from '../../models/doctor';
import { Appointment } from '../../models/appointment';
import { AppUser } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  fullName = localStorage.getItem('fullName') || 'User';
  email = localStorage.getItem('email') || '';
  role = localStorage.getItem('role') || '';

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  users: AppUser[] = [];

  error = '';

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.patientService.getPatients().subscribe({
      next: data => this.patients = data,
      error: () => this.error = 'Failed to load patients.'
    });

    this.appointmentService.getAppointments().subscribe({
      next: data => this.appointments = data,
      error: () => this.error = 'Failed to load appointments.'
    });

    if (this.role === 'Admin') {
      this.doctorService.getDoctors().subscribe({
        next: data => this.doctors = data
      });

      this.userService.getUsers().subscribe({
        next: data => this.users = data
      });
    }
  }

  get todayAppointments(): Appointment[] {
    const today = new Date().toDateString();

    return this.appointments.filter(appointment =>
      new Date(appointment.appointmentDate).toDateString() === today
    );
  }

  get scheduledAppointments(): Appointment[] {
    return this.appointments.filter(a => a.status === 'Scheduled');
  }

  get completedAppointments(): Appointment[] {
    return this.appointments.filter(a => a.status === 'Completed');
  }

  get cancelledAppointments(): Appointment[] {
    return this.appointments.filter(a => a.status === 'Cancelled');
  }

  get recentAppointments(): Appointment[] {
    return [...this.appointments]
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime()
      )
      .slice(0, 5);
  }

  get welcomeSubtitle(): string {
    if (this.role === 'Admin') {
      return 'Full clinic overview and system management.';
    }

    if (this.role === 'Doctor') {
      return 'Your patients, appointments, exams and prescriptions.';
    }

    if (this.role === 'Receptionist') {
      return 'Manage patient flow, appointments and billing.';
    }

    return 'Welcome to OptiVision Eye Clinic.';
  }
}