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
@Component({
  selector: 'app-Products',
  templateUrl: './Products.component.html',
  styleUrls: ['./Products.component.css'],
  providers: [ProductService],
  imports: [CommonModule, ProductCardComponent, FormsModule, NgSelectModule]
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];


  selectedCategoryIds: number[] = [];
  selectedBrandIds: number[] = [];
  maleChecked = true;
  femaleChecked = true;

  selectedCategoryId: number | string | null = "";
  selectedBrandId: number | string | null = "";

  filters: ProductFilter = {
    searchTerm: '',
    sortBy: 'newest',
    genders: ['male', 'female'],
    categoryIds: [],
    brandIds: [],
    page: 1,
    pageSize: 10
  };

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {

  }

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
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => {
        this.products = res,
        console.log('product:', res);
      },
      error: (err) => console.error('Error loading products:', err)
    });
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
    console.log('Sending filters to API:', this.filters);
    this.productService.getFilteredProducts(this.filters).subscribe({
      next: (res) => { this.products = res },
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
    this.maleChecked = true;
    this.femaleChecked = true;
    this.applyFilters();
  }

}
