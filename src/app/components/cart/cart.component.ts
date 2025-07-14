import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CustomerBasket, CartItem } from '../../models/cart';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { DeliveryMethod, Governorate } from '../../models/order';
import { RouterLink } from '@angular/router';

interface ExtendedCartItem extends CartItem {
  productQuantity: number;
}

interface ExtendedCustomerBasket extends CustomerBasket {
  items: ExtendedCartItem[];
}

interface CheckoutData {
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    street: string;
    governorateId: number;
    zipCode: string;
    phone: string;
  };
  deliveryMethodId: number;
  paymentMethod: string;
  basketId?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  isLoadingCart: boolean = false; // 👈 Add this
  basket: ExtendedCustomerBasket | null = null;
  userId: string | null = null;
  deliveryCost: number = 0;
  governorates: Governorate[] = [];
  deliveryMethods: DeliveryMethod[] = [];

  checkoutData: CheckoutData = {
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      street: '',
      governorateId: 0,
      zipCode: '',
      phone: ''
    },
    deliveryMethodId: 0,
    paymentMethod: 'cash'
  };

  showCustomAlert: boolean = false;
  customAlertMessage: string = '';

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
      console.error('User not logged in or userId is null.');
    }
  }

  loadBasket() {
    if (!this.userId) {
      console.warn('Cannot load basket: userId is null.');
      return;
    }
    this.isLoadingCart = true; // 👈 Start loading

    this.cartService.getBasket(this.userId).subscribe({
      next: (basket) => {
        basket.items.forEach(item => {
          if (!item.quantity || item.quantity < 1) item.quantity = 1;
          if (!('productQuantity' in item)) {
            (item as ExtendedCartItem).productQuantity = 999;
          }
        });
        this.basket = basket as ExtendedCustomerBasket;
        this.checkoutData.basketId = this.basket.id;
        this.onShippingOptionChanged();
        this.isLoadingCart = false; // 👈 Done

      },
      error: (err) => {
        console.error('Failed to load basket:', err);
        this.basket = null;
        this.isLoadingCart = false; // 👈 Done

      }
    });
  }

  removeBasket() {
    if (!this.userId) {
      console.warn('Cannot remove basket: userId is null.');
      return;
    }
    this.cartService.deleteBasket(this.userId).subscribe({
      next: () => {
        this.basket = null;
        this.deliveryCost = 0;
        this.showCustomAlertMessage('Your cart has been cleared successfully!');
      },
      error: (err) => console.error('Failed to delete basket:', err)
    });
  }

  updateQuantity(item: ExtendedCartItem, delta: number) {
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    if (newQuantity > item.productQuantity) {
      this.showCustomAlertMessage(`Cannot add more than available stock (${item.productQuantity}).`);
      return;
    }

    item.quantity = newQuantity;


    if (delta > 0) {
      this.cartService.addItemToBasket({ ...item, quantity: delta }).subscribe({
        next: updatedBasket => this.basket = updatedBasket as ExtendedCustomerBasket,
        error: err => {
          console.error('Failed to add item to basket:', err);
          item.quantity -= delta;
        }
      });
    } else {
      this.updateBasket();
    }
    this.onShippingOptionChanged();
  }

  updateBasket() {
    if (!this.basket || !this.basket.items) {
      console.warn('Cannot update basket: basket or items are null.');
      return;
    }
    this.cartService.updateBasket(this.basket.items).subscribe({
      next: (updated) => this.basket = updated as ExtendedCustomerBasket,
      error: (err) => console.error('Failed to update basket:', err)
    });
  }

  getSubtotal(): number {
    return this.basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.deliveryCost;
  }

  removeItem(item: ExtendedCartItem) {
    if (!item) {
      console.warn('Cannot remove item: item is null.');
      return;
    }

    this.cartService.removeItem(item.id).subscribe({
      next: updatedBasket => {
        this.basket = updatedBasket as ExtendedCustomerBasket;
        if (this.basket && this.basket.items.length === 0) {
          this.basket = null;
        }
        this.onShippingOptionChanged();
        this.showCustomAlertMessage('Item removed from cart.');
      },
      error: err => console.error('Failed to remove item:', err)
    });
  }

  submitOrder(checkoutForm: NgForm) {
    if (!this.basket || this.basket.items.length === 0) {
      this.showCustomAlertMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    Object.values(checkoutForm.controls).forEach(control => control.markAsTouched());

    if (checkoutForm.invalid) {
      this.showCustomAlertMessage('Please fill all required fields in the checkout form.');
      return;
    }


    if (this.checkoutData.shippingAddress.governorateId === 0) {
      this.showCustomAlertMessage('Please select a governorate.');
      return;
    }
    if (this.checkoutData.deliveryMethodId === 0) {
      this.showCustomAlertMessage('Please select a delivery method.');
      return;
    }

    this.checkoutData.basketId = this.basket.id;

    if (this.checkoutData.paymentMethod === 'card') {
      this.orderService.createStripeSession(this.checkoutData).subscribe({
        next: (res) => {
          window.location.href = res.url;
        },
        error: (err) => {
          console.error('Failed to create Stripe session:', err);
          this.showCustomAlertMessage('Payment processing failed. Please try again.');
        },
      });
    } else {
      this.orderService.createOrder(this.checkoutData).subscribe({
        next: (res) => {
          console.log('Order placed:', res);
          this.removeBasket();

          const modalElement = document.getElementById('checkoutModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
          this.showCustomAlertMessage('Your order has been placed successfully!');
        },
        error: (err) => {
          console.error('Order failed:', err);
          this.showCustomAlertMessage('Failed to place order. Please try again.');
        },
      });
    }
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

    if (govId && govId !== 0 && methodId && methodId !== 0) {
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

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://localhost:7071${imageUrl}`;
  }

  showCustomAlertMessage(message: string): void {
    this.customAlertMessage = message;
    this.showCustomAlert = true;
    setTimeout(() => {
      this.showCustomAlert = false;
      this.customAlertMessage = '';
    }, 5000);
  }

  closeCustomAlert(): void {
    this.showCustomAlert = false;
    this.customAlertMessage = '';
  }
  isConfirmButtonDisabled(form: NgForm): boolean {
    if (form.invalid) {
      return true;
    }
    const isGovernorateSelected = this.checkoutData.shippingAddress.governorateId !== 0;
    const isDeliveryMethodSelected = this.checkoutData.deliveryMethodId !== 0;

    return !isGovernorateSelected || !isDeliveryMethodSelected;
  }
}
