import { Component, NgModule } from '@angular/core';
import { CustomInputComponent } from "../shared/custom-input/custom-input.component";
import { UserService} from '../../services/user.service';
import { UserProfile } from '../../models/userProfile.model';
import { Router } from '@angular/router';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-user-edit-profile',
  imports: [CustomInputComponent ,NgFor,NgIf,FormsModule],
  templateUrl: './user-edit-profile.component.html',
  styleUrl: './user-edit-profile.component.css'
})
export class UserEditProfileComponent {
profile: UserProfile = history.state.profile;
selectedDefaultIndex: number = this.profile.addresses.findIndex(a => a.isDefault);
duplicateAddressMessage: string = '';


 constructor(private userService: UserService, private router: Router) {
 this.selectedDefaultIndex = this.profile.addresses.findIndex(a => a.isDefault);
 }

hasDuplicateAddress(): boolean {
  const seen = new Set<string>();

  for (const addr of this.profile.addresses) {
    const key = `${addr.street}-${addr.state}-${addr.buildingNumber}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }

  return false;
}

  updateProfile(): void {
    this.duplicateAddressMessage = '';
    if (this.hasDuplicateAddress()) {
      this.duplicateAddressMessage = 'Duplicate addresses found. Please remove duplicates before saving.';
      return;
    }
    // Ensure only one address is default
    this.profile.addresses.forEach((addr, idx) => {
      addr.isDefault = idx === this.selectedDefaultIndex;
    });

    this.userService.updateProfile(this.profile).subscribe({
      next: () => this.router.navigate(['/viewProfile']),
      error: (err) => console.error('Update failed', err)
    });

  }
  cancel(): void {
    this.router.navigate(['/viewProfile']);
  }

setDefaultAddress(index: number): void {
  this.selectedDefaultIndex = index;
  this.profile.addresses.forEach((addr, i) => {
    addr.isDefault = i === index;
  });
}
  addAddress(): void {
  this.profile.addresses.push({
    id: 0,
    street: '',
    state: '',
    buildingNumber: 0,
    isDefault: false
  });
    this.duplicateAddressMessage = this.hasDuplicateAddress()
    ? 'Duplicate address found. Please remove or change it.'
    : '';
}
removeAddress(index: number): void {
  const confirmed = window.confirm('Are you sure you want to delete this address?');
  if (confirmed) {
  const wasDefault = this.profile.addresses[index].isDefault;
  this.profile.addresses.splice(index, 1);

  // Reassign default if needed
  if (wasDefault && this.profile.addresses.length > 0) {
    this.profile.addresses[0].isDefault = true;
  }

  this.duplicateAddressMessage = this.hasDuplicateAddress()
      ? 'Duplicate address found. Please remove or change it.'
      : '';
}
}
changePassword(){
  this.router.navigate(['/changePassword']);
}
}
