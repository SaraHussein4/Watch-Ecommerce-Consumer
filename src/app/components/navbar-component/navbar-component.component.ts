import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule,RouterLink , RouterLinkActive],
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.css']
})
export class NavbarComponentComponent implements OnInit, OnDestroy { 
  isLoggedIn = false;
  private authSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.userData.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}