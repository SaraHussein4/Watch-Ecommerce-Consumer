import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart';
import { FavouriteComponent } from '../favourite/favourite.component';
import { FavouriteService } from '../../services/favourite.service';
import { Store } from '@ngrx/store';
import { increaseFavouriteCounter } from '../../Store/FavouriteCounter.action';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { SharedComponentsService } from '../../services/sharedComponents.service';
@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  product!: Product;
  productId!: number;
  quantity: number = 1;
  mainImage: string = '';
  selectedColor: string = '';
  selectedSize: string = '';
  animate = false;


  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private favouriteService: FavouriteService,
    private store: Store<{ favouriteCounter: number }>,
    private cartService: CartService,
    private authService: AuthService,
    private sharedComponent: SharedComponentsService
  ) {
  }


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
    this.productService.getProductById(this.productId).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.mainImage = data.images[0].url;
        this.selectedColor = data.colors[0];
        this.selectedSize = data.sizes[0];
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

        console.log('Product loaded:', this.product);
        console.log(this.selectedColor);
        console.log(this.selectedSize);
      },
      error: (err) => {
        console.error('Failed to load product:', err);
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    console.log('Processing image URL:', imageUrl);

    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    const processedUrl = `https://localhost:7071${imageUrl}`;
    return processedUrl;
  }

  changeMainImage(imgUrl: string): void {
    console.log("a;lkdfj");
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
    this.favouriteService.addToFavourite(this.product.id).subscribe({
      next: (response) => {
        console.log('Product added to favourites successfully:', response);
        this.store.dispatch(increaseFavouriteCounter()); // Dispatch an action to increase the counter

        this.sharedComponent.showSuccessMessage("Product added to favourites successfully")
      },
      error: (err) => {
        console.error('Failed to add product to favourites:', err);

        this.sharedComponent.showErrorMessage(
          'This product is already in your favorites!',
        );
      }
    });
  }

  addToCart() {

    if (this.product.quantity == 0) {
      this.sharedComponent.showErrorMessage("This product is currently out of stock.")
    }
    else {

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
          console.log('Product added to cart successfully:', response);
          const userId = this.authService.getUserId();
          if (userId) {
            this.cartService.getBasket(userId).subscribe({
              next: (basket) => {
                console.log('Cart updated, new basket:', basket);
                console.log('Cart item count updated to:', basket.items.reduce((sum, item) => sum + item.quantity, 0));
              },
              error: (err) => {
                console.error('Failed to refresh cart:', err);
              }
            });
          } else {
            console.warn('User not logged in, cannot update cart counter');
          }

          this.sharedComponent.showSuccessMessage('product added to cart successfully');
        },
        error: (err) => {
          console.error('Failed to add product to cart:', err);
          this.sharedComponent.showErrorMessage('Failed to add product to cart');

        }
      });

      console.log('Added to cart:', cartItem);
    }
  }


}


