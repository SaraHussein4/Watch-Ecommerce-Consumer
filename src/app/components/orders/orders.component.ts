import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderOverview } from '../../models/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, FormsModule, DatePipe, NgxSkeletonLoaderModule]

})
export class OrdersComponent implements OnInit {
  orders: OrderOverview[] = [];
  statuses: string[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  isLoading: boolean = false;
  skeletonItems = Array(5).fill(0); // For skeleton loader

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders(this.page, this.pageSize).subscribe({
      next: (res) => {
        console.log(res)
        this.orders = res.orders;
        this.totalCount = res.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.isLoading = false;
      }
    });
  }

  updateOrder(order: OrderOverview) {
    this.isLoading = true;
    this.orderService.updateOrder(order).subscribe({
      next: (response) => {
        console.log('Order updated successfully:', response);
        this.isLoading = false;
        this.loadOrders(); // Refresh orders after update
      },
      error: (err) => {
        console.error('Failed to update order:', err);
        this.isLoading = false;
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
