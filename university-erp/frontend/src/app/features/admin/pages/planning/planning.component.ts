import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AcademicEvent } from '../../../../core/models/university.model';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Calendrier Académique</h2>
          <p class="text-slate-500">Gérez les dates clés, les sessions d'examens et les vacances.</p>
        </div>
        <div class="flex gap-3">
          <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2024-2025</option>
            <option>2025-2026</option>
          </select>
          <app-button icon="pi-plus">Ajouter un événement</app-button>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <app-card *ngFor="let month of calendarMonths$ | async" [title]="month.name">
          <div class="space-y-3">
            <div *ngIf="month.events.length === 0" class="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
              <i class="pi pi-calendar-minus text-2xl mb-2"></i>
              <p class="text-xs">Aucun événement</p>
            </div>
            
            <div *ngFor="let event of month.events" 
                 [class]="'p-3 rounded-lg border-l-4 ' + getEventTypeClass(event.type)">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-sm font-bold text-slate-900">{{ event.title }}</h4>
                  <p class="text-xs text-slate-500">{{ event.startDate | date:'d MMMM' }} - {{ event.endDate | date:'d MMMM' }}</p>
                </div>
                <div [class]="'px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ' + getBadgeClass(event.type)">
                  {{ event.type }}
                </div>
              </div>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class PlanningComponent implements OnInit {
  calendarMonths$!: Observable<any[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.calendarMonths$ = this.universityService.getAcademicEvents().pipe(
      map((events: AcademicEvent[]) => {
        const months = [
          'Septembre', 'Octobre', 'Novembre', 'Décembre', 
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'
        ];
        return months.map((monthName, index) => {
          const monthIndex = (index + 8) % 12;
          return {
            name: monthName,
            events: events.filter(e => new Date(e.startDate).getMonth() === monthIndex)
          };
        });
      })
    );
  }

  getEventTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'rentree': 'bg-green-50 border-green-500',
      'vacances': 'bg-blue-50 border-blue-500',
      'examen': 'bg-rose-50 border-rose-500',
      'ferie': 'bg-amber-50 border-amber-500'
    };
    return classes[type] || 'bg-slate-50 border-slate-500';
  }

  getBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'rentree': 'bg-green-100 text-green-700',
      'vacances': 'bg-blue-100 text-blue-700',
      'examen': 'bg-rose-100 text-rose-700',
      'ferie': 'bg-amber-100 text-amber-700'
    };
    return classes[type] || 'bg-slate-100 text-slate-700';
  }
}
