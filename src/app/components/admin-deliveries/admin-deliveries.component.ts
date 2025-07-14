import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';
import { Delivery } from '../../models/delivery.model';
import { OrderService } from '../../services/order.service';
import { Governorate } from '../../models/order';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-deliveries',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './admin-deliveries.component.html',
  styleUrls: ['./admin-deliveries.component.css']
})
export class AdminDeliveriesComponent implements OnInit {
  deliveries: Delivery[] = [];
  loading = false;
  error: string | null = null;

  governorates: Governorate[] = [];

  constructor(
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchDeliveries();
    this.fetchGovernorates();
  }

  fetchDeliveries() {
    this.loading = true;
    this.error = null;
    this.deliveryService.getAll().subscribe({
      next: (data) => {
        this.deliveries = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load deliveries';
        this.loading = false;
      }
    });
  }

  fetchGovernorates() {
    this.orderService.getAllGovernorates().subscribe({
      next: (data) => {
        this.governorates = data;
      },
      error: () => {
        this.governorates = [];
      }
    });
  }

  deleteDelivery(id: string) {
    if (!confirm('Are you sure you want to delete this delivery?')) return;
    this.deliveryService.deleteDelivery(id).subscribe({
      next: () => {
        this.deliveries = this.deliveries.filter(d => d.id !== id);
      },
      error: () => {
        alert('Failed to delete delivery');
      }
    });
  }

}
