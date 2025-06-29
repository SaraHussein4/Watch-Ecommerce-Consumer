import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

getAll(): Observable<Product[]> {
  return this.http.get<Product[]>('https://localhost:7071/api/product');
}
}

