import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable, map } from 'rxjs';
import { AnnualResult, TimetableEvent } from '../../../../core/models/university.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-8 pb-12">
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white shadow-xl shadow-blue-200">
        <div class="relative z-10">
          <h1 class="text-3xl font-bold mb-2">Bon retour, Alice ! 👋</h1>
          <p class="text-blue-100 max-w-xl text-lg">
            Voici un aperçu de vos performances académiques et de votre emploi du temps pour aujourd'hui.
          </p>
        </div>
        <div class="absolute right-0 top-0 h-64 w-64 translate-x-16 translate-y--16 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute left-1/2 bottom-0 h-32 w-32 translate-y-16 rounded-full bg-blue-400/20 blur-2xl"></div>
      </div>

      <div class="grid gap-8 lg:grid-cols-4">
        <!-- Main Stats Column -->
        <div class="lg:col-span-3 grid gap-8 md:grid-cols-2">
          
          <!-- Average Card -->
          <div *ngIf="annualResults$ | async as annual" class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-slate-500 font-medium">Moyenne Générale</h3>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <i class="pi pi-chart-line text-xl"></i>
              </div>
            </div>
            <div class="flex items-baseline gap-4">
              <span class="text-5xl font-black text-slate-900">{{ (annual.average ?? 0).toFixed(2) }}</span>
              <span class="text-slate-400 text-lg">/ 20</span>
            </div>
            <div class="mt-6 flex items-center gap-2">
              <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                {{ annual.mention }}
              </span>
              <span class="text-xs text-slate-400">Classé {{ annual.rank }} sur {{ annual.totalStudents }}</span>
            </div>
          </div>

          <!-- AI Assessment / Progress Card -->
          <div class="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md">
             <div class="flex items-center justify-between mb-6">
              <h3 class="text-slate-500 font-medium">Statut de Progression</h3>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <i class="pi pi-verified text-xl"></i>
              </div>
            </div>
            <div *ngIf="annualResults$ | async as annual">
               <div class="text-2xl font-bold text-slate-900 mb-2">{{ annual.status }}</div>
               <p class="text-sm text-slate-500 mb-6">{{ annual.statusDetails }}</p>
               
               <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full" [style.width.%]="85"></div>
               </div>
               <div class="flex justify-between mt-2">
                  <span class="text-xs text-slate-400">{{ annual.credits }} Crédits</span>
                  <span class="text-xs font-bold text-blue-600">85% validés</span>
               </div>
            </div>
          </div>

          <!-- Jury Comments -->
          <div class="md:col-span-2 rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
             <div class="flex items-center gap-3 mb-4">
               <div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span class="text-xs font-bold tracking-widest text-blue-400 uppercase">Appréciation du Jury</span>
             </div>
             <p *ngIf="annualResults$ | async as annual" class="text-lg text-slate-300 italic leading-relaxed">
               "{{ annual.juryComment }}"
             </p>
          </div>
        </div>

        <!-- Right Side: Timetable / Events -->
        <div class="space-y-8">
           <div class="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h3 class="text-lg font-bold text-slate-900 mb-6">Cours d'aujourd'hui</h3>
              <div class="space-y-6">
                 <div *ngFor="let event of (todayEvents$ | async)" class="relative pl-6 border-l-2 border-slate-100 group">
                    <div class="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></div>
                    <div class="text-xs font-bold text-blue-600 mb-1">{{ event.time }}</div>
                    <div class="font-bold text-slate-900">{{ event.moduleId }}</div>
                    <div class="text-xs text-slate-500">{{ event.roomId }} • {{ event.type }}</div>
                 </div>
                 <div *ngIf="(todayEvents$ | async)?.length === 0" class="text-center py-8">
                    <p class="text-sm text-slate-400 italic">Aucun cours prévu</p>
                 </div>
              </div>
              <button class="mt-8 w-full rounded-2xl bg-slate-50 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                Voir l'emploi du temps
              </button>
           </div>

           <div class="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 border border-amber-100 shadow-sm shadow-amber-50">
              <h3 class="text-lg font-bold text-amber-900 mb-2">Support & Aide</h3>
              <p class="text-sm text-amber-700 mb-6">Un problème avec vos notes ou votre inscription ?</p>
              <button class="w-full rounded-2xl bg-white py-3 text-sm font-bold text-amber-700 border border-amber-200 shadow-sm hover:shadow-md transition-all">
                Ouvrir un ticket
              </button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  annualResults$!: Observable<AnnualResult | undefined>;
  todayEvents$!: Observable<TimetableEvent[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.annualResults$ = this.universityService.getStudentResults().pipe(
      map((res: { s1: any; s2: any; annual: AnnualResult } | null) => res?.annual)
    );

    this.todayEvents$ = this.universityService.getEventsByClass('l3-info').pipe(
      map((events: TimetableEvent[]) => events.slice(0, 3)) // Mocking today's events with the first few
    );
  }
}
