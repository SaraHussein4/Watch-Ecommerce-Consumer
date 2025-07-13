import { CurrencyPipe } from '@angular/common';
import { Component, Input, input, OnInit, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmDeleteComponent } from '../confirmDelete/confirmDelete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal,

  ) { }

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
    if (this.authService.isUser()) {
      this.routre.navigateByUrl(`/product/${id}`);
    }
    else {
      this.routre.navigateByUrl(`/login`)
    }
  }

  editProduct(id: any) {

    console.log('Edit Product ID:', id);
    this.routre.navigateByUrl(`/products/edit/${id}`);

    this.routre.navigateByUrl(`/admin/products/edit/${id}`);

  }
  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showSuccessMessage("Product deleted successfully")

        this.productDeleted.emit(id);
      },
      error: (error) => {
        console.error('Error deleting product', error);
        this.showErrorMessage("Failed to delete product")
      },
    });
  }

  confirmDelete(productId: number): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      centered: true
    });
    modalRef.componentInstance.title = 'Confirm Delete';
    modalRef.componentInstance.message = 'Are you sure you want to delete this product?';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteProduct(productId);
      }
    }).catch(() => { });
  }




    private showSuccessMessage(message: string) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 2000);
  }
  private showErrorMessage(message: string) {
    // Create a temporary error message element
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #dc3545;
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 2000);
  }

}
