import { Patient } from './patient';

export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: string;
  notes: string;
  createdAt: string;
}

export interface CreateAppointment {
  patientId: number;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: string;
  notes: string;
}