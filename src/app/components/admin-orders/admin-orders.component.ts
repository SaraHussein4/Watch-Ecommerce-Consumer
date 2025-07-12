import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderOverview } from '../../models/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
  imports: [CommonModule, FormsModule, DatePipe]
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderOverview[] = [];
  statuses: string[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders(this.page, this.pageSize).subscribe({
      next: (res) => {
        console.log(res)
        this.orders = res.orders;
        this.totalCount = res.totalCount;

        console.log(this.totalCount)
        console.log('Orders loaded successfully:', this.orders);
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
      }
    });
  }

  updateOrder(order: OrderOverview) {
    this.orderService.updateOrder(order).subscribe({
      next: (response) => {
        console.log('Order updated successfully:', response);
      },
      error: (err) => {
        console.error('Failed to update order:', err);
      }
    });
  }


  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadOrders();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
