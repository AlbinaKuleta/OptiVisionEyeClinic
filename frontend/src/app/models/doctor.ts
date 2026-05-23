export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  availability: string;
  notes: string;
  createdAt: string;
}

export interface CreateDoctor {
  fullName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  availability: string;
  notes: string;
}