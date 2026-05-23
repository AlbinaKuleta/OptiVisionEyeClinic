import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Billing, CreateBilling } from '../models/billing';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl = 'https://localhost:7253/api/Billings';

  constructor(private http: HttpClient) {}

  getBillings(): Observable<Billing[]> {
    return this.http.get<Billing[]>(this.apiUrl);
  }

  createBilling(billing: CreateBilling): Observable<any> {
    return this.http.post(this.apiUrl, billing);
  }

  updateBilling(id: number, billing: CreateBilling): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, billing);
  }

  deleteBilling(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}