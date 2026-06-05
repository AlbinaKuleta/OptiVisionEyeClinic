export interface AppointmentPatient {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface AppointmentDoctorUser {
  id: string;
  fullName: string;
  email: string;
}

export interface AppointmentDoctor {
  id: number;
  applicationUserId: string;
  applicationUser?: AppointmentDoctorUser;
  specialization: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patient?: AppointmentPatient;
  doctorId: number;
  doctor?: AppointmentDoctor;
  appointmentDate: string;
  reason: string;
  status: string;
  notes: string;
}

export interface CreateAppointment {
  patientId: number;
  doctorId?: number | null;
  appointmentDate: string;
  reason: string;
  status: string;
  notes: string;
}