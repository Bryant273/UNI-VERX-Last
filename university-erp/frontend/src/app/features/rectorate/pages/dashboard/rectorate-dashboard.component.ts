import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-rectorate-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Welcome Header -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Bonjour, Monsieur le Recteur</h1>
          <p class="text-slate-500 font-medium text-lg">Vue d'ensemble stratégique de l'université.</p>
        </div>
        <div class="flex items-center gap-3">
           <div class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-slate-200">
              Année Académique 2024-2025
           </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid gap-8 md:grid-cols-4">
         <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-all">
            <div class="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
               <i class="pi pi-users text-xl"></i>
            </div>
            <div>
               <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Étudiants Inscrits</p>
               <h4 class="text-3xl font-black text-slate-900">12,405</h4>
            </div>
            <div class="pt-2 flex items-center gap-2 text-[10px] font-bold text-green-600">
               <i class="pi pi-arrow-up"></i>
               <span>+4.2% ce semestre</span>
            </div>
         </div>

         <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-all">
            <div class="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
               <i class="pi pi-briefcase text-xl"></i>
            </div>
            <div>
               <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Corps Enseignant</p>
               <h4 class="text-3xl font-black text-slate-900">873</h4>
            </div>
            <div class="pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400">
               <span>Stabilité par rapport à 2023</span>
            </div>
         </div>

         <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-all">
            <div class="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
               <i class="pi pi-dollar text-xl"></i>
            </div>
            <div>
               <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Budget Exécuté</p>
               <h4 class="text-3xl font-black text-slate-900">62%</h4>
            </div>
            <div class="pt-2 flex items-center gap-2 text-[10px] font-bold text-amber-600">
               <span>Objectif Q3: 75%</span>
            </div>
         </div>

         <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-all">
            <div class="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <i class="pi pi-star text-xl"></i>
            </div>
            <div>
               <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Taux de Réussite Global</p>
               <h4 class="text-3xl font-black text-slate-900">74.2%</h4>
            </div>
            <div class="pt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
               <i class="pi pi-arrow-up"></i>
               <span>+2.1% (Année N-1)</span>
            </div>
         </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
         <!-- Financial Chart Mock -->
         <div class="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-8">
               <h3 class="text-xl font-black text-slate-900">Performance Financière (MADA)</h3>
               <select class="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none">
                  <option>Année 2025</option>
                  <option>Année 2024</option>
               </select>
            </div>
            <div class="h-64 flex items-end justify-between gap-4 px-4">
               <div *ngFor="let h of [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65]" 
                    class="flex-1 bg-blue-100 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer group relative"
                    [style.height.%]="h">
                    <div class="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold transition-all">
                       {{ h }}M
                    </div>
               </div>
            </div>
            <div class="flex justify-between mt-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
               <span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
            </div>
         </div>

         <!-- Quick Actions / Alerts -->
         <div class="flex flex-col gap-8">
            <div class="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
               <h3 class="text-lg font-black mb-6">Actions Administratives</h3>
               <div class="space-y-4">
                  <button class="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-sm font-bold">
                     <span>Émargement des vacataires</span>
                     <i class="pi pi-angle-right"></i>
                  </button>
                  <button class="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-sm font-bold">
                     <span>Validation des bourses</span>
                     <i class="pi pi-angle-right"></i>
                  </button>
                  <button class="w-full flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-sm font-bold">
                     <span>Audit de fin de semestre</span>
                     <i class="pi pi-angle-right"></i>
                  </button>
               </div>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-50">
               <h3 class="text-lg font-black text-indigo-900 mb-2">Rapport AI</h3>
               <p class="text-sm text-indigo-700 mb-6">Lien entre taux d'absentéisme et résultats en Mathématiques L1.</p>
               <button class="w-full py-3 bg-white border border-indigo-200 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-md transition-all">
                  Lire l'analyse
               </button>
            </div>
         </div>
      </div>
    </div>
  `
})
export class RectorateDashboardComponent implements OnInit {
  constructor(private universityService: UniversityService) {}
  ngOnInit(): void {}
}
