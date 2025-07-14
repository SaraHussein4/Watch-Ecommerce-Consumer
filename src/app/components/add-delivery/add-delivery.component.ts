import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DeliveryService } from '../../services/delivery.service';
import { OrderService } from '../../services/order.service';
import { Governorate } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.css']
})
export class AddDeliveryComponent implements OnInit {
  addForm: FormGroup;
  governorates: Governorate[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      buildingNumber: [0, Validators.required],
      street: ['', Validators.required],
      state: ['', Validators.required],
      isDefault: [true],
      governorateId: [null, Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.fetchGovernorates();
  }

  fetchGovernorates() {
    this.orderService.getAllGovernorates().subscribe({
      next: (data) => this.governorates = data,
      error: () => this.governorates = []
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  submitAdd() {
    if (this.addForm.invalid) return;
    this.loading = true;
    this.deliveryService.addDelivery(this.addForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
        this.router.navigate(['/admin/deliveries']);
      },
      error: () => {
        this.error = 'Failed to add delivery';
        this.loading = false;
      }
    });
  }
} 