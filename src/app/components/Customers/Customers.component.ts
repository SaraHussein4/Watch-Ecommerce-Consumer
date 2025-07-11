import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/Customer';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-Customers',
  templateUrl: './Customers.component.html',
  styleUrls: ['./Customers.component.css'],
  imports: [CommonModule]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.customers = data.customers;
        this.totalCount = data.totalCount;
        console.log(data);
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
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

