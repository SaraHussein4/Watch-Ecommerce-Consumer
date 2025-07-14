import { Component, OnInit } from '@angular/core';
import { FavouriteService } from '../../services/favourite.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { decreaseFavouriteCounter } from '../../Store/FavouriteCounter.action';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../confirmDelete/confirmDelete.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule]
})
export class FavouriteComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  skeletonItems = Array(6).fill(0);

  constructor(
    private favouriteService: FavouriteService,
    private router: Router,
    private store: Store<{ favouriteCounter: number }>,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadFavouriteItems();
  }

  loadFavouriteItems() {
    this.isLoading = true;
    this.favouriteService.getFavourites().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching favourite items:', error);
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.products = this.products.filter(p => p.id !== productId);
        this.store.dispatch(decreaseFavouriteCounter());
        this.favouriteService.DeleteFromFavourite(productId).subscribe({
          next: () => {
            this.toastr.success('Product deleted successfully!', 'Success');
            this.loadFavouriteItems();
          },
          error: (error) => {
            this.toastr.error('Failed to delete product', 'Error');
          }
        });
      }
    });
  }

  getPrimaryImage(product: Product) {
    const img = product.images?.find(img => img.isPrimary);
    if (!img) return null;
    if (img.url.startsWith('http')) return img;
    return {
      ...img,
      url: img.url.includes('/Images')
        ? `https://localhost:7071${img.url}`
        : `https://localhost:7071/images/${img.url}`
    };
  }

  showDetails(id: any) {
    this.router.navigateByUrl(`/product/${id}`);
  }
}
