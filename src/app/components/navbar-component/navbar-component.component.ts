import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule,RouterLink , RouterLinkActive],
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.css']
})
export class NavbarComponentComponent implements OnInit, OnDestroy { 
  isLoggedIn = false;
  cartItemCount = 0;

  private authSub!: Subscription;
    private cartSub!: Subscription;

  constructor(private authService: AuthService,private router:Router,private cartService: CartService) {}

  ngOnInit() {
    this.authSub = this.authService.userData.subscribe(user => {
    this.isLoggedIn = !!user;

    if (this.isLoggedIn) {
      const userId = user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];      
      this.cartService.getBasket(userId).subscribe();
    }
  });
  this.cartSub = this.cartService.cartItemCount$.subscribe(count => {
    this.cartItemCount = count;
  });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  this.cartSub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}