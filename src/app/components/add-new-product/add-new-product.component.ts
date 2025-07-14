import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedComponentsService } from '../../services/sharedComponents.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    RouterModule, AddCategoryComponent,
    MultiSelectModule],
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css'],
  encapsulation: ViewEncapsulation.None,
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
  colorOptions = [
    { name: 'Red', value: 'Red' },
    { name: 'Blue', value: 'Blue' },
    { name: 'Green', value: 'Green' },
    { name: 'Black', value: 'Black' },
    { name: 'White', value: 'White' },
    { name: 'Silver', value: 'Silver' },
    { name: 'Gold', value:'Gold' },
    { name: 'Brown', value:'Brown' },
    { name: 'Rose Gold', value:'Rose Gold' },
  ];

  sizeOptions = [
    { name: '26mm', value: '26mm' },
    { name: '28mm', value: '28mm' },
    { name: '30mm', value: '30mm' },
    { name: '32mm', value: '32mm' },
    { name: '34mm', value: '34mm' },
    { name: '36mm', value: '36mm' },
    { name: '38mm', value: '38mm' },
    { name: '40mm', value: '40mm' },
    { name: '42mm', value: '42mm' },
    { name: '44mm', value: '44mm' },
    { name: '46mm', value: '46mm' },
    { name: '48mm', value: '48mm' },
  ];
  constructor(
    private fb: FormBuilder,
    private productService: ProductAdminService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private sharedComponent: SharedComponentsService
  ) { }

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
    formData.append('Colors', (formValue.colors || []).join(','));
    formData.append('Sizes', (formValue.sizes || []).join(','));


    // Add images
    for (let file of this.selectedImages) {
        // const cleanedFileName = file.name.trim().replace(/\s+/g, '_');
        // const safeFile = new File([file], cleanedFileName, { type: file.type });
        // formData.append('Images', safeFile, safeFile.name);
      formData.append('Images', file, file.name);
    }

    this.productService.addProduct(formData).subscribe({
      next: () => {
        // this.sharedComponent.showSuccessMessage('Product added successfully');
        this.toastr.success('Product added successfully!', 'Success');
        this.router.navigate(['/admin/products']).then(() => {
         window.scrollTo({ top: 0, behavior: 'smooth' });
});
      },
      error: err => {
        console.error('Error adding product:', err);
        // this.sharedComponent.showErrorMessage('❌ Failed to add product');
        this.toastr.error('Failed to add product', 'Error');
      }
    });

  }

}
