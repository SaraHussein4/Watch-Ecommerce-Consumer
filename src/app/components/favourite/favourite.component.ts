import { Component, OnInit } from '@angular/core';
import { FavouriteService } from '../../services/favourite.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { decreaseFavouriteCounter } from '../../Store/FavouriteCounter.action';
import { ProductCardComponent } from '../Product-Card/Product-Card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../confirmDelete/confirmDelete.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
  imports: [CommonModule]
})
export class FavouriteComponent implements OnInit {
  products: Product[] = []; // Adjust the type as per your model
  constructor(
    private favouriteService: FavouriteService,
    private router: Router,
    private store: Store<{ favouriteCounter: number }>,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {
    this.loadFavouriteItems();
  }

  loadFavouriteItems() {
    this.favouriteService.getFavourites().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        console.log(data)
      },
      error: (error) => {
        console.error('Error fetching favourite items:', error);
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
        this.store.dispatch(decreaseFavouriteCounter()); // Dispatch an action to decrease the counter
        this.favouriteService.DeleteFromFavourite(productId).subscribe({
          next: () => {
            console.log(";akd;flakd;fkd;flkdss;flkda");
            this.toastr.success('Product deleted successfully!', 'Success');
            this.loadFavouriteItems();
          },
          error: (error) => {
            this.toastr.error('Failed to delete product', 'Error');
            console.log(error)
            
          }
        });
      }
    });
  }

  getPrimaryImage(product: Product) {
    const img = product.images?.find(img => img.isPrimary);
    if (!img) return null;
    // If the URL is already absolute, return as is
    if (img.url.startsWith('http')) return img;
    // Otherwise, prepend your backend base URL
    return { ...img, url: img.url.includes('/Images') ? `https://localhost:7071${img.url}` : `https://localhost:7071/images/${img.url}` };
  }

  showDetails(id: any) {
    console.log("Product ID:", id);
    this.router.navigateByUrl(`/product/${id}`);
  }

}

