import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RectorateComponent } from './rectorate.component';

const routes: Routes = [
  {
    path: '',
    component: RectorateComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/rectorate-dashboard.component').then(m => m.RectorateDashboardComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RectorateRoutingModule { }
