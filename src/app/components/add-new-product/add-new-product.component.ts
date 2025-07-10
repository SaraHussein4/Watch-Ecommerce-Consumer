import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { Brand } from '../../models/brand.model';
import { ProductAdminService } from '../../services/product-admin.service';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddCategoryComponent } from '../add-category/add-category.component';
// import { SideBarComponent } from "../admin-side-bar/side-bar.component";

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AddCategoryComponent],
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css'],
})
export class AddNewProductComponent implements OnInit {

  productForm!: FormGroup;
  categories: Category[] = [];
  brands: Brand[] = [];
  genders: string[] = ['Male', 'Female'];
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  isCategoryModalOpen = false;
  isBrandModalOpen = false;


  constructor(
    private fb: FormBuilder,
    private productService: ProductAdminService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadBrands();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      // status: ['', Validators.required],
      genderCategory: ['', Validators.required],
      waterResistance: [false],

      warrentyYears: [1, [Validators.min(0)]],
      colors: ['', Validators.required], // comma-separated
      sizes: ['', Validators.required], // comma-separated

      productBrandId: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: data => this.categories = data,
      error: err => console.error('Error loading categories:', err)
    });
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: data => this.brands = data,
      error: err => console.error('Error loading brands:', err)
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedImages = Array.from(input.files);
    this.imagePreviews = [];

    for (let file of this.selectedImages) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
}
  onCancel(): void {
    this.location.back(); // Go back to the previous page
  }

openCategoryModal() {
  this.isCategoryModalOpen = true;
}
openBrandModal() {
  this.isBrandModalOpen = true;
}
onCategoryModalClosed(refresh: boolean) {
  this.isCategoryModalOpen = false;
  if (refresh) this.loadCategories();
}
onBrandModalClosed(refresh: boolean) {
  this.isBrandModalOpen = false;
  if (refresh) this.loadBrands();
}


  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    const formValue = this.productForm.value;

    formData.append('Name', formValue.name);
    formData.append('Description', formValue.description ?? '');
    formData.append('Price', formValue.price.toString());
    formData.append('Quantity', formValue.quantity.toString());
    // formData.append('Status', formValue.status);
    formData.append('GenderCategory', formValue.genderCategory);
    formData.append('WaterResistance', formValue.waterResistance.toString());
    formData.append('warrentyYears', formValue.warrentyYears.toString());
    formData.append('productBrandId', formValue.productBrandId.toString());
    formData.append('categoryId', formValue.categoryId.toString());

    // Add multiple colors/sizes
    // formValue.colors.split(',').map((c: string) => c.trim()).forEach((c: string) => formData.append('Colors', c));
    // formValue.sizes.split(',').map((s: string) => s.trim()).forEach((s: string) => formData.append('Sizes', s));
    // formValue.colors.forEach((color: string) => formData.append('Colors', color));
    // formValue.sizes.forEach((size: string) => formData.append('Sizes', size));
    formData.append('Colors', formValue.colors.join(','));
    formData.append('Sizes', formValue.sizes.join(','));

    // Add images
    for (let file of this.selectedImages) {
      formData.append('Images', file, file.name);
    }

    this.productService.addProduct(formData).subscribe({
      next: () => {
        alert('✅ Product added successfully');
        this.router.navigate(['/admin/products']);
      },
      error: err => {
        console.error('Error adding product:', err);
        alert('❌ Failed to add product');
      }
    });

  }
}
