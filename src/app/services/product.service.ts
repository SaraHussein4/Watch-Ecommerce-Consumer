import { Image } from './../models/image.model';
import { Product } from './../models/product.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductFilter } from '../models/ProductFilter';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('https://localhost:7071/api/product');
  }

  getFilteredProducts(productFilter: ProductFilter): Observable<Product[]> {
    return this.http.post<Product[]>(
      'https://localhost:7071/api/product/FilterProduct',
      productFilter
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`https://localhost:7071/api/Product/${id}`);
  }
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `https://localhost:7071/api/Product/${id}`,
      product
    );
  }
  //getCategory
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('https://localhost:7071/api/Categories');
  }
  //getBrand
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>('https://localhost:7071/api/ProductBrand');
  }

  getBrandFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(
      'https://localhost:7071/api/product/brand-featured'
    );
  }
  getProductsByBrand(brandId: number): Observable<Product[]> {

    return this.http.get<Product[]>(
      `https://localhost:7071/api/product?brandId=${brandId}`
    );
  }
  getTopBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(
      'https://localhost:7071/api/product/best-sellers'
    );
  }
  //add image
  addImage(imageData: any): Observable<any[]> {
    return this.http.post<any[]>(
      'https://localhost:7071/api/Image',
      imageData
    );
  // return this.http.get<Product[]>(`https://localhost:7071/api/product?brandId=${brandId}`);
}

 addProduct(productData: FormData): Observable<any> {
    return this.http.post('https://localhost:7071/api/Product', productData);

  }
}
