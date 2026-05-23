import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePrescription, Prescription } from '../models/prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'https://localhost:7253/api/Prescriptions';

  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl);
  }

  createPrescription(prescription: CreatePrescription): Observable<any> {
    return this.http.post(this.apiUrl, prescription);
  }

  updatePrescription(id: number, prescription: CreatePrescription): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, prescription);
  }

  deletePrescription(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}