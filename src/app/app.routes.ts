
import { Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home-component/home-component.component';
import { ProductsComponent } from './components/Products/Products.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { CartComponent } from './components/cart/cart.component';
import { EditProductComponentComponent } from './components/edit-product-component/edit-product-component.component';
import { AdminLayoutComponent } from './components/adminLayout/adminLayout.component';
import { CustomersComponent } from './components/Customers/Customers.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { PaymentComponentComponent } from './components/payment-component/payment-component.component';

import { UserEditProfileComponent } from './components/user-edit-profile/user-edit-profile.component';
import { UserViewProfileComponent } from './components/user-view-profile/user-view-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { CustomerLayoutComponent } from './components/customerLayout/customerLayout.component';

import { GuestLayoutComponent } from './components/guestLayout/guestLayout.component';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { customerGuard } from './guards/customer.guard';
import { adminGuard } from './guards/admin.guard';
import { notAdminGuard } from './guards/not-admin.guard';
import { OrdersComponent } from './components/orders/orders.component';

import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [notAdminGuard] },
      {
        path: 'about',
        component: AboutComponent,
        canActivate: [notAdminGuard],
      },
      {
        path: 'contact',
        component: ContactComponent,
        canActivate: [notAdminGuard],
      },

      {
        path: 'login',
        component: LoginComponentComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        component: RegisterComponentComponent,
        canActivate: [guestGuard],
      },
    ],
  },

  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [authGuard, customerGuard],
    children: [
      { path: 'cart', component: CartComponent },
      { path: 'favourite', component: FavouriteComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'editProfile', component: UserEditProfileComponent },
      { path: 'viewProfile', component: UserViewProfileComponent },
      { path: 'payment', component: PaymentComponentComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'payment-success', component: PaymentSuccessComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'customers', component: CustomersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'products/edit/:id', component: EditProductComponentComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'addProduct', component: AddNewProductComponent },
      {path:'dashboard', component:DashboardComponent}
      
    ],
  },
  { path: '**', component: NotFoundComponentComponent },
];