import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ title }}</p>
          <h3 class="mt-2 text-2xl font-bold text-slate-900">{{ value }}</h3>
        </div>
        <div [class]="'flex h-12 w-12 items-center justify-center rounded-lg ' + iconBgClass">
          <i [class]="'pi ' + icon + ' text-xl ' + iconTextClass"></i>
        </div>
      </div>
      <div class="mt-4 flex items-center text-sm">
        <i [class]="'pi ' + trendIcon + ' mr-1.5 font-bold ' + trendColorClass"></i>
        <span [class]="'font-semibold ' + trendColorClass">{{ trendValue }}</span>
        <span class="ml-2 text-slate-500">{{ trendLabel }}</span>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
  @Input() iconBgClass: string = 'bg-blue-100';
  @Input() iconTextClass: string = 'text-blue-600';
  @Input() trendIcon: string = 'pi-arrow-up';
  @Input() trendValue: string = '';
  @Input() trendColorClass: string = 'text-green-600';
  @Input() trendLabel: string = 'vs last month';
}
