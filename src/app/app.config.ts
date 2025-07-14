import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { favouriteCounterReducer } from './Store/FavouriteCounter.reducer';

import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    ConfirmationService,
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // 👈 Scrolls to top on navigation
      }), 
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      favouriteCounter: favouriteCounterReducer
    }),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
      }
    })
  ],

};
