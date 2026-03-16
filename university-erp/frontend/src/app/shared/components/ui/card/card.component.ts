import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ' + class">
      <!-- Header -->
      <div *ngIf="title || description" class="flex flex-col space-y-1.5 p-6">
        <h3 *ngIf="title" class="font-semibold leading-none tracking-tight">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-slate-500">{{ description }}</p>
      </div>
      
      <!-- Content -->
      <div [class]="getPaddedContentClass()">
        <ng-content></ng-content>
      </div>

      <!-- Footer -->
      <div *ngIf="hasFooter" class="flex items-center p-6 pt-0">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() class: string = '';
  @Input() noPadding: boolean = false;
  @Input() hasFooter: boolean = false;

  getPaddedContentClass(): string {
    return this.noPadding ? '' : 'p-6 pt-0';
  }
}
