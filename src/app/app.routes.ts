import { Routes } from '@angular/router';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home-component/home-component.component';
import { ProductsComponent } from './components/Products/Products.component';
import { CartComponent } from './components/cart/cart.component';
import { EditProductComponentComponent } from './components/edit-product-component/edit-product-component.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponentComponent },
  { path: 'register', component: RegisterComponentComponent },
   { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'products/edit/:id', component: EditProductComponentComponent},
  { path: '**', component: NotFoundComponentComponent },

