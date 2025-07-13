import { CurrencyPipe } from '@angular/common';
import { Component, Input, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-Product-Card',
  templateUrl: './Product-Card.component.html',
  styleUrls: ['./Product-Card.component.css'],
  providers: [CurrencyPipe],
  imports: [CommonModule, RouterModule, RouterLink],
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  @Input() isAdmin: boolean = false;
  @Input() isBrandCard: boolean = false;
  @Output() viewBrandProducts = new EventEmitter<number>();


  @Output() productDeleted = new EventEmitter<number>(); // Event emitter to notify parent component about product deletion
  constructor(
    private routre: Router,
    private productService: ProductService,
    private authService: AuthService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,

  ) {}

  ngOnInit() {

  }

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
    if(this.authService.isUser()){
      this.routre.navigateByUrl(`/product/${id}`);
    }
    else{
      this.routre.navigateByUrl(`/login`)
    }
  }

  editProduct(id: any) {

    console.log('Edit Product ID:', id);
    this.routre.navigateByUrl(`/products/edit/${id}`);

    this.routre.navigateByUrl(`/admin/products/edit/${id}`);

  }
  // deleteProduct(id: any) {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     this.productService.deleteProduct(id).subscribe({
  //       next: () => {
  //         // alert('✅ Product deleted successfully');
  //       this.toastr.success('Product deleted successfully!', 'Success');
  //         this.productDeleted.emit(id);
  //       },
  //       error: (error) => {
  //         console.error('Error deleting product', error);
  //         // alert('❌ Failed to delete product');
  //       this.toastr.error('Failed to delete product', 'Error');
  //       },
  //     });
  //   }
  // }
 deleteProduct(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.toastr.success('Product deleted successfully!', 'Success');
            this.productDeleted.emit(id);
          },
          error: (error) => {
            console.error('Error deleting product', error);
            this.toastr.error('Failed to delete product', 'Error');
          }
        });
      }
    });
  }
}
