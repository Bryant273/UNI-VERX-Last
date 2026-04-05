import { Component } from '@angular/core';
import { SidebarLink } from '../../shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-student',
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-slate-50">
      <app-sidebar [links]="sidebarLinks">
        <div sidebar-footer class="flex items-center gap-3 px-2 py-3 bg-slate-100 rounded-lg">
          <div class="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            JD
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-slate-900">Jean Dupont</span>
            <span class="text-xs text-slate-500">Étudiant</span>
          </div>
        </div>
      </app-sidebar>
      
      <div class="flex flex-1 flex-col overflow-hidden pl-64">
        <header class="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div class="flex items-center gap-4">
             <h2 class="text-lg font-semibold text-slate-800">Portail Étudiant</h2>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <i class="pi pi-bell"></i>
            </button>
            <div class="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class StudentComponent {
  sidebarLinks: SidebarLink[] = [
    { label: 'Tableau de bord', icon: 'pi-home', route: '/student/dashboard' },
    { label: 'Emploi du temps', icon: 'pi-calendar', route: '/student/timetable' },
    { label: 'Mes Cours', icon: 'pi-book', route: '/student/courses' },
    { label: 'Mes Notes', icon: 'pi-chart-bar', route: '/student/results' },
    { label: 'Documents', icon: 'pi-file', route: '/student/documents' },
    { label: 'Tickets & Support', icon: 'pi-comments', route: '/student/tickets' },
    { label: 'Paramètres', icon: 'pi-cog', route: '/student/settings' }
  ];
}
