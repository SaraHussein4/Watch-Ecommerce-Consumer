import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/Customer';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-Customers',
  templateUrl: './Customers.component.html',
  styleUrls: ['./Customers.component.css'],
  imports: [CommonModule, NgxSkeletonLoaderModule]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  isLoading: boolean = false;
  skeletonItems = Array(5).fill(0); // For skeleton loader

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.customers = data.customers;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadCustomers();
  }

  get pageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.pageSize)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}