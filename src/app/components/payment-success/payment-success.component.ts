import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
    sessionId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

     this.sessionId = this.route.snapshot.queryParamMap.get('sessionId');

    
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }

}
