import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/models-payment/payment';
import { PaymentItems } from '../../models/models-payment/payment-items';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-payment-component',
  imports: [CommonModule],
  templateUrl: './payment-component.component.html',
  styleUrl: './payment-component.component.css',
})
export class PaymentComponentComponent implements OnInit {
  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}
  Data!: Payment;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const basketId = params['id'];
      this.getPaymentData(basketId);
    });
  }
  // '8b93e183-9489-4bec-8cfe-18e0d577f55e';

  getPaymentData(basketId: string) {
    this.paymentService.getPayment(basketId).subscribe({
      next: (res: Payment) => {
        this.Data = res;
        console.log('Payment successful:', res.id);
      },
      error: (error) => {
        console.error('Payment failed:', error);
      },
    });
  }
}
