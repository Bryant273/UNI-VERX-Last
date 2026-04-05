import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { SidebarComponent, SidebarLink } from './shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen w-full bg-slate-50">
      <ng-container *ngIf="isLoggedIn">
        <app-sidebar [links]="sidebarLinks">
          <div sidebar-footer class="flex items-center gap-3">
             <div class="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
               AD
             </div>
             <div class="flex flex-col">
               <span class="text-sm font-medium text-slate-900">Admin User</span>
               <span class="text-xs text-slate-500">admin@university.edu</span>
             </div>
          </div>
        </app-sidebar>
        
        <div class="flex flex-1 flex-col ml-64 overflow-hidden">
          <app-header [title]="pageTitle" userName="Admin User"></app-header>
          
          <main class="flex-1 overflow-auto p-6">
            <router-outlet></router-outlet>
          </main>
        </div>
      </ng-container>

      <ng-container *ngIf="!isLoggedIn">
        <div class="w-full">
          <router-outlet></router-outlet>
        </div>
      </ng-container>
    </div>
  `
})
export class AppComponent {
  isLoggedIn = false; // Set to false to show Landing Page by default
  pageTitle = 'Dashboard';
  
  sidebarLinks: SidebarLink[] = [
    { label: 'Tableau de Bord', icon: 'pi pi-home', route: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: 'pi pi-users', route: '/admin/users' },
    { label: 'Départements', icon: 'pi pi-building', route: '/admin/departments' },
    { label: 'Cours', icon: 'pi pi-book', route: '/admin/courses' },
    { label: 'Emploi du temps', icon: 'pi pi-calendar', route: '/admin/timetable' },
    { label: 'Salles & Infrastructures', icon: 'pi pi-map', route: '/admin/rooms' },
    { label: 'Inscriptions', icon: 'pi pi-user-plus', route: '/admin/enrollments' },
    { label: 'Dossiers Étudiants', icon: 'pi pi-folder', route: '/admin/student-files' },
    { label: 'Dossiers Enseignants', icon: 'pi pi-briefcase', route: '/admin/teacher-files' },
    { label: 'Bourses & Scolarité', icon: 'pi pi-money-bill', route: '/admin/scholarships' },
    { label: 'Budgets & Trésorerie', icon: 'pi pi-chart-bar', route: '/admin/budgets' },
    { label: 'Rapports & Analyses', icon: 'pi pi-file-pdf', route: '/admin/reports' },
    { label: 'Support & Tickets', icon: 'pi pi-comments', route: '/admin/tickets' },
    { label: 'Paramètres', icon: 'pi pi-cog', route: '/admin/settings' }
  ];
}
