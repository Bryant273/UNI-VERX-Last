import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'departments',
    loadComponent: () => import('./pages/departments/departments.component').then(m => m.DepartmentsComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent)
  },
  {
    path: 'timetable',
    loadComponent: () => import('./pages/timetable/timetable.component').then(m => m.TimetableComponent)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent)
  },
  {
    path: 'planning',
    loadComponent: () => import('./pages/planning/planning.component').then(m => m.PlanningComponent)
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./pages/enrollments/enrollments.component').then(m => m.EnrollmentsComponent)
  },
  {
    path: 'student-files',
    loadComponent: () => import('./pages/student-files/student-files.component').then(m => m.StudentFilesComponent)
  },
  {
    path: 'teacher-files',
    loadComponent: () => import('./pages/teacher-files/teacher-files.component').then(m => m.TeacherFilesComponent)
  },
  {
    path: 'scholarships',
    loadComponent: () => import('./pages/scholarships/scholarships.component').then(m => m.ScholarshipsComponent)
  },
  {
    path: 'budgets',
    loadComponent: () => import('./pages/budgets/budgets.component').then(m => m.BudgetsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'tickets',
    loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
