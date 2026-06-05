export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface CreateUser {
  fullName: string;
  email: string;
  password: string;
  role: string;

  specialization?: string;
  phoneNumber?: string;
  availability?: string;
  notes?: string;
}

export interface UpdateUserRole {
  role: string;
}