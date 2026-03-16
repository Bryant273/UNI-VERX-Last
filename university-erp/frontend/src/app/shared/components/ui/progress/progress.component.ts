import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 ' + class">
      <div
        [class]="'h-full w-full flex-1 transition-all ' + getColorClass()"
        [style.transform]="'translateX(-' + (100 - value) + '%)'"
      ></div>
    </div>
  `
})
export class ProgressComponent {
  @Input() value: number = 0;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() class: string = '';

  getColorClass(): string {
    const colors = {
      primary: 'bg-blue-600',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500'
    };
    return colors[this.color];
  }
}
