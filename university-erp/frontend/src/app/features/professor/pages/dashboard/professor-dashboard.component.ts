import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable, map } from 'rxjs';
import { UniversityClass, TimetableEvent } from '../../../../core/models/university.model';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Welcome Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-4">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
               <i class="pi pi-briefcase text-xl text-blue-400"></i>
            </div>
            <h1 class="text-4xl font-black tracking-tight">Bonjour, Dr. Jane Smith !</h1>
            <p class="text-slate-400 text-lg max-w-xl">
              Vous avez <span class="text-white font-bold">3 cours</span> aujourd'hui et <span class="text-white font-bold">120 copies</span> en attente de correction.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
             <button class="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                Saisir les Notes
             </button>
             <button class="rounded-2xl bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all">
                Export Rapport
             </button>
          </div>
        </div>
        <div class="absolute right-0 top-0 h-96 w-96 translate-x-32 translate-y--32 rounded-full bg-blue-600/20 blur-[100px]"></div>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-8 md:grid-cols-4">
         <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-blue-200 transition-all">
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Total Étudiants</span>
               <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="pi pi-users font-bold"></i>
               </div>
            </div>
            <div class="text-3xl font-black text-slate-900">165</div>
            <div class="text-xs text-slate-500 mt-2 flex items-center gap-1">
               <i class="pi pi-arrow-up text-green-500"></i>
               <span class="text-green-600 font-bold">+12%</span> par rapport au semestre dernier
            </div>
         </div>

         <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Moyenne Section</span>
               <div class="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="pi pi-chart-bar font-bold"></i>
               </div>
            </div>
            <div class="text-3xl font-black text-slate-900">13.45</div>
            <div class="text-xs text-slate-500 mt-2">Moyenne globale L3 Informatique</div>
         </div>

         <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-amber-200 transition-all">
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Taux de Réussite</span>
               <div class="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="pi pi-check-circle font-bold"></i>
               </div>
            </div>
            <div class="text-3xl font-black text-slate-900">82%</div>
            <div class="text-xs text-slate-500 mt-2">Sur 3 modules enseignés</div>
         </div>

         <div class="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 group hover:border-red-200 transition-all">
            <div class="flex items-center justify-between mb-4">
               <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Notes Manquantes</span>
               <div class="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i class="pi pi-exclamation-circle font-bold"></i>
               </div>
            </div>
            <div class="text-3xl font-black text-slate-900">45</div>
            <div class="text-xs text-slate-500 mt-2 font-bold text-red-500 underline decoration-red-200 underline-offset-4 cursor-pointer">Saisie requise d'ici demain</div>
         </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
         <!-- Classes List -->
         <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between">
               <h3 class="text-xl font-black text-slate-900">Mes Classes Actuelles</h3>
               <button class="text-sm font-bold text-blue-600 hover:underline">Gérer tout</button>
            </div>
            <div class="grid gap-6 md:grid-cols-2">
               <div *ngFor="let class of (classes$ | async)" class="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                  <div class="flex flex-col gap-4">
                     <div class="flex items-center justify-between">
                        <span class="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-600">{{ class.id }}</span>
                        <div class="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <i class="pi pi-arrow-right"></i>
                        </div>
                     </div>
                     <div class="space-y-1">
                        <h4 class="text-xl font-black text-slate-900 tracking-tight">{{ class.name }}</h4>
                        <p class="text-sm text-slate-500">{{ class.studentCount }} Étudiants • {{ class.level }}</p>
                     </div>
                     <div class="flex -space-x-3 mt-2">
                        <div class="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">A</div>
                        <div class="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">B</div>
                        <div class="h-8 w-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold">+</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Schedule / Quick Actions -->
         <div class="space-y-6">
            <h3 class="text-xl font-black text-slate-900">Prochains Cours</h3>
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
               <div *ngFor="let event of (schedule$ | async)" class="flex gap-4 group">
                  <div class="flex flex-col items-center">
                     <div class="h-2 w-2 rounded-full bg-blue-600 mt-1.5 group-hover:scale-150 transition-transform"></div>
                     <div class="w-[1px] h-full bg-slate-100 mt-1"></div>
                  </div>
                  <div class="flex-1 pb-6">
                     <div class="text-[10px] font-black text-blue-600 uppercase mb-1">{{ event.time }}</div>
                     <h5 class="font-bold text-slate-900 leading-tight mb-1">{{ event.moduleId }}</h5>
                     <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <i class="pi pi-map-marker"></i>
                        {{ event.roomId }} • {{ event.classId }}
                     </div>
                  </div>
               </div>
               <button class="w-full py-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Voir tout le calendrier
               </button>
            </div>
         </div>
      </div>
    </div>
  `
})
export class ProfessorDashboardComponent implements OnInit {
  classes$!: Observable<UniversityClass[]>;
  schedule$!: Observable<TimetableEvent[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.classes$ = this.universityService.getClasses();
    this.schedule$ = this.universityService.getEventsByClass('l3-info').pipe(
      map(events => events.slice(0, 3))
    );
  }
}
