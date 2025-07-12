import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUser()) {
    console.log("User")
    return true;
  }
  else{
    router.navigateByUrl("/access-denied")
  }

  return false;
};
