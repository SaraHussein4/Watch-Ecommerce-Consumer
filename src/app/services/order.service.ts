import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrderRequest, DeliveryMethod, Governorate, OrderOverview } from '../models/order';



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'https://localhost:7071/api/Order';
  constructor(private httpClient: HttpClient) { }

  createOrder(orderData: CreateOrderRequest): Observable<any> {
    return this.httpClient.post(this.baseUrl, orderData);
  }

  getOrderById(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}?id=${id}`);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/cancel/${orderId}`, {});
  }

  getAllGovernorates(): Observable<Governorate[]> {
    return this.httpClient.get<Governorate[]>(`${this.baseUrl}/Governorate`);
  }

  getAllDeliveryMethods(): Observable<DeliveryMethod[]> {
    return this.httpClient.get<DeliveryMethod[]>(`${this.baseUrl}/DeliveryMethods`);
  }

  getGovernorateDeliveryCost(governorateId: number, deliveryMethodId: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.baseUrl}/DeliveryCost?governorateId=${governorateId}&deliveryMethodId=${deliveryMethodId}`
    );
  }

  createStripeSession(orderData: CreateOrderRequest): Observable<{ url: string }> {
    return this.httpClient.post<{ url: string }>(`${this.baseUrl}/CreateStripe`, orderData);
  }
  confirmPayment(sessionId: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/confirm-payment?sessionId=${sessionId}`, {});
  }

  getOrders(page: number, pageSize: number): Observable<{ orders: OrderOverview[], totalCount: number }> {
    return this.httpClient.get<{ orders: OrderOverview[], totalCount: number }>(`${this.baseUrl}/orders?page=${page}&pageSize=${pageSize}`);
  }

  getOrdersForUser(page: number, pageSize: number): Observable<{ orders: OrderOverview[], totalCount: number }> {
    return this.httpClient.get<{ orders: OrderOverview[], totalCount: number }>(`${this.baseUrl}/ordersForUser?page=${page}&pageSize=${pageSize}`);
  }

  updateOrder(order: OrderOverview): Observable<any> {
    console.log(order)
    return this.httpClient.put(`${this.baseUrl}/${order.id}`, order);
  }
}
