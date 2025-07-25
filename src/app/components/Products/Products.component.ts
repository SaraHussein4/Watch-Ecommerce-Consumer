import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { ProductFilter } from '../../models/ProductFilter';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActivatedRoute } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-Products',
  templateUrl: './Products.component.html',
  styleUrls: ['./Products.component.css'],
  providers: [ProductService],
  imports: [CommonModule, ProductCardComponent, FormsModule, NgSelectModule, NgxSkeletonLoaderModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  totalCount: number = 0;

  selectedCategoryIds: number[] = [];
  selectedBrandIds: number[] = [];
  maleChecked = true;
  femaleChecked = true;
  selectedCategoryId: number | string | null = "";
  selectedBrandId: number | string | null = "";

  // Loading states
  isLoadingProducts: boolean = false;
  isLoadingBrands: boolean = false;
  isLoadingCategories: boolean = false;
  skeletonItems = Array(8).fill(0); // For skeleton loader

  filters: ProductFilter = {
    searchTerm: '',
    sortBy: 'newest',
    genders: ['male', 'female'],
    categoryIds: [],
    brandIds: [],
    page: 1,
    pageSize: 8
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      const brandId = +params['brandId'];
      if (brandId) {
        this.filters.brandIds = [brandId];
        this.selectedBrandId = brandId;
      }
      this.applyFilters();
    });
  }

  loadProducts() {
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

  onSortChange() {
    this.applyFilters();
  }

  onGenderChange() {
    this.filters.genders = [];
    if (this.maleChecked) this.filters.genders.push('male');
    if (this.femaleChecked) this.filters.genders.push('female');
    this.applyFilters();
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
      pageSize: 8
    };
    this.selectedCategoryIds = [];
    this.selectedBrandIds = [];
    this.maleChecked = true;
    this.femaleChecked = true;
    this.applyFilters();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.filters.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  onPageChange(newPage: number): void {
    this.filters.page = newPage;
    this.loadProducts();
  }
}