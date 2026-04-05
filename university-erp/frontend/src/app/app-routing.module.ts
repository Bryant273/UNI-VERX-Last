import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./landing/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'rectorate',
    loadChildren: () => import('./features/rectorate/rectorate.module').then(m => m.RectorateModule),
  },
  {
    path: 'secretariat',
    loadChildren: () => import('./features/secretariat/secretariat.module').then(m => m.SecretariatModule),
  },
  {
    path: 'academic-advisor',
    loadChildren: () => import('./features/academic-advisor/advisor.module').then(m => m.AdvisorModule),
  },
  {
    path: 'professor',
    loadChildren: () => import('./features/professor/professor.module').then(m => m.ProfessorModule),
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.module').then(m => m.StudentModule),
  },
  {
    path: 'erp-provider',
    loadChildren: () => import('./features/erp-provider/erp-provider.module').then(m => m.ErpProviderModule),
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
