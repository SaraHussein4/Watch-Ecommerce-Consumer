import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart';
import { FavouriteService } from '../../services/favourite.service';
import { Store } from '@ngrx/store';
import { increaseFavouriteCounter } from '../../Store/FavouriteCounter.action';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { SharedComponentsService } from '../../services/sharedComponents.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerService, NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-product',
  imports: [CommonModule, NgxSkeletonLoaderModule, NgxSpinnerComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product!: Product;
  productId!: number;
  quantity: number = 1;
  mainImage: string = '';
  selectedColor: string = '';
  selectedSize: string = '';
  animate = false;
  
  // Loading states
  isLoading = true;
  isAddingToCart = false;
  isAddingToFavorites = false;
  skeletonItems = Array(4).fill(0);

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private favouriteService: FavouriteService,
    private store: Store<{ favouriteCounter: number }>,
    private cartService: CartService,
    private authService: AuthService,
    private sharedComponent: SharedComponentsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productId = id;
      this.loadProduct();
    });

    setTimeout(() => {
      this.animate = true;
    }, 100);
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (data: Product) => {
        this.product = data;
        
        if (data.images && data.images.length > 0) {
          this.mainImage = this.getImageUrl(data.images[0].url);
        } else {
          console.warn('No images found for product');
          this.mainImage = '';
        }

        this.selectedColor = data.colors && data.colors.length > 0 ? data.colors[0] : '';
        this.selectedSize = data.sizes && data.sizes.length > 0 ? data.sizes[0] : '';

        if (this.product.quantity == 0) {
          this.quantity = 0;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.isLoading = false;
        this.sharedComponent.showErrorMessage('Failed to load product details');
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://localhost:7071${imageUrl}`;
  }

  changeMainImage(imgUrl: string): void {
    this.mainImage = imgUrl;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToFavourite() {
    if (this.isAddingToFavorites) return;
    
    this.isAddingToFavorites = true;
    this.spinner.show('favoriteSpinner');

    this.favouriteService.addToFavourite(this.product.id).subscribe({
      next: (response) => {
        this.store.dispatch(increaseFavouriteCounter());
        this.sharedComponent.showSuccessMessage("Product added to favorites");
        this.isAddingToFavorites = false;
        this.spinner.hide('favoriteSpinner');
      },
      error: (err) => {
        this.sharedComponent.showErrorMessage('This product is already in your favorites!');
        this.isAddingToFavorites = false;
        this.spinner.hide('favoriteSpinner');
      }
    });
  }

  addToCart() {
    if (this.product.quantity == 0) {
      this.sharedComponent.showErrorMessage("This product is currently out of stock.");
      return;
    }

    if (this.isAddingToCart) return;
    
    this.isAddingToCart = true;
    this.spinner.show('cartSpinner');

    const cartItem: CartItem[] = [{
      id: this.product.id,
      name: this.product.name,
      pictureUrl: this.product.images[0].url,
      price: this.product.price,
      category: this.product.category.name,
      brand: this.product.productBrand.name,
      quantity: this.quantity,
      productQuantity: this.product.quantity
    }];

    this.productService.addProductToCart(cartItem).subscribe({
      next: (response) => {
        const userId = this.authService.getUserId();
        if (userId) {
          this.cartService.getBasket(userId).subscribe({
            next: (basket) => {
              console.log('Cart updated:', basket);
            },
            error: (err) => {
              console.error('Failed to refresh cart:', err);
            }
          });
        }
        this.sharedComponent.showSuccessMessage('Product added to cart');
        this.isAddingToCart = false;
        this.spinner.hide('cartSpinner');
      },
      error: (err) => {
        this.sharedComponent.showErrorMessage('Failed to add product to cart');
        this.isAddingToCart = false;
        this.spinner.hide('cartSpinner');
      }
    });
  }
}