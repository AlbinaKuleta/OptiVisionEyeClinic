export interface PatientDoctorUser {
  id: string;
  fullName: string;
  email: string;
}

export interface PatientDoctor {
  id: number;
  applicationUserId: string;
  applicationUser?: PatientDoctorUser;
  specialization: string;
  email?: string;
}

export interface Patient {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  medicalNotes: string;
  doctorId?: number | null;
  doctor?: PatientDoctor | null;
  createdAt: string;
}

export interface CreatePatient {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  medicalNotes: string;
  doctorId?: number | null;
}