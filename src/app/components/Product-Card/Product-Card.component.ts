import { CurrencyPipe } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-Product-Card',
  templateUrl: './Product-Card.component.html',
  styleUrls: ['./Product-Card.component.css'],
  providers: [CurrencyPipe],
  imports: [CommonModule]
})
export class ProductCardComponent implements OnInit {

  @Input() product: any; // Replace 'any' with your actual product type
  constructor(private routre: Router) { }

  ngOnInit() {
  }

  getPrimaryImage(product: Product) {
    const img = product.images?.find(img => img.isPrimary);
    if (!img) return null;
    // If the URL is already absolute, return as is
    if (img.url.startsWith('http')) return img;
    // Otherwise, prepend your backend base URL
    return { ...img, url: `https://localhost:7071${img.url}` };
  }


  showDetails(id: any) {
    console.log("Product ID:", id);
    this.routre.navigateByUrl(`/product/${id}`);
  }
}
