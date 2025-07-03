import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerBasket, CartItem } from '../../models/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { DeliveryMethod, Governorate } from '../../models/order';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  basket: CustomerBasket | null = null;
  userId: string | null = null;
  deliveryCost: number = 0;
 governorates: Governorate[] = [];
  deliveryMethods: DeliveryMethod[] = [];
  checkoutData = {
    shippingAddress: {
      firstName: '',
      lastName: '',
      city: '',
      street: '',
      governorateId: 0
    },
    deliveryMethodId: 0
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
     this.loadGovernorates();
    this.loadDeliveryMethods();
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.loadBasket();
    } else {
      console.error('User not logged in');
    }
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

  submitOrder(checkoutForm: NgForm) {
    if (!this.basket) return;
     if (checkoutForm.invalid) {
    Object.values(checkoutForm.controls).forEach(control => {
      control.markAsTouched();
    });
    alert('Please fill all required fields.');
    return;
  }
     if (
    this.checkoutData.shippingAddress.governorateId === 0 ||
    this.checkoutData.deliveryMethodId === 0
  ) {
    alert('Please select a governorate and delivery method.');
    return;
  }

    this.orderService.createOrder(this.checkoutData).subscribe({
      next: (res) => {
        console.log('Order placed:', res);
        this.removeBasket();

        const modalElement = document.getElementById('checkoutModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.hide();
        }

        alert('Order submitted successfully!');
      },
      error: (err) => console.error('Order failed:', err)
    });
  }
   loadGovernorates() {
    this.orderService.getAllGovernorates().subscribe({
      next: (res) => this.governorates = res,
      error: (err) => console.error('Failed to load governorates', err)
    });
  }

  loadDeliveryMethods() {
    this.orderService.getAllDeliveryMethods().subscribe({
      next: (res) => this.deliveryMethods = res,
      error: (err) => console.error('Failed to load delivery methods', err)
    });
  }

  onShippingOptionChanged() {
  const govId = this.checkoutData.shippingAddress.governorateId;
  const methodId = this.checkoutData.deliveryMethodId;

  if (govId && methodId) {
    this.orderService.getGovernorateDeliveryCost(govId, methodId).subscribe({
      next: (cost) => this.deliveryCost = cost,
      error: (err) => {
        console.error('Failed to fetch delivery cost', err);
        this.deliveryCost = 0;
      }
    });
  } else {
    this.deliveryCost = 0;
  }
}

}
