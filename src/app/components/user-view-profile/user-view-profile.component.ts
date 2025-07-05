import { UserService } from './../../services/user.service';
import { UserProfile } from './../../models/userProfile.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-view-profile.component.html'
  , styleUrls: ['./user-view-profile.component.css'],
  imports: [NgFor, NgIf]
})
export class UserViewProfileComponent implements OnInit {
  profile!: UserProfile;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (data) => (this.profile = data),
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  editProfile(): void {
    this.router.navigate(['/editProfile'], { state: { profile: this.profile } });
  }
}
