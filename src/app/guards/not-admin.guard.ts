import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const notAdminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAdmin()) {
    return true;
  }
  return false;
};
