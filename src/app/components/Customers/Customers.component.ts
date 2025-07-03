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
  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers(); 
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        console.log(data);
      },
      error: (err: any) => { 
        console.error('Error fetching customers:', err);
      }
    });
  }
}

