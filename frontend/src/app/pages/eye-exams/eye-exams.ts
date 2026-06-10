import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EyeExamService } from '../../services/eye-exam';
import { PatientService } from '../../services/patient';
import { EyeExam } from '../../models/eye-exam';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-eye-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eye-exams.html',
  styleUrls: ['./eye-exams.css']
})
export class EyeExamsComponent implements OnInit {
  eyeExams: EyeExam[] = [];
  patients: Patient[] = [];

  examForm: FormGroup;
  editForm: FormGroup;

  loading = false;
  success = '';
  error = '';

  examToEdit: EyeExam | null = null;
  examToDelete: EyeExam | null = null;
  examDetails: EyeExam | null = null;

  constructor(
    private fb: FormBuilder,
    private eyeExamService: EyeExamService,
    private patientService: PatientService
  ) {
    this.examForm = this.createForm();
    this.editForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEyeExams();
    this.loadPatients();
  }

  createForm(): FormGroup {
    return this.fb.group({
      patientId: ['', Validators.required],
      examDate: ['', Validators.required],
      rightEyeVision: [''],
      leftEyeVision: [''],
      eyePressureRight: [''],
      eyePressureLeft: [''],
      diagnosis: [''],
      treatmentPlan: [''],
      notes: ['']
    });
  }

  loadEyeExams(): void {
    this.eyeExamService.getEyeExams().subscribe({
      next: (data) => this.eyeExams = data,
      error: () => this.error = 'Failed to load eye exams.'
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data,
      error: () => this.error = 'Failed to load patients.'
    });
  }

  createEyeExam(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.eyeExamService.createEyeExam(this.examForm.value).subscribe({
      next: () => {
        this.success = 'Eye exam created successfully.';
        this.error = '';
        this.loading = false;
        this.examForm.reset();
        this.loadEyeExams();
      },
      error: () => {
        this.error = 'Failed to create eye exam.';
        this.success = '';
        this.loading = false;
      }
    });
  }

  openEditModal(exam: EyeExam): void {
    this.examToEdit = exam;

    this.editForm.patchValue({
      patientId: exam.patientId,
      examDate: exam.examDate?.substring(0, 16),
      rightEyeVision: exam.rightEyeVision,
      leftEyeVision: exam.leftEyeVision,
      eyePressureRight: exam.eyePressureRight,
      eyePressureLeft: exam.eyePressureLeft,
      diagnosis: exam.diagnosis,
      treatmentPlan: exam.treatmentPlan,
      notes: exam.notes
    });
  }

  closeEditModal(): void {
    this.examToEdit = null;
    this.editForm.reset();
  }

  updateEyeExam(): void {
    if (!this.examToEdit) return;

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.eyeExamService.updateEyeExam(this.examToEdit.id, this.editForm.value).subscribe({
      next: () => {
        this.success = 'Eye exam updated successfully.';
        this.error = '';
        this.closeEditModal();
        this.loadEyeExams();
      },
      error: () => this.error = 'Failed to update eye exam.'
    });
  }

  openDeleteModal(exam: EyeExam): void {
    this.examToDelete = exam;
  }

  closeDeleteModal(): void {
    this.examToDelete = null;
  }

  getEyeExamCountText(): string {
  return this.eyeExams.length === 1
    ? '1 eye exam'
    : `${this.eyeExams.length} eye exams`;
}

  confirmDelete(): void {
    if (!this.examToDelete) return;

    this.eyeExamService.deleteEyeExam(this.examToDelete.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadEyeExams();
      },
      error: () => this.error = 'Failed to delete eye exam.'
    });
  }

  viewDetails(exam: EyeExam): void {
    this.examDetails = exam;
  }

  closeDetailsModal(): void {
    this.examDetails = null;
  }
}