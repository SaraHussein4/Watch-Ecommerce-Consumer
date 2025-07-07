import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponentComponent } from './components/footer-component/footer-component.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { Router ,NavigationEnd} from '@angular/router';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
@Component({
  selector: 'app-root',
  imports: [
    FooterComponentComponent,
    NavbarComponentComponent,
    RouterOutlet,
    RouterModule,
    ChatBotComponent,
    // RouterLinkActive
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'watchEcommerce';
  showNavbar = true;
  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        if (event.url.includes('/admin')) {
          this.showNavbar = false;
        } else {
          this.showNavbar = true;
        }
      }
    });
  }
}
