import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../../services/brand.service';
import { Input } from '@angular/core';



@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  categoryName: string = '';
  message: string = '';
  isError: boolean = false;

  @Output() close = new EventEmitter<boolean>();
  @Input() type: 'category' | 'brand' = 'category';

  constructor(private categoryService: CategoryService,
              private brandService: BrandService
  ) {}
  save() {
    if (!this.categoryName.trim()) {
      alert(`${this.type} name cannot be empty`);
      return;
    }

    const newItem = { name: this.categoryName };

    const request = this.type === 'category'
      ? this.categoryService.addCategory(newItem)
      : this.brandService.addBrand(newItem);

    request.subscribe({
      next: () => {
        // alert(`✅ ${this.type === 'category' ? 'Category' : 'Brand'} added successfully`);
        // this.close.emit(true);
        this.message = `✅ ${this.type.charAt(0).toUpperCase() + this.type.slice(1)} added successfully`;
        this.isError = false;
        this.categoryName = ''; // Clear input field
        setTimeout(() => this.close.emit(true), 2000); // Close modal after 2 seconds
      },
      error: (err) => {
        if (err.status === 400 && err.error?.includes('already exists')){
           this.message = `❌ This ${this.type} already exists.`;
          this.isError = true;
          setTimeout(() => this.message = '', 5000); // Clear message after 5 seconds
        }
        else{
          this.message = `❌ Failed to add ${this.type}. Please try again later.`;
          this.isError = true;
          setTimeout(() => this.message = '', 5000); // Clear message after 5 seconds
        }
      }
    });
  }

  closeModal() {
    this.close.emit(false);
  }
}
