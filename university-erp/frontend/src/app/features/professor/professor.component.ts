import { Component } from '@angular/core';
import { SidebarLink } from '../../shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-professor',
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-slate-50">
      <app-sidebar [links]="sidebarLinks">
        <div sidebar-footer class="flex items-center gap-3 px-2 py-3 bg-slate-100 rounded-lg">
          <div class="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            JS
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-slate-900">Dr. Jane Smith</span>
            <span class="text-xs text-slate-500">Professeur</span>
          </div>
        </div>
      </app-sidebar>
      
      <div class="flex flex-1 flex-col overflow-hidden pl-64">
        <header class="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div class="flex items-center gap-4">
             <h2 class="text-lg font-semibold text-slate-800">Portail Enseignant</h2>
          </div>
          <div class="flex items-center gap-4">
             <div class="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                <span class="h-2 w-2 rounded-full bg-green-500"></span>
                Session Active
             </div>
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
export class ProfessorComponent {
  sidebarLinks: SidebarLink[] = [
    { label: 'Tableau de bord', icon: 'pi-home', route: '/professor/dashboard' },
    { label: 'Mes Cours', icon: 'pi-book', route: '/professor/courses' },
    { label: 'Saisie des Notes', icon: 'pi-pencil', route: '/professor/grading' },
    { label: 'Analytiques', icon: 'pi-chart-bar', route: '/professor/analytics' },
    { label: 'Calendrier', icon: 'pi-calendar', route: '/professor/calendar' },
    { label: 'Support', icon: 'pi-question-circle', route: '/professor/support' }
  ];
}
