import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component.component';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponentComponent, NavbarComponentComponent, RouterOutlet, RouterModule, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'watchEcommerce';
}
