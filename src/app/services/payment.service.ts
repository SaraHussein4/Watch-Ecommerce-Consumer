import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/models-payment/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'https://localhost:7071';

  constructor(private httpClient: HttpClient) {}
  getPayment(basketId: string): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/api/Payments?basketId=${basketId}`,
      {}
    );
  }
}
