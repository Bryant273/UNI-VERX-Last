import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLink } from '../../shared/components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-rectorate',
  template: `
    <div class="flex h-screen w-full overflow-hidden bg-slate-50">
      <app-sidebar [links]="sidebarLinks">
        <div sidebar-footer class="flex items-center gap-3 px-2 py-3 bg-slate-900 rounded-xl text-white">
          <div class="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            R
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold">Rectorat</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin Central</span>
          </div>
        </div>
      </app-sidebar>
      
      <div class="flex flex-1 flex-col overflow-hidden pl-64">
        <header class="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div class="flex items-center gap-4">
             <h2 class="text-lg font-black text-slate-800">Cabinet du Rectorat</h2>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <i class="pi pi-bell"></i>
            </button>
            <div class="h-8 w-8 rounded-full bg-slate-900"></div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class RectorateComponent {
  sidebarLinks: SidebarLink[] = [
    { label: 'Vue d\'ensemble', icon: 'pi-home', route: '/rectorate/dashboard' },
    { label: 'Gouvernance', icon: 'pi-building', route: '/rectorate/governance' },
    { label: 'Finances', icon: 'pi-briefcase', route: '/rectorate/finances' },
    { label: 'Ressources Humaines', icon: 'pi-users', route: '/rectorate/hr' },
    { label: 'Rapports & Audit', icon: 'pi-file-pdf', route: '/rectorate/reports' },
    { label: 'Paramètres', icon: 'pi-cog', route: '/rectorate/settings' }
  ];
}
