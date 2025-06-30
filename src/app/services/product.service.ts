import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductFilter } from '../models/ProductFilter';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('https://localhost:7071/api/product');
  }

  getFilteredProducts( productFilter : ProductFilter) : Observable<Product[]> {
    return this.http.post<Product[]>('https://localhost:7071/api/product/FilterProduct', productFilter);
  }

  getBrandFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>('https://localhost:7071/api/product/brand-featured');
  }
  getProductsByBrand(brandId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`https://localhost:7071/api/product?brandId=${brandId}`);
}
getTopBestSellers(): Observable<Product[]> {
  return this.http.get<Product[]>('https://localhost:7071/api/product/best-sellers');
}
}

