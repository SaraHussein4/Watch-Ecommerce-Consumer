import { Component } from '@angular/core';
import { CustomInputComponent } from "../shared/custom-input/custom-input.component";
import { UserService } from '../../services/user.service';
import { ChangePassword } from '../../models/changePassword.model';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [CustomInputComponent,FormsModule,NgFor,NgIf],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  successMessage = '';
  errorMessage = '';

   constructor(private userService: UserService, 
    private location: Location ) {}

 onSubmit() {
  this.successMessage = '';
  this.errorMessage = '';

  if (this.newPassword !== this.confirmNewPassword) {
    this.errorMessage = 'New passwords do not match';
    return;
  }

  const dto: ChangePassword = {
    currentPassword: this.currentPassword,
    newPassword: this.newPassword,
    confirmNewPassword: this.confirmNewPassword
  };

  this.userService.changePassword(dto).subscribe({
    next: () => {
      this.successMessage = 'Password changed successfully';
      setTimeout(() => this.location.back(), 2000); // Go back after showing the message
    },
    error: (err) => {
      const message = err?.error?.errors?.[0] || 'Failed to change password';
      this.errorMessage = message;
    }
  });
}

  cancel() {
    this.location.back(); // ✅ Cancel navigates back
  }
}