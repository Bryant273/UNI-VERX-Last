import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorComponent } from './professor.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/professor-dashboard.component').then(m => m.ProfessorDashboardComponent)
      },
      {
        path: 'grading',
        loadComponent: () => import('./pages/grading/professor-grading.component').then(m => m.ProfessorGradingComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }
