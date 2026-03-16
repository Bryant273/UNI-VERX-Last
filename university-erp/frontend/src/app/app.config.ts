import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin-routing.module').then(m => m.AdminRoutingModule)
      },
      {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      }
    ]),
    provideAnimations()
  ]
};
