import { Patient } from './patient';

export interface Billing {
  id: number;
  patientId: number;
  patient?: Patient;
  billingDate: string;
  serviceName: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
}

export interface CreateBilling {
  patientId: number;
  billingDate: string;
  serviceName: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
}