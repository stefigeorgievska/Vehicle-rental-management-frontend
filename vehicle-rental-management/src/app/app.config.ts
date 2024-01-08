import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { VehicleRentalManagementStore } from './vehicle-rental-management-store';
import { VehicleRentalManagementService } from './services/vehicle-rental-management.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideHttpClient(),
    HttpClientModule,
    VehicleRentalManagementService,
    VehicleRentalManagementStore,
  ],
};
