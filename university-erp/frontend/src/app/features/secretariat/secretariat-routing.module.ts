import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecretariatComponent } from './secretariat.component';

const routes: Routes = [
  {
    path: '',
    component: SecretariatComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/secretariat-dashboard.component').then(m => m.SecretariatDashboardComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretariatRoutingModule { }
