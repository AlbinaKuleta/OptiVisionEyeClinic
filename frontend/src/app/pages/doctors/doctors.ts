import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];

  doctorForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  doctorToEdit: Doctor | null = null;
  doctorToDelete: Doctor | null = null;
  doctorDetails: Doctor | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService
  ) {
    this.doctorForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      specialization: ['', Validators.required],
      phoneNumber: [''],
      email: [''],
      availability: [''],
      notes: ['']
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => this.error = 'Failed to load doctors.'
    });
  }

  createDoctor(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.doctorService.createDoctor(this.doctorForm.value).subscribe({
      next: () => {
        this.success = 'Doctor added successfully.';
        this.error = '';
        this.loading = false;
        this.doctorForm.reset();
        this.loadDoctors();
      },
      error: () => {
        this.error = 'Failed to add doctor.';
        this.loading = false;
      }
    });
  }

  openEditModal(doctor: Doctor): void {
    this.doctorToEdit = doctor;
    this.editForm.patchValue(doctor);
  }

  closeEditModal(): void {
    this.doctorToEdit = null;
    this.editForm.reset();
  }

  updateDoctor(): void {
    if (!this.doctorToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.doctorService.updateDoctor(this.doctorToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Doctor updated successfully.';
        this.closeEditModal();
        this.loadDoctors();
      },
      error: () => this.error = 'Failed to update doctor.'
    });
  }

  openDeleteModal(doctor: Doctor): void {
    this.doctorToDelete = doctor;
  }

  closeDeleteModal(): void {
    this.doctorToDelete = null;
  }

  confirmDelete(): void {
    if (!this.doctorToDelete) return;

    this.doctorService.deleteDoctor(this.doctorToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadDoctors();
      },
      error: () => this.error = 'Failed to delete doctor.'
    });
  }

  viewDetails(doctor: Doctor): void {
    this.doctorDetails = doctor;
  }

  closeDetailsModal(): void {
    this.doctorDetails = null;
  }
}