import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { Favourite } from '../models/favourite';


@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  constructor(private httpClient: HttpClient) { }
  getFavourites(): Observable<Product[]> {
    const url = `https://localhost:7071/api/Fav`;
    return this.httpClient.get<Product[]>(url);
  }

  addToFavourite(productId: number): Observable<any> {
    const url = `https://localhost:7071/api/Fav?ProductId=${productId}`;
    return this.httpClient.post(url, null);
  }


  DeleteFromFavourite(productId: number): Observable<any> {
    const url = `https://localhost:7071/api/Fav/${productId}`;
    console.log(url)
    return this.httpClient.delete<void>(url);
  }

  getCount(): Observable<number> {
    const url = `https://localhost:7071/api/Fav/count`;
    return this.httpClient.get<number>(url).pipe(
      catchError(error => {
        console.error('Get count failed:', error);
        return throwError(() => new Error('Failed to get favorite count'));
      })
    );
  }
}
