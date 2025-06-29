import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { ProductService } from '../../services/product.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css'],
  providers: [ProductService]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
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
    const img = product.images?.find(img => img.isPrimary);
    if (!img) return null;
    // If the URL is already absolute, return as is
    if (img.url.startsWith('http')) return img;
    // Otherwise, prepend your backend base URL
    return { ...img, url: `https://localhost:7071/images/${img.url}` };
  }

  addToFavorites(productId: number) {
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
