import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { SideBarComponent } from "../admin-side-bar/side-bar.component";
import { ProductFilter } from '../../models/ProductFilter';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-products',
  imports: [RouterModule, ProductCardComponent, CommonModule, FormsModule],
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
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.filters.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  loadProducts(): void {
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res.items,
          this.totalCount = res.totalCount;
        console.log('Products loaded:', this.products);
      },
      error: (err) => console.error('Error loading products:', err)
    })

    // this.productService.getPaginatedProducts(this.page, this.filters.pageSize).subscribe({
    //   next: res => {
    //     this.products = res.items;
    //     this.totalCount = res.totalCount;
    //   },
    //   error: err => {
    //     console.error("Failed to fetch products:", err);
    //   }
    // });
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
      this.totalCount = 0; // Reset total count if no products left
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
    console.log('Sending filters to API:', this.filters);
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res.items,
          this.totalCount = res.totalCount;
        console.log('product:', res);
      },
      error: (err) => console.error('Error loading products:', err)
    })
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
    this.http.get<Brand[]>('https://localhost:7071/api/ProductBrand').subscribe({
      next: data => this.brands = data,
      error: err => console.error('Failed to load brands', err)
    });
  }

  loadCategories() {
    this.http.get<Category[]>('https://localhost:7071/api/Categories').subscribe({
      next: data => this.categories = data,
      error: err => console.error('Failed to load categories', err)
    });
  }

    onSearch() {
    this.filters.searchTerm = this.filters.searchTerm?.trim();
    this.applyFilters();
  }

}
