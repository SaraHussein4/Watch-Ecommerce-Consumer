import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface DeliveryOrder {
  id: number;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-delivery-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})
export class DeliveryOrdersComponent implements OnInit {
  orders: DeliveryOrder[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;
  page: number = 1;
  pageSize: number = 10;

  constructor(private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getDeliveryOrders(this.page, this.pageSize).subscribe({
      next: (res) => {
        // Set default status to 'Pending' if missing
        this.orders = res.orders.map(order => ({
          ...order,
          status: !order.status || order.status.trim() === '' ? 'Pending' : order.status
        }));
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  updateStatus(order: DeliveryOrder, newStatus: string) {
    order.status = newStatus;
    this.orderService.updateOrder(order).subscribe({
      next: (response) => {
        this.toastr.success('Order updated successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error('Failed to update order', 'Error');
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.fetchOrders();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
} 