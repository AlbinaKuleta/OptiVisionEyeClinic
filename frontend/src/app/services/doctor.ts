import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor, CreateDoctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://localhost:7253/api/Doctors';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  createDoctor(doctor: CreateDoctor): Observable<any> {
    return this.http.post(this.apiUrl, doctor);
  }

  updateDoctor(id: number, doctor: CreateDoctor): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}