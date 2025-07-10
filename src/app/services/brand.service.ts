import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';
@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }


getAll(): Observable<Brand[]> {
  return this.http.get<Brand[]>('https://localhost:7071/api/ProductBrand');
}
//add a new brand
addBrand(brand: Brand): Observable<Brand> {
  return this.http.post<Brand>('https://localhost:7071/api/ProductBrand', brand);
}
}
