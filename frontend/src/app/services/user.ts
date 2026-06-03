import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppUser, CreateUser, UpdateUserRole } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7253/api/Users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  getDoctorUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/doctors`);
  }

  createUser(user: CreateUser): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  updateUserRole(id: string, data: UpdateUserRole): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/role`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}