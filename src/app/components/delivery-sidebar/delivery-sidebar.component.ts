import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-delivery-sidebar',
  templateUrl: './delivery-sidebar.component.html',
  styleUrls: ['./delivery-sidebar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterModule]
})
export class DeliverySidebarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 