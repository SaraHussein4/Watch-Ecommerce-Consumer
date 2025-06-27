import { Routes } from '@angular/router';
import { HomeComponentComponent } from './components/home-component/home-component.component';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponentComponent },
    { path: 'login', component: LoginComponentComponent },
    {path:'register' , component: RegisterComponentComponent },
    {path:'product', component: ProductComponent},
    {path: '**', component:NotFoundComponentComponent}
   
];
