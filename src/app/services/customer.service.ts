import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  getCustomers(page: number, pageSize: number): Observable<{customers:Customer[], totalCount: number}> {
      return this.httpClient.get<{customers: Customer[], totalCount: number}>(`https://localhost:7071/api/customers?page=${page}&pageSize=${pageSize}`);
  }
}
