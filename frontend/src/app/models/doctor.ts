export interface DoctorUser {
  id: string;
  fullName: string;
  email: string;
}

export interface Doctor {
  id: number;
  applicationUserId: string;
  applicationUser?: DoctorUser;
  specialization: string;
  phoneNumber: string;
  availability: string;
  notes: string;
  createdAt: string;
}

export interface CreateDoctor {
  applicationUserId: string;
  specialization: string;
  phoneNumber: string;
  availability: string;
  notes: string;
}