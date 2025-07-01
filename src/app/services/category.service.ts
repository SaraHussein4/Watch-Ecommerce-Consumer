// this service is used to fetch categories from the backend
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'https://localhost:7071/api/Categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

}
