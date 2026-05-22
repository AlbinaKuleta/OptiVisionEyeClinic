export interface Patient {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  medicalNotes: string;
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
}