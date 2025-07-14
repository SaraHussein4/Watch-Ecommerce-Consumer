import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ProductFilter } from '../../models/ProductFilter';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../confirmDelete/confirmDelete.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, ProductCardComponent, FormsModule, NgxSkeletonLoaderModule, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  totalCount: number = 0;
  selectedCategoryIds: number[] = [];
  selectedBrandIds: number[] = [];
  selectedCategoryId: number | string | null = "";
  selectedBrandId: number | string | null = "";

  // Loading states
  isLoadingProducts: boolean = false;
  isLoadingBrands: boolean = false;
  isLoadingCategories: boolean = false;
  skeletonItems = Array(6).fill(0); // For skeleton loader

  filters: ProductFilter = {
    searchTerm: '',
    sortBy: 'newest',
    genders: ['male', 'female'],
    categoryIds: [],
    brandIds: [],
    page: 1,
    pageSize: 6
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalCount = res.totalCount;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoadingProducts = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.loadProducts();
  }

  onProductDeleted(deletedId: number) {
    this.products = this.products.filter(p => p.id !== deletedId);
    if (this.products.length === 0 && this.filters.page > 1) {
      this.filters.page--;
      this.loadProducts();
    }
    if (this.products.length === 0 && this.filters.page === 1) {
      this.totalCount = 0;
    }
  }

  onCategoryChange() {
    this.filters.categoryIds = this.selectedCategoryId
      ? [Number(this.selectedCategoryId)]
      : [];
    this.applyFilters();
  }

  onBrandChange() {
    this.filters.brandIds = this.selectedBrandId
      ? [Number(this.selectedBrandId)]
      : [];
    this.applyFilters();
  }

  applyFilters() {
    this.isLoadingProducts = true;
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalCount = res.totalCount;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoadingProducts = false;
      }
    });
  }

  resetFilters() {
    this.filters = {
      searchTerm: '',
      sortBy: 'newest',
      genders: ['male', 'female'],
      categoryIds: [],
      brandIds: [],
      page: 1,
      pageSize: 10
    };
    this.selectedCategoryIds = [];
    this.selectedBrandIds = [];
    this.applyFilters();
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
        this.isLoadingBrands = false;
      }
    });
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.http.get<Category[]>('https://localhost:7071/api/Categories').subscribe({
      next: data => {
        this.categories = data;
        this.isLoadingCategories = false;
      },
      error: err => {
        console.error('Failed to load categories', err);
        this.isLoadingCategories = false;
      }
    });
  }

  onSearch() {
    this.filters.searchTerm = this.filters.searchTerm?.trim();
    this.applyFilters();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.filters.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}