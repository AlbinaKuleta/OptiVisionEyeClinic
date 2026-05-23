import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEyeExam, EyeExam } from '../models/eye-exam';

@Injectable({
  providedIn: 'root'
})
export class EyeExamService {
  private apiUrl = 'https://localhost:7253/api/EyeExams';

  constructor(private http: HttpClient) {}

  getEyeExams(): Observable<EyeExam[]> {
    return this.http.get<EyeExam[]>(this.apiUrl);
  }

  createEyeExam(exam: CreateEyeExam): Observable<any> {
    return this.http.post(this.apiUrl, exam);
  }

  updateEyeExam(id: number, exam: CreateEyeExam): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exam);
  }

  deleteEyeExam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}