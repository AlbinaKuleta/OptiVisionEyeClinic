import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../../services/billing';
import { PatientService } from '../../services/patient';
import { Billing } from '../../models/billing';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './billing.html',
  styleUrls: ['./billing.css']
})
export class BillingComponent implements OnInit {
  billings: Billing[] = [];
  patients: Patient[] = [];

  billingForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  billingToEdit: Billing | null = null;
  billingToDelete: Billing | null = null;
  billingDetails: Billing | null = null;

  constructor(
    private fb: FormBuilder,
    private billingService: BillingService,
    private patientService: PatientService
  ) {
    this.billingForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadBillings();
    this.loadPatients();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', Validators.required],
      billingDate: ['', Validators.required],
      serviceName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      paymentStatus: ['Pending', Validators.required],
      paymentMethod: [''],
      notes: ['']
    });
  }

  loadBillings(): void {
    this.billingService.getBillings().subscribe({
      next: (data) => this.billings = data,
      error: () => this.error = 'Failed to load billings.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.error = 'Failed to load patients.'
    });
  }

  createBilling(): void {
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.billingService.createBilling(this.billingForm.value).subscribe({
      next: () => {
        this.success = 'Billing record created successfully.';
        this.error = '';
        this.loading = false;
        this.billingForm.reset({ paymentStatus: 'Pending' });
        this.loadBillings();
      },
      error: () => {
        this.error = 'Failed to create billing record.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(billing: Billing): void {
    this.billingToEdit = billing;

    this.editForm.patchValue({
      patientId: billing.patientId,
      billingDate: billing.billingDate?.substring(0, 16),
      serviceName: billing.serviceName,
      amount: billing.amount,
      paymentStatus: billing.paymentStatus,
      paymentMethod: billing.paymentMethod,
      notes: billing.notes
    });
  }

  closeEditModal(): void {
    this.billingToEdit = null;
    this.editForm.reset({ paymentStatus: 'Pending' });
  }

  updateBilling(): void {
    if (!this.billingToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.billingService.updateBilling(this.billingToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Billing record updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadBillings();
      },
      error: () => this.error = 'Failed to update billing record.'
    });
  }

  openDeleteModal(billing: Billing): void {
    this.billingToDelete = billing;
  }

  closeDeleteModal(): void {
    this.billingToDelete = null;
  }

  getBillingCountText(): string {
  return this.billings.length === 1
    ? '1 billing record'
    : `${this.billings.length} billing records`;
}
  confirmDelete(): void {
    if (!this.billingToDelete) return;

    this.billingService.deleteBilling(this.billingToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadBillings();
      },
      error: () => this.error = 'Failed to delete billing record.'
    });
  }

  viewDetails(billing: Billing): void {
    this.billingDetails = billing;
  }

  closeDetailsModal(): void {
    this.billingDetails = null;
  }
}