import { Injectable } from '@angular/core';
import { CustomerBasket } from '../models/cart';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart';  
@Injectable({
  providedIn: 'root'
})
export class CartService {
private baseUrl = 'https://localhost:7071/api/cart';
private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

   getBasket(userId: string): Observable<CustomerBasket> {
    return new Observable(observer => {
      this.httpClient.get<CustomerBasket>(`${this.baseUrl}/${userId}`).subscribe({
        next: basket => {
          this.updateCartCount(basket);
          observer.next(basket);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  updateBasket(items: any[]): Observable<CustomerBasket> {
    return new Observable(observer => {
      this.httpClient.post<CustomerBasket>(this.baseUrl, items).subscribe({
        next: updatedBasket => {
          this.updateCartCount(updatedBasket);
          observer.next(updatedBasket);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  deleteBasket(userId: string): Observable<boolean> {
    return new Observable(observer => {
      this.httpClient.delete<boolean>(`${this.baseUrl}?id=${userId}`).subscribe({
        next: success => {
          this.cartItemCountSubject.next(0);
          observer.next(success);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  removeItem(productId: number): Observable<CustomerBasket> {
    return new Observable(observer => {
      this.httpClient.delete<CustomerBasket>(`${this.baseUrl}/item/${productId}`).subscribe({
        next: updatedBasket => {
          this.updateCartCount(updatedBasket);
          observer.next(updatedBasket);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  private updateCartCount(basket: CustomerBasket | null) {
    const count = basket?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    this.cartItemCountSubject.next(count);
  }

  addItemToBasket(newItem: CartItem): Observable<CustomerBasket> {
  return new Observable(observer => {
    this.httpClient.post<CustomerBasket>(`${this.baseUrl}/AddItem`, newItem).subscribe({
      next: updatedBasket => {
        this.updateCartCount(updatedBasket);
        observer.next(updatedBasket);
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}
}
