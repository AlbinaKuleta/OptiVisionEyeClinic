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
}

export interface UpdateUserRole {
  role: string;
}