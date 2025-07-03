import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductCardComponent } from "../Product-Card/Product-Card.component";
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { SideBarComponent } from "../admin-side-bar/side-bar.component";

@Component({
  selector: 'app-admin-products',
  imports: [RouterModule, ProductCardComponent, CommonModule, SideBarComponent],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 6;

  constructor(
    private productService: ProductService,
  ) {

  }

  ngOnInit() {
    this.loadProducts();
  }
  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // loadProducts() {
  //   this.productService.getAll().subscribe((data: Product[]) => {
  //     this.products = data;
  //   });
  // }
    loadProducts(): void {
    this.productService.getPaginatedProducts(this.page, this.pageSize).subscribe({
      next: res => {
        this.products = res.items;
        this.totalCount = res.totalCount;
      },
      error: err => {
        console.error("Failed to fetch products:", err);
      }
    });
  }
   onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadProducts();
  }
  onProductDeleted(deletedId: number) {
  this.products = this.products.filter(p => p.id !== deletedId);
  if (this.products.length === 0 && this.page > 1) {
  this.page--;
  this.loadProducts();
}
  if (this.products.length === 0 && this.page === 1) {
    this.totalCount = 0; // Reset total count if no products left
}
}
}
