import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];

  patientForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  error = '';
  success = '';

  patientToDelete: Patient | null = null;
  patientDetails: Patient | null = null;
  patientToEdit: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) {
    this.patientForm = this.createPatientForm();
    this.editForm = this.createPatientForm();
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  createPatientForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
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

  createPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.patientService.createPatient(this.patientForm.value).subscribe({
      next: () => {
        this.success = 'Patient added successfully.';
        this.error = '';
        this.loading = false;
        this.patientForm.reset();
        this.loadPatients();
      },
      error: () => {
        this.error = 'Failed to add patient.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(patient: Patient): void {
    this.patientToEdit = patient;

    this.editForm.patchValue({
      fullName: patient.fullName,
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
    this.editForm.reset();
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