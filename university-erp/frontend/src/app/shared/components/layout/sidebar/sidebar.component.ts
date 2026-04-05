import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="flex w-64 flex-col border-r border-slate-200 bg-white h-screen fixed left-0 top-0">
      <div class="flex h-14 items-center border-b border-slate-200 px-6">
        <a routerLink="/" class="flex items-center gap-2 font-semibold">
          <div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <span class="text-sm font-bold">U</span>
          </div>
          <span class="text-lg text-slate-900">UNI-VERX</span>
        </a>
      </div>
      
      <div class="flex-1 overflow-auto py-4">
        <nav class="grid gap-1 px-4">
          <ng-container *ngFor="let link of links">
            <a [routerLink]="link.route"
               routerLinkActive="bg-blue-50 text-blue-700"
               class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <i [class]="'pi ' + link.icon"></i>
              {{ link.label }}
            </a>
          </ng-container>
        </nav>
      </div>

      <div class="border-t border-slate-200 p-4">
        <ng-content select="[sidebar-footer]"></ng-content>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() links: SidebarLink[] = [];
}
