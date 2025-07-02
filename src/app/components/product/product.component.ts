import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
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
    private route: ActivatedRoute
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

}
