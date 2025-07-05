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

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponentComponent },
  { path: 'register', component: RegisterComponentComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favourite', component: FavouriteComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'addProduct', component: AddNewProductComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'customers', component: CustomersComponent },
      { path: 'products/edit/:id', component: EditProductComponentComponent }, 
      {path: 'products', component: AdminProductsComponent}
    ]
  },
  { path: '**', component: NotFoundComponentComponent },
];
