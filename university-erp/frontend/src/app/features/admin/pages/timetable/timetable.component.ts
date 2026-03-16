import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { TimetableEvent, UniversityClass } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col lg:flex-row justify-between gap-4 items-start">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Emploi du temps global</h2>
          <p class="text-slate-500">Gérez le planning de toute l'université par classe.</p>
        </div>
        <div class="flex gap-2">
          <app-button variant="outline" icon="pi-save">Enregistrer</app-button>
          <app-button icon="pi-plus">Ajouter un cours</app-button>
        </div>
      </div>

      <app-card>
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="w-full md:w-64">
            <select (change)="onClassChange($event)" class="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
              <option *ngFor="let cls of classes$ | async" [value]="cls.id">{{ cls.name }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <app-button variant="outline" icon="pi-chevron-left" size="sm"></app-button>
            <span class="text-sm font-semibold px-4 italic">Semaine du 15 Mars 2026</span>
            <app-button variant="outline" icon="pi-chevron-right" size="sm"></app-button>
          </div>
        </div>
      </app-card>

      <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table class="w-full min-w-[800px] border-collapse">
          <thead>
            <tr class="bg-slate-50">
              <th class="p-3 border border-slate-200 text-xs font-bold text-slate-500 uppercase w-32">Horaires</th>
              <th *ngFor="let day of days" class="p-3 border border-slate-200 text-xs font-bold text-slate-500 uppercase">
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let slot of slots; let i = index" class="h-24">
              <td class="p-3 border border-slate-200 text-xs font-bold text-slate-400 text-center bg-slate-50/50">
                {{ slot }}
              </td>
              <td *ngFor="let day of days" class="p-1 border border-slate-200 relative group cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div *ngIf="getEvent(day, slot) as ev" 
                     class="h-full w-full p-2 rounded border-l-4 bg-blue-50 border-blue-600 text-blue-700 flex flex-col justify-between">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-tight">{{ universityService.getModuleName(ev.moduleId) | async }}</p>
                    <p class="text-[9px] font-medium opacity-70">{{ ev.type }}</p>
                  </div>
                  <div class="flex justify-between items-end">
                    <span class="text-[9px] font-bold">{{ ev.roomId }}</span>
                    <i class="pi pi-info-circle text-[10px]"></i>
                  </div>
                </div>
                <div *ngIf="!getEvent(day, slot)" class="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="pi pi-plus text-slate-300"></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TimetableComponent implements OnInit {
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  slots = ['08:30 - 10:00', '10:30 - 12:00', '13:30 - 15:00', '15:30 - 17:00'];
  
  classes$!: Observable<UniversityClass[]>;
  events: TimetableEvent[] = [];
  selectedClassId = 'l3-info';

  constructor(public universityService: UniversityService) {}

  ngOnInit() {
    this.classes$ = this.universityService.getClasses();
    this.loadEvents();
  }

  loadEvents() {
    this.universityService.getEventsByClass(this.selectedClassId).subscribe((events: TimetableEvent[]) => {
      this.events = events;
    });
  }

  onClassChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedClassId = selectElement.value;
    this.loadEvents();
  }

  getEvent(day: string, time: string): TimetableEvent | undefined {
    return this.events.find(e => e.day === day && e.time === time);
  }
}
