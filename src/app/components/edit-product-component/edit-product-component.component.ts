import { Product } from './../../models/product.model';
import { Brand } from './../../models/brand.model';
import { Category } from './../../models/category.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
export interface Image {
  id: number;
  url: string;
  isPrimary: boolean;
  productId: number;
}
@Component({
  selector: 'app-edit-product-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product-component.component.html',
  styleUrl: './edit-product-component.component.css',
})
export class EditProductComponentComponent implements OnInit {
  editProductForm!: FormGroup;
  productId!: number;
  availableColors: string[] = [
    'Red',
    'Blue',
    'Green',
    'Black',
    'White',
    'Silver',
  ];
  availableSizes: string[] = [
    '26mm',
    '28mm',
    '30mm',
    '32mm',
    '34mm',
    '36mm',
    '38mm',
    '40mm',
    '42mm',
    '44mm',
    '46mm',
    '48mm',
  ];
  //interface for images
  images: Image[] = [];
  selectedColors: string[] = [];
  selectSizes: string[] = [];
  categories: any[] = [];
  brands: any[] = [];
  product: any;
  selectImage: File[] = [];
  genderCat: any[] = [];
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private rout: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.productId = Number(this.rout.snapshot.paramMap.get('id'));
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      status: [''],
      genderCategory: [0, Validators.required],
      waterResistance: [false],
      warrentyYears: [0],
      colors: [],
      sizes: [],
      categoryId: [0, Validators.required],
      productBrandId: [0, Validators.required],
      images: [],
    });
    this.loadProduct();
    this.loadCategories();
    this.loadBrands();
    // this.loadGenderCategories();
  }
  //method color
  toggleColor(color: string) {
    if (this.selectedColors.includes(color)) {
      //if not found delete it
      this.selectedColors = this.selectedColors.filter((c) => c !== color);
    } else {
      this.selectedColors.push(color);
    }
    this.editProductForm.patchValue({ colors: this.selectedColors });
  }
  //method size
  toggleSize(size: string) {
    if (this.selectSizes.includes(size)) {
      this.selectSizes = this.selectSizes.filter((c) => c !== size);
    } else {
      this.selectSizes.push(size);
    }
    this.editProductForm.patchValue({ sizes: this.selectSizes });
  }
  //method read file
  onImageSelected(event: any) {
    if (event.target.files) {
      this.selectImage = Array.from(event.target.files);
      console.log('Selected Images:', this.selectImage);
    }
  }
  //method upload photo
  uploadImages() {
    if (this.selectImage.length > 0) {
      const formData = new FormData();
      formData.append('isPrimary', 'false');
      formData.append('ProductId', this.product.id.toString());
      for (let img of this.selectImage) {
        formData.append('Images', img);
      }

      this.productService.addImage(formData).subscribe({
        next: (res: Image) => {
          console.log('Uploaded successfully', res);
          console.log('Image ID:', res.id);
          console.log('Image URL:', res.url);
          this.loadProduct();
          this.selectImage = [];
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.log('No images selected');
    }
  }
  deleteImage(imageId: number) {
    // console.log('Deleting image with ID:', imageId);
    // alert('Deleting image with ID: ' + imageId);
    this.productService.deleteImage(imageId).subscribe({
      next: (res) => {
        console.log('Image deleted successfully', res);
        this.product.images = this.product.images.filter(
          (img: Image) => img.id !== imageId
        );
        // Reload the product to reflect changes
        this.loadProduct();
      },
      error: (err) => {
        console.log('Error deleting image:', err);
      },
    });
  }
  //method with apis
  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = res;
        this.editProductForm.patchValue(res);
        this.selectedColors = res.colors || [];
        this.selectSizes = res.sizes || [];
        // console.log('Loaded genderCategory:', res.genderCategory);
        // alert('Loaded genderCategory: ' + res.genderCategory);
        this.editProductForm.patchValue({
          colors: this.selectedColors,
          sizes: this.selectSizes,

          genderCategory: res.genderCategory,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        console.log('Categories:', this.categories);
      },
      error: (err) => {
        console.log('Error loading categories:', err);
      },
    });
  }
  loadGenderCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.genderCat = res;
        console.log('Gender Categories:', this.genderCat);
      },
      error: (err) => {
        console.log('Error loading gender categories:', err);
      },
    });
  }
  loadBrands() {
    this.productService.getBrands().subscribe({
      next: (res) => {
        this.brands = res;
        console.log('Brand:', this.brands);
      },
      error: (err) => {
        console.log('Error loading Brands:', err);
      },
    });
  }
  onSubmit() {
    let updateProduct = this.editProductForm.value;
    updateProduct.genderCategory = Number(updateProduct.genderCategory);

    console.log(updateProduct);
    // if (typeof updateProduct.colors === 'string') {
    //   updateProduct.colors = updateProduct.colors
    //     .split(',')
    //     .map((c: string) => c.trim());
    // }

    // if (typeof updateProduct.sizes === 'string') {
    //   updateProduct.sizes = updateProduct.sizes
    //     .split(',')
    //     .map((s: string) => s.trim());
    // }
    updateProduct.colors = this.selectedColors;
    updateProduct.sizes = this.selectSizes;
    if (updateProduct.genderCategory === 'Male') {
      updateProduct.genderCategory = 0;
    } else if (updateProduct.genderCategory === 'Female') {
      updateProduct.genderCategory = 1;
    }

    updateProduct.id = this.productId;
    // updateProduct.colors = this.editProductForm.value.colors;
    // updateProduct.sizes = this.editProductForm.value.sizes;
    console.log('Update Product Body:', updateProduct);

    this.productService.updateProduct(this.productId, updateProduct).subscribe({
      next: (res) => {
        alert('Product updated successfully!');
        console.log('Product updated:', res);
        this.loadProduct();
      },
      error: (err) => {
        alert('Error updating product!');
        console.log(err);
      },
    });
  }
  onCancel() {
    window.history.back();
  }
}
