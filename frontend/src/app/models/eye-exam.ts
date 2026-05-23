import { Patient } from './patient';

export interface EyeExam {
  id: number;
  patientId: number;
  patient?: Patient;
  examDate: string;
  rightEyeVision: string;
  leftEyeVision: string;
  eyePressureRight: string;
  eyePressureLeft: string;
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  createdAt: string;
}

export interface CreateEyeExam {
  patientId: number;
  examDate: string;
  rightEyeVision: string;
  leftEyeVision: string;
  eyePressureRight: string;
  eyePressureLeft: string;
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
}