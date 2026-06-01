import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PatientService } from '../../services/patient';
import { DoctorService } from '../../services/doctor';

import { Patient } from '../../models/patient';
import { Doctor } from '../../models/doctor';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  doctors: Doctor[] = [];

  patientForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  patientToEdit: Patient | null = null;
  patientToDelete: Patient | null = null;
  patientDetails: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {
    this.patientForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      doctorId: [null],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      address: [''],
      medicalNotes: ['']
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

  createPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.patientService.createPatient(this.patientForm.value).subscribe({
      next: () => {
        this.success = 'Patient created successfully.';
        this.error = '';
        this.loading = false;
        this.patientForm.reset({ doctorId: null });
        this.loadPatients();
      },
      error: () => {
        this.error = 'Failed to create patient.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(patient: Patient): void {
    this.patientToEdit = patient;

    this.editForm.patchValue({
      fullName: patient.fullName,
      doctorId: patient.doctorId ?? null,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth?.substring(0, 10),
      phoneNumber: patient.phoneNumber,
      email: patient.email,
      address: patient.address,
      medicalNotes: patient.medicalNotes
    });
  }

  closeEditModal(): void {
    this.patientToEdit = null;
    this.editForm.reset({ doctorId: null });
  }

  updatePatient(): void {
    if (!this.patientToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.patientService.updatePatient(this.patientToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Patient updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadPatients();
      },
      error: () => {
        this.error = 'Failed to update patient.';
      }
    });
  }

  openDeleteModal(patient: Patient): void {
    this.patientToDelete = patient;
  }

  closeDeleteModal(): void {
    this.patientToDelete = null;
  }

  confirmDelete(): void {
    if (!this.patientToDelete) return;

    this.patientService.deletePatient(this.patientToDelete.id).subscribe({
      next: () => {
        this.success = 'Patient deleted successfully.';
        this.closeDeleteModal();
        this.loadPatients();
      },
      error: () => {
        this.error = 'Failed to delete patient.';
      }
    });
  }

  viewDetails(patient: Patient): void {
    this.patientDetails = patient;
  }

  closeDetailsModal(): void {
    this.patientDetails = null;
  }
}