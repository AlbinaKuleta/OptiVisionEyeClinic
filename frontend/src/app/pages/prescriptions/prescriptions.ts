import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription';
import { PatientService } from '../../services/patient';
import { Prescription } from '../../models/prescription';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prescriptions.html',
  styleUrls: ['./prescriptions.css']
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  patients: Patient[] = [];

  prescriptionForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  prescriptionToEdit: Prescription | null = null;
  prescriptionToDelete: Prescription | null = null;
  prescriptionDetails: Prescription | null = null;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService
  ) {
    this.prescriptionForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadPatients();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', Validators.required],
      prescriptionDate: ['', Validators.required],
      prescriptionType: ['Eyeglasses', Validators.required],
      rightEyeSphere: [''],
      leftEyeSphere: [''],
      rightEyeCylinder: [''],
      leftEyeCylinder: [''],
      rightEyeAxis: [''],
      leftEyeAxis: [''],
      pupillaryDistance: [''],
      medicationName: [''],
      dosage: [''],
      instructions: ['']
    });
  }

  loadPrescriptions(): void {
    this.prescriptionService.getPrescriptions().subscribe({
      next: (data) => this.prescriptions = data,
      error: () => this.error = 'Failed to load prescriptions.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.error = 'Failed to load patients.'
    });
  }

  createPrescription(): void {
    if (this.prescriptionForm.invalid) {
      this.prescriptionForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.prescriptionService.createPrescription(this.prescriptionForm.value).subscribe({
      next: () => {
        this.success = 'Prescription created successfully.';
        this.error = '';
        this.loading = false;
        this.prescriptionForm.reset({ prescriptionType: 'Eyeglasses' });
        this.loadPrescriptions();
      },
      error: () => {
        this.error = 'Failed to create prescription.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(prescription: Prescription): void {
    this.prescriptionToEdit = prescription;

    this.editForm.patchValue({
      patientId: prescription.patientId,
      prescriptionDate: prescription.prescriptionDate?.substring(0, 16),
      prescriptionType: prescription.prescriptionType,
      rightEyeSphere: prescription.rightEyeSphere,
      leftEyeSphere: prescription.leftEyeSphere,
      rightEyeCylinder: prescription.rightEyeCylinder,
      leftEyeCylinder: prescription.leftEyeCylinder,
      rightEyeAxis: prescription.rightEyeAxis,
      leftEyeAxis: prescription.leftEyeAxis,
      pupillaryDistance: prescription.pupillaryDistance,
      medicationName: prescription.medicationName,
      dosage: prescription.dosage,
      instructions: prescription.instructions
    });
  }

  closeEditModal(): void {
    this.prescriptionToEdit = null;
    this.editForm.reset({ prescriptionType: 'Eyeglasses' });
  }

  updatePrescription(): void {
    if (!this.prescriptionToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.prescriptionService.updatePrescription(this.prescriptionToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Prescription updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadPrescriptions();
      },
      error: () => this.error = 'Failed to update prescription.'
    });
  }

  openDeleteModal(prescription: Prescription): void {
    this.prescriptionToDelete = prescription;
  }

  closeDeleteModal(): void {
    this.prescriptionToDelete = null;
  }

  getPrescriptionCountText(): string {
  return this.prescriptions.length === 1
    ? '1 prescription'
    : `${this.prescriptions.length} prescriptions`;
}

  confirmDelete(): void {
    if (!this.prescriptionToDelete) return;

    this.prescriptionService.deletePrescription(this.prescriptionToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadPrescriptions();
      },
      error: () => this.error = 'Failed to delete prescription.'
    });
  }

  viewDetails(prescription: Prescription): void {
    this.prescriptionDetails = prescription;
  }

  closeDetailsModal(): void {
    this.prescriptionDetails = null;
  }
}