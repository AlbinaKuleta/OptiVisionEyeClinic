import { Patient } from './patient';

export interface Prescription {
  id: number;
  patientId: number;
  patient?: Patient;
  prescriptionDate: string;
  prescriptionType: string;
  rightEyeSphere: string;
  leftEyeSphere: string;
  rightEyeCylinder: string;
  leftEyeCylinder: string;
  rightEyeAxis: string;
  leftEyeAxis: string;
  pupillaryDistance: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  createdAt: string;
}

export interface CreatePrescription {
  patientId: number;
  prescriptionDate: string;
  prescriptionType: string;
  rightEyeSphere: string;
  leftEyeSphere: string;
  rightEyeCylinder: string;
  leftEyeCylinder: string;
  rightEyeAxis: string;
  leftEyeAxis: string;
  pupillaryDistance: string;
  medicationName: string;
  dosage: string;
  instructions: string;
}