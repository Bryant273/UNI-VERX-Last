import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <img
        *ngIf="src; else initialsTemplate"
        [src]="src"
        [alt]="name"
        class="h-full w-full object-cover"
        (error)="onImgError()"
      />
      <ng-template #initialsTemplate>
        <span class="font-medium text-slate-600">{{ getInitials() }}</span>
      </ng-template>
    </div>
  `
})
export class AvatarComponent {
  @Input() src: string | undefined;
  @Input() name: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() class: string = '';

  imgError = false;

  getContainerClasses(): string {
    const baseClasses = 'relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 items-center justify-center';
    
    const sizeClasses = {
      sm: 'h-8 w-8 text-[10px]',
      md: 'h-10 w-10 text-xs',
      lg: 'h-12 w-12 text-sm',
      xl: 'h-14 w-14 text-base'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${this.class}`;
  }

  getInitials(): string {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onImgError() {
    this.src = undefined;
  }
}
