import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from "../shared/custom-input/custom-input.component";
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/userProfile.model';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrl: './user-edit-profile.component.css',
  standalone: true,
  imports: [CustomInputComponent, NgFor, NgIf, FormsModule]
})
export class UserEditProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  selectedDefaultIndex: number | undefined = -1;
  duplicateAddressMessage: string = '';
  isLoadingProfile: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;
    const profileFromState = history.state.profile;

    if (profileFromState) {
      this.profile = profileFromState;
      this.selectedDefaultIndex = this.profile?.addresses.findIndex(a => a.isDefault);
      this.isLoadingProfile = false;
    } else {
      this.userService.getProfile().subscribe({
        next: (data) => {
          this.profile = data;
          this.selectedDefaultIndex = this.profile.addresses.findIndex(a => a.isDefault);
          this.isLoadingProfile = false;
        },
        error: (err) => {
          console.error('Failed to load profile:', err);
          this.isLoadingProfile = false;
        }
      });
    }
  }

  updateProfile(): void {
    this.duplicateAddressMessage = '';
    if (!this.profile) return;

    if (this.hasDuplicateAddress()) {
      this.duplicateAddressMessage = 'Duplicate addresses found. Please remove duplicates before saving.';
      return;
    }

    this.profile.addresses.forEach((addr, idx) => {
      addr.isDefault = idx === this.selectedDefaultIndex;
    });

    this.userService.updateProfile(this.profile).subscribe({
      next: () => this.router.navigate(['/viewProfile']),
      error: (err) => {
        console.error('Update failed', err);
        this.toastr.error('Failed to update profile', 'Error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/viewProfile']);
  }

  setDefaultAddress(index: number): void {
    this.selectedDefaultIndex = index;
    if (!this.profile) return;

    this.profile.addresses.forEach((addr, i) => {
      addr.isDefault = i === index;
    });
  }

  addAddress(): void {
    if (!this.profile) return;

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
    if (!this.profile) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this address?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        const wasDefault = this.profile!.addresses[index].isDefault;
        this.profile!.addresses.splice(index, 1);

        if (wasDefault && this.profile!.addresses.length > 0) {
          this.profile!.addresses[0].isDefault = true;
        }

        this.duplicateAddressMessage = this.hasDuplicateAddress()
          ? 'Duplicate address found. Please remove or change it.'
          : '';

        this.toastr.success('Address deleted successfully', 'Success');
      },
      reject: () => {
        this.toastr.info('Address deletion cancelled', 'Info');
      }
    });
  }

  hasDuplicateAddress(): boolean {
    if (!this.profile) return false;
    const seen = new Set<string>();

    for (const addr of this.profile.addresses) {
      const key = `${addr.street}-${addr.state}-${addr.buildingNumber}`;
      if (seen.has(key)) return true;
      seen.add(key);
    }

    return false;
  }

  changePassword(): void {
    this.router.navigate(['/changePassword']);
  }
}
