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
import { increaseFavouriteCounter } from '../../Store/FavouriteCounter.Action';
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

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private favouriteService: FavouriteService,
    private store: Store<{ favouriteCounter: number }>
  ) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.productId = id;
      this.loadProduct();
    });
  }


  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.mainImage = data.images[0].url;
        this.selectedColor = data.colors[0];
        this.selectedSize = data.sizes[0];

        console.log('Product loaded:', this.product);
        console.log(this.selectedColor);
        console.log(this.selectedSize);
      },
      error: (err) => {
        console.error('Failed to load product:', err);
      }
    });
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
      },
      error: (err) => {
        console.error('Failed to add product to favourites:', err);
      }
    });
  }

  addToCart() {
    console.log(this.product);

    const cartItem: CartItem[] = [{
      id: this.product.id,
      name: this.product.name,
      pictureUrl: this.product.images[0].url,
      price: this.product.price,
      category: this.product.category.name,
      brand: this.product.productBrand.name,
      quantity: this.quantity
    }];

    this.productService.addProductToCart(cartItem).subscribe({
      next: (response) => {
        console.log('Product added to cart successfully:', response);
        
      },
      error: (err) => {
        console.error('Failed to add product to cart:', err);
      }
    });

    console.log('Added to cart:', cartItem);
  }
}
