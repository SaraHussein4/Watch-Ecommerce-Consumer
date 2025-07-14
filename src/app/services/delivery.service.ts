import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery } from '../models/delivery.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = 'https://localhost:7071/api/Customers/deliveries';

  constructor(private http: HttpClient) { }

  
  getAll(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.baseUrl);
  }

   addDelivery(delivery: any): Observable<Delivery> {
    return this.http.post<Delivery>(this.baseUrl, delivery);
  }

  deleteDelivery(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  editDelivery(id: string, delivery: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, delivery);
  }
}
