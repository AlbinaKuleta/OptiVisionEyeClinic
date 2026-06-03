import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';
import { PatientService } from '../../services/patient';
import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';

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

  appointmentForm: FormGroup;
  editForm: FormGroup;

  appointmentToEdit: Appointment | null = null;
  appointmentToDelete: Appointment | null = null;
  appointmentDetails: Appointment | null = null;

  loading = false;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {
    this.appointmentForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', Validators.required],
      doctorName: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['Scheduled', Validators.required],
      notes: ['']
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => this.error = 'Failed to load appointments.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.error = 'Failed to load patients.'
    });
  }

  createAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
      next: () => {
        this.success = 'Appointment created successfully.';
        this.error = '';
        this.loading = false;
        this.appointmentForm.reset({ status: 'Scheduled' });
        this.loadAppointments();
      },
      error: () => {
        this.error = 'Failed to create appointment.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(appointment: Appointment): void {
    this.appointmentToEdit = appointment;

    this.editForm.patchValue({
      patientId: appointment.patientId,
      doctorName: appointment.doctorName,
      appointmentDate: appointment.appointmentDate?.substring(0, 16),
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes
    });
  }

  closeEditModal(): void {
    this.appointmentToEdit = null;
    this.editForm.reset({ status: 'Scheduled' });
  }

  updateAppointment(): void {
    if (!this.appointmentToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.appointmentService.updateAppointment(this.appointmentToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Appointment updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadAppointments();
      },
      error: () => this.error = 'Failed to update appointment.'
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
        this.closeDeleteModal();
        this.loadAppointments();
      },
      error: () => this.error = 'Failed to delete appointment.'
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
}