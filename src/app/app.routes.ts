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
import { AboutComponent } from './components/about/about.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponentComponent },
  { path: 'register', component: RegisterComponentComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'editProfile', component: UserEditProfileComponent },
  { path: 'viewProfile', component: UserViewProfileComponent },

  { path: 'payment', component: PaymentComponentComponent },

  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'payment-success', component: PaymentSuccessComponent }
,

  {
    path: 'admin', component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'customers', component: CustomersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'products/edit/:id', component: EditProductComponentComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'addProduct', component: AddNewProductComponent },
    ],
  },
  { path: '**', component: NotFoundComponentComponent },
];
