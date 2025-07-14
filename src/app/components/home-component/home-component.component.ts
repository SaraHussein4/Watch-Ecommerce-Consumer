import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";
import { AuthService } from '../../services/auth.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, NgxSkeletonLoaderModule],
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  brands: Brand[] = [];
  featuredBrandProducts: Product[] = [];
  
  // Loading states
  isLoadingProducts = true;
  isLoadingBrands = true;
  isLoadingFeaturedBrands = true;
  skeletonItems = Array(4).fill(0);
  featuredSkeletonItems = Array(4).fill(0);

  @ViewChild('typewriterEl', { static: false }) typewriterEl!: ElementRef;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadBrandProducts();
  }

  ngAfterViewInit(): void {
    this.startTyping();
  }

  startTyping() {
    const el = this.typewriterEl?.nativeElement;
    if (!el) return;

    const words = ['Welcome', 'to', 'Ora', 'Collective'];
    let wordIndex = 0;

    const typeLoop = () => {
      el.textContent = '';
      let current = 0;

      const typeNextWord = () => {
        if (current < words.length) {
          el.textContent += (current > 0 ? ' ' : '') + words[current];
          current++;
          setTimeout(typeNextWord, 600);
        } else {
          setTimeout(typeLoop, 1500);
        }
      };

      typeNextWord();
    };

    typeLoop();
  }

  loadProducts() {
    this.isLoadingProducts = true;
    this.productService.getTopBestSellers().subscribe({
      next: (res) => {
        this.products = res;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.toastr.error('Failed to load best sellers', 'Error');
        this.isLoadingProducts = false;
      }
    });
  }

  loadBrands() {
    this.isLoadingBrands = true;
    this.http.get<Brand[]>('https://localhost:7071/api/ProductBrand').subscribe({
      next: data => {
        this.brands = data;
        this.isLoadingBrands = false;
      },
      error: err => {
        console.error('Failed to load brands', err);
        this.toastr.error('Failed to load brands', 'Error');
        this.isLoadingBrands = false;
      }
    });
  }

  loadBrandProducts() {
    this.isLoadingFeaturedBrands = true;
    this.productService.getBrandFeatured().subscribe({
      next: data => {
        this.featuredBrandProducts = data;
        this.isLoadingFeaturedBrands = false;
      },
      error: err => {
        console.error('Failed to load brand-featured products', err);
        this.toastr.error('Failed to load featured brands', 'Error');
        this.isLoadingFeaturedBrands = false;
      }
    });
  }

  filterByBrand(brandId: number) {
    if (this.authService.isUser()) {
      this.router.navigate(['/products'], { queryParams: { brandId } });
    } else {
      this.router.navigate(['/login']);
      this.toastr.info('Please login to view brand products', 'Login Required');
    }
  }
}