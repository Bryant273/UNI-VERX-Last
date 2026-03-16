import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getClasses()">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' = 'default';
  @Input() class: string = '';

  getClasses(): string {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    const variantClasses = {
      default: 'bg-blue-100 text-blue-800 border-transparent',
      secondary: 'bg-slate-100 text-slate-800 border-transparent',
      outline: 'text-slate-900 border border-slate-200 bg-transparent',
      success: 'bg-green-100 text-green-800 border-transparent shadow-[0_0_8px_rgba(34,197,94,0.1)]',
      warning: 'bg-yellow-100 text-yellow-800 border-transparent',
      danger: 'bg-red-100 text-red-800 border-transparent'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${this.class}`;
  }
}
