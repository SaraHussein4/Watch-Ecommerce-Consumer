import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeliveryService } from '../../services/delivery.service';
import { OrderService } from '../../services/order.service';
import { Delivery } from '../../models/delivery.model';
import { Governorate } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './delivery-edit.component.html',
  styleUrls: ['./delivery-edit.component.css']
})
export class DeliveryEditComponent implements OnInit {
  editForm: FormGroup;
  loading = false;
  error: string | null = null;
  governorates: Governorate[] = [];
  deliveryId: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      governorateId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchGovernorates();
    this.fetchDelivery();
  }

  fetchGovernorates() {
    this.orderService.getAllGovernorates().subscribe({
      next: (data) => this.governorates = data,
      error: () => this.governorates = []
    });
  }

  fetchDelivery() {
    this.loading = true;
    this.deliveryService.getAll().subscribe({
      next: (deliveries) => {
        const delivery = deliveries.find(d => d.id === this.deliveryId);
        if (delivery) {
          this.editForm.patchValue({
            name: delivery.name,
            email: delivery.email,
            phoneNumber: delivery.phoneNumber,
            governorateId: delivery.governorateId
          });
        } else {
          this.error = 'Delivery not found';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load delivery';
        this.loading = false;
      }
    });
  }

  submitEdit() {
    if (this.editForm.invalid) return;
    this.loading = true;
    this.deliveryService.editDelivery(this.deliveryId, this.editForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
        this.router.navigate(['/admin/deliveries']);
      },
      error: () => {
        this.error = 'Failed to update delivery';
        this.loading = false;
      }
    });
  }
} 