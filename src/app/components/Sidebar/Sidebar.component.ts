import { Component, OnInit } from '@angular/core';
import { Router, RouterLink ,RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-Sidebar',
  templateUrl: './Sidebar.component.html',
  styleUrls: ['./Sidebar.component.css'],
  imports: [RouterLink,RouterModule]
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    console.log(";akdf")
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
