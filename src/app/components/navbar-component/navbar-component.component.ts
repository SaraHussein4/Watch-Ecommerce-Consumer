import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Store } from '@ngrx/store';
import { FavouriteService } from '../../services/favourite.service';
import { initFavouriteCounter } from '../../Store/FavouriteCounter.action';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.css']
})
export class NavbarComponentComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  cartItemCount = 0;
  favouriteCount: Observable<number>;

  private authSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private favouriteService: FavouriteService,
    private store: Store<{ favouriteCounter: number }>,
  ) {

    this.favouriteCount = this.store.select(state => state.favouriteCounter);
  }

  initialCount:number = 0;
  ngOnInit() {
     this.favouriteService.getCount().subscribe({
      next: (response) => {
        this.initialCount = response;
        this.store.dispatch(initFavouriteCounter({ initialCount: this.initialCount }));
        console.log('Product added to cart successfully:', response);

      },
      error: (err) => {
        console.error('Failed to add product to cart:', err);
      }
    });



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
