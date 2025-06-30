import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { ProductService } from '../../services/product.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css'],
  providers: [ProductService]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  featuredBrandProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadBrandProducts();
  }

  loadProducts() {
    this.productService.getTopBestSellers().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  loadBrands() {
    this.http.get<Brand[]>('https://localhost:7071/api/ProductBrand').subscribe({
      next: data => this.brands = data,
      error: err => console.error('Failed to load brands', err)
    });
  }

 getPrimaryImage(product: Product) {
  const img = product.images?.find(i => i.isPrimary);
  if (!img) return null;
   // If the URL is already absolute, return as is
    if (img.url.startsWith('http')) return img;
    // Otherwise, prepend your backend base URL
    return { ...img, url:img.url.includes('/Images')?`https://localhost:7071${img.url}`: `https://localhost:7071/images/${img.url}` };
}

  loadBrandProducts() {
  this.productService.getBrandFeatured().subscribe({
    next: data =>{
      this.featuredBrandProducts = data,
      console.log('Featured brand products loaded:', this.featuredBrandProducts);
    },
    error: err => console.error('Failed to load brand-featured products', err)
  });
}
filterByBrand(brandId: number) {
  this.router.navigate(['/products'], { queryParams: { brandId } });
}

  addToFavorites(productId: number) {
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
