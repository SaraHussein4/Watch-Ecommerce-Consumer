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
  getFavouriteForUser(userId: string): Observable<Product[]> {
    const url = `https://localhost:7071/api/Fav/${userId}`;
    return this.httpClient.get<Product[]>(url);
  }

  addToFavourite(productId: number): Observable<any> {
    const url = `https://localhost:7071/api/Fav`;
    const favouriteItem: Favourite = {
      userId: "ece17c49-c048-4baa-af70-74d42d6bbd7b",
      productId: productId
    };
    return this.httpClient.post(url, favouriteItem);
  }


  DeleteFromFavourite(productId: number): Observable<any> {


    const url = `https://localhost:7071/api/Fav?productId=${productId}&userId=ece17c49-c048-4baa-af70-74d42d6bbd7b`;
    console.log(url)
    return this.httpClient.delete<void>(url).pipe(
      catchError(error => {
        console.error('Delete failed:', error);
        return throwError(() => new Error('Failed to delete favorite'));
      })
    );
  }
}
