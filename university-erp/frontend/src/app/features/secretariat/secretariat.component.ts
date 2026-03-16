import { Component } from '@angular/core';
import { SidebarLink } from '../../shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-secretariat',
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-slate-50">
      <app-sidebar [links]="sidebarLinks">
        <div sidebar-footer class="flex items-center gap-3 px-2 py-3 bg-white rounded-xl shadow-sm border border-slate-100">
          <div class="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            S
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-slate-900">Secrétariat</span>
            <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Scolarité</span>
          </div>
        </div>
      </app-sidebar>
      
      <div class="flex flex-1 flex-col overflow-hidden pl-64">
        <header class="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div class="flex items-center gap-4">
             <h2 class="text-lg font-black text-slate-800">Bureau de la Scolarité</h2>
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
export class SecretariatComponent {
  sidebarLinks: SidebarLink[] = [
    { label: 'Tableau de bord', icon: 'pi-home', route: '/secretariat/dashboard' },
    { label: 'Inscriptions', icon: 'pi-user-plus', route: '/secretariat/enrollments' },
    { label: 'Dossiers Étudiants', icon: 'pi-folder', route: '/secretariat/students' },
    { label: 'Certifications', icon: 'pi-verified', route: '/secretariat/certifications' },
    { label: 'Emploi du temps', icon: 'pi-calendar', route: '/secretariat/timetable' },
    { label: 'Support & Tickets', icon: 'pi-comments', route: '/secretariat/tickets' }
  ];
}
