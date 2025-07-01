import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

   private baseUrl = 'https://localhost:7071/api';
  constructor(private httpClient:HttpClient) { }

  getOrders() {
    return this.httpClient.get(`${this.baseUrl}/Order`);
  }

}
