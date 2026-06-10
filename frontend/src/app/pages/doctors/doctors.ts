import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DoctorService } from '../../services/doctor';
import { UserService } from '../../services/user';

import { Doctor } from '../../models/doctor';
import { AppUser } from '../../models/user';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorUsers: AppUser[] = [];

  doctorForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  doctorToEdit: Doctor | null = null;
  doctorToDelete: Doctor | null = null;
  doctorDetails: Doctor | null = null;

  weekDays = [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' }
  ];

  selectedDays: string[] = [];
  editSelectedDays: string[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private userService: UserService
  ) {
    this.doctorForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadDoctorUsers();
  }

  createForm(): FormGroup {
    return this.fb.group({
      applicationUserId: ['', Validators.required],
      specialization: ['', Validators.required],
      phoneNumber: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      notes: ['']
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

  loadDoctorUsers(): void {
    this.userService.getDoctorUsers().subscribe({
      next: (data) => {
        this.doctorUsers = data;
      },
      error: () => {
        this.error = 'Failed to load doctor users.';
      }
    });
  }

  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    } else {
      this.selectedDays.push(day);
    }
  }

  toggleEditDay(day: string): void {
    if (this.editSelectedDays.includes(day)) {
      this.editSelectedDays = this.editSelectedDays.filter(d => d !== day);
    } else {
      this.editSelectedDays.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  isEditDaySelected(day: string): boolean {
    return this.editSelectedDays.includes(day);
  }

  buildAvailability(days: string[], startTime: string, endTime: string): string {
    if (days.length === 0 || !startTime || !endTime) {
      return '';
    }

    return `${days.join(', ')} | ${startTime} - ${endTime}`;
  }

  parseAvailability(availability: string): {
    days: string[];
    startTime: string;
    endTime: string;
  } {
    if (!availability) {
      return {
        days: [],
        startTime: '',
        endTime: ''
      };
    }

    const parts = availability.split('|');

    const days = parts[0]
      ? parts[0]
          .split(',')
          .map(day => day.trim())
          .filter(day => day)
      : [];

    const timePart = parts[1] ? parts[1].trim() : '';
    const times = timePart.split('-').map(time => time.trim());

    return {
      days,
      startTime: times[0] || '',
      endTime: times[1] || ''
    };
  }

  createDoctor(): void {
    if (this.doctorForm.invalid || this.selectedDays.length === 0) {
      this.doctorForm.markAllAsTouched();
      this.error = 'Please select doctor user, specialization, available days, start time and end time.';
      return;
    }

    this.loading = true;

    const formValue = this.doctorForm.value;

    const payload = {
      applicationUserId: formValue.applicationUserId,
      specialization: formValue.specialization,
      phoneNumber: formValue.phoneNumber,
      availability: this.buildAvailability(
        this.selectedDays,
        formValue.startTime,
        formValue.endTime
      ),
      notes: formValue.notes
    };

    this.doctorService.createDoctor(payload).subscribe({
      next: () => {
        this.success = 'Doctor profile created successfully.';
        this.error = '';
        this.loading = false;
        this.selectedDays = [];
        this.doctorForm.reset();
        this.loadDoctors();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add doctor.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  viewDetails(doctor: Doctor): void {
    this.doctorDetails = doctor;
  }

  closeDetailsModal(): void {
    this.doctorDetails = null;
  }

  openEditModal(doctor: Doctor): void {
    this.doctorToEdit = doctor;

    const parsedAvailability = this.parseAvailability(doctor.availability);

    this.editSelectedDays = parsedAvailability.days;

    this.editForm.patchValue({
      applicationUserId: doctor.applicationUserId,
      specialization: doctor.specialization,
      phoneNumber: doctor.phoneNumber,
      startTime: parsedAvailability.startTime,
      endTime: parsedAvailability.endTime,
      notes: doctor.notes
    });
  }

  closeEditModal(): void {
    this.doctorToEdit = null;
    this.editSelectedDays = [];
    this.editForm.reset();
  }

  updateDoctor(): void {
    if (!this.doctorToEdit) {
      return;
    }

    if (this.editForm.invalid || this.editSelectedDays.length === 0) {
      this.editForm.markAllAsTouched();
      this.error = 'Please select available days, start time and end time.';
      return;
    }

    const formValue = this.editForm.value;

    const payload = {
      applicationUserId: formValue.applicationUserId,
      specialization: formValue.specialization,
      phoneNumber: formValue.phoneNumber,
      availability: this.buildAvailability(
        this.editSelectedDays,
        formValue.startTime,
        formValue.endTime
      ),
      notes: formValue.notes
    };

    this.doctorService.updateDoctor(this.doctorToEdit.id, payload).subscribe({
      next: () => {
        this.success = 'Doctor profile updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadDoctors();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update doctor.';
      }
    });
  }

  getDoctorCountText(): string {
  return this.doctors.length === 1
    ? '1 doctor'
    : `${this.doctors.length} doctors`;
}

  getAvailabilityDays(availability: string): string[] {
  if (!availability) {
    return [];
  }

  const parts = availability.split('|');

  return parts[0]
    ? parts[0].split(',').map(day => day.trim()).filter(day => day)
    : [];
}

getAvailabilityTime(availability: string): string {
  if (!availability) {
    return '-';
  }

  const parts = availability.split('|');

  return parts[1] ? parts[1].trim() : '-';
}
  openDeleteModal(doctor: Doctor): void {
    this.doctorToDelete = doctor;
  }

  closeDeleteModal(): void {
    this.doctorToDelete = null;
  }

  confirmDelete(): void {
    if (!this.doctorToDelete) {
      return;
    }

    this.doctorService.deleteDoctor(this.doctorToDelete.id).subscribe({
      next: () => {
        this.success = 'Doctor profile deleted successfully.';
        this.closeDeleteModal();
        this.loadDoctors();
      },
      error: () => {
        this.error = 'Failed to delete doctor.';
      }
    });
  }
}