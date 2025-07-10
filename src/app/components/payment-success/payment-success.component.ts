import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',
  standalone: true,
  imports: [],
})
export class PaymentSuccessComponent implements OnInit {
  sessionId: string | null = null;
  message: string = 'Processing payment...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('sessionId');

    if (this.sessionId) {
      this.orderService.confirmPayment(this.sessionId).subscribe({
        next: () => {
          this.message = '✅ Payment confirmed successfully!';
        },
        error: (err) => {
          console.error('Payment confirmation failed:', err);
          this.message = '❌ Payment confirmation failed.';
        }
      });
    } else {
      this.message = '❌ No session ID provided.';
    }

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }
}
