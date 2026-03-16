import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <div class="flex items-center gap-4">
        <span class="text-lg font-semibold text-slate-800">{{ title }}</span>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="relative hidden py-1 md:block flex-1 max-w-sm">
          <i class="pi pi-search absolute left-2.5 top-2.5 h-4 w-4 text-slate-500"></i>
          <input
            type="search"
            placeholder="Search..."
            class="flex h-9 w-64 rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
        
        <button class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100">
          <i class="pi pi-bell text-slate-600"></i>
        </button>
        
        <div class="h-8 w-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer" (click)="onProfileClick.emit()">
          <img *ngIf="userAvatar" [src]="userAvatar" alt="User avatar" class="h-full w-full object-cover" />
          <div *ngIf="!userAvatar" class="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold text-sm">
            {{ getUserInitials() }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() title: string = 'Dashboard';
  @Input() userName: string = 'User';
  @Input() userAvatar?: string;
  @Output() onProfileClick = new EventEmitter<void>();

  getUserInitials(): string {
    return this.userName.substring(0, 2).toUpperCase();
  }
}
