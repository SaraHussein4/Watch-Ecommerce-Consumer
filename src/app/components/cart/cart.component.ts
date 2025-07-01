import { Component ,OnInit} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerBasket ,CartItem} from '../../models/cart';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

 basket: CustomerBasket | null = null;
  userId:string | null = null;

 
  constructor(private cartService: CartService,private authService: AuthService) {
   
  }

   loadBasket() {
    if (!this.userId) return;

    this.cartService.getBasket(this.userId).subscribe({
      next: (basket) => {
        basket.items.forEach(item => {
          if (!item.quantity || item.quantity < 1) item.quantity = 1;
        });
        this.basket = basket;
      },
      error: (err) => console.error(err)
    });
  }
removeBasket() {
  if (!this.userId) return;
    this.cartService.deleteBasket(this.userId).subscribe({
      next: () => this.basket = null,
      error: (err) => console.error(err)
    });
  }

  updateQuantity(item: CartItem, delta: number) {
    item.quantity += delta;
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    this.updateBasket();
  }
    updateBasket() {
    if (!this.basket) return;
    this.cartService.updateBasket(this.basket.items).subscribe({
      next: (updated) => this.basket = updated,
      error: (err) => console.error(err)
    });
  }
 getTotal() {
    return this.basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  }

  ngOnInit(): void {
     this.userId = this.authService.getUserId();

    if (this.userId) {
      this.loadBasket();
    } else {
      console.error('User not logged in');
      
    }
 }
 removeItem(item: CartItem) {
  if (!item) return;

  this.cartService.removeItem(item.id).subscribe({
    next: updatedBasket => {
      this.basket = updatedBasket;
      if (this.basket.items.length === 0) {
        this.basket = null; 
      }
    },
    error: err => console.error('Failed to remove item:', err)
  });
}
}
