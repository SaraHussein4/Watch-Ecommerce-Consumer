import { CurrencyPipe } from '@angular/common';
import { Component, Input, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-Product-Card',
  templateUrl: './Product-Card.component.html',
  styleUrls: ['./Product-Card.component.css'],
  providers: [CurrencyPipe],
  imports: [CommonModule, RouterModule, RouterLink],
})
export class ProductCardComponent implements OnInit {
  @Input() product: any; // Replace 'any' with your actual product type
  @Input() isAdmin: boolean = false; // Flag to check if the user is an admin
  @Output() productDeleted = new EventEmitter<number>(); // Event emitter to notify parent component about product deletion
  constructor(private routre: Router, private productService: ProductService) {}

  ngOnInit() {}

  getPrimaryImage(product: Product) {
    const img = product.images?.find((img) => img.isPrimary);
    if (!img) return null;
    // If the URL is already absolute, return as is
    if (img.url.startsWith('http')) return img;
    // Otherwise, prepend your backend base URL
    return {
      ...img,
      url: img.url.includes('/Images')
        ? `https://localhost:7071${img.url}`
        : `https://localhost:7071/images/${img.url}`,
    };
  }

  showDetails(id: any) {
    console.log('Product ID:', id);
    this.routre.navigateByUrl(`/product/${id}`);
  }

  editProduct(id: any) {
    console.log('Edit Product ID:', id);
    this.routre.navigateByUrl(`/products/edit/${id}`);
  }
  deleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('✅ Product deleted successfully');
          this.productDeleted.emit(id); // Notify parent to remove product
        },
        error: (error) => {
          console.error('Error deleting product', error);
          alert('❌ Failed to delete product');
        },
      });
    }
  }
}
