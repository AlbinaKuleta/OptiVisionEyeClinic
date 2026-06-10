import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppointmentService } from '../../services/appointment';
import { PatientService } from '../../services/patient';
import { DoctorService } from '../../services/doctor';

import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  doctors: Doctor[] = [];

  appointmentForm: FormGroup;
  editForm: FormGroup;

  role = localStorage.getItem('role') || '';

  loading = false;
  success = '';
  error = '';

  appointmentToEdit: Appointment | null = null;
  appointmentToDelete: Appointment | null = null;
  appointmentDetails: Appointment | null = null;

  statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {
    this.appointmentForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();

    if (this.role !== 'Doctor') {
      this.loadDoctors();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: [null, Validators.required],
      doctorId: [null],
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['Scheduled', Validators.required],
      notes: ['']
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: () => {
        this.error = 'Failed to load appointments.';
      }
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: () => {
        this.error = 'Failed to load patients.';
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: () => {
        this.error = 'Failed to load doctors.';
      }
    });
  }

  createAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    if (this.role !== 'Doctor' && !this.appointmentForm.value.doctorId) {
      this.error = 'Please select a doctor.';
      return;
    }

    this.loading = true;

    const formValue = this.appointmentForm.value;

    const payload = {
      patientId: Number(formValue.patientId),
      doctorId: this.role === 'Doctor' ? null : Number(formValue.doctorId),
      appointmentDate: formValue.appointmentDate,
      reason: formValue.reason,
      status: formValue.status,
      notes: formValue.notes || ''
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        this.success = 'Appointment created successfully.';
        this.error = '';
        this.loading = false;
        this.appointmentForm.reset({
          patientId: null,
          doctorId: null,
          status: 'Scheduled'
        });
        this.loadAppointments();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create appointment.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  getAppointmentCountText(): string {
  return this.appointments.length === 1
    ? '1 appointment'
    : `${this.appointments.length} appointments`;
}

  openEditModal(appointment: Appointment): void {
    this.appointmentToEdit = appointment;

    this.editForm.patchValue({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDate: appointment.appointmentDate?.substring(0, 16),
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes
    });
  }

  closeEditModal(): void {
    this.appointmentToEdit = null;
    this.editForm.reset({
      patientId: null,
      doctorId: null,
      status: 'Scheduled'
    });
  }

  updateAppointment(): void {
    if (!this.appointmentToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (this.role !== 'Doctor' && !this.editForm.value.doctorId) {
      this.error = 'Please select a doctor.';
      return;
    }

    const formValue = this.editForm.value;

    const payload = {
      patientId: Number(formValue.patientId),
      doctorId: this.role === 'Doctor' ? null : Number(formValue.doctorId),
      appointmentDate: formValue.appointmentDate,
      reason: formValue.reason,
      status: formValue.status,
      notes: formValue.notes || ''
    };

    this.appointmentService.updateAppointment(this.appointmentToEdit.id, payload).subscribe({
      next: () => {
        this.success = 'Appointment updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadAppointments();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update appointment.';
      }
    });
  }

  openDeleteModal(appointment: Appointment): void {
    this.appointmentToDelete = appointment;
  }

  closeDeleteModal(): void {
    this.appointmentToDelete = null;
  }

  confirmDelete(): void {
    if (!this.appointmentToDelete) return;

    this.appointmentService.deleteAppointment(this.appointmentToDelete.id).subscribe({
      next: () => {
        this.success = 'Appointment deleted successfully.';
        this.error = '';
        this.closeDeleteModal();
        this.loadAppointments();
      },
      error: () => {
        this.error = 'Failed to delete appointment.';
      }
    });
  }

  viewDetails(appointment: Appointment): void {
    this.appointmentDetails = appointment;
  }

  closeDetailsModal(): void {
    this.appointmentDetails = null;
  }

  truncateText(text: string | null | undefined, maxLength: number = 40): string {
    if (!text) {
      return '-';
    }

    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  canDeleteAppointment(): boolean {
    return this.role === 'Admin';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'scheduled';
    }
  }
}