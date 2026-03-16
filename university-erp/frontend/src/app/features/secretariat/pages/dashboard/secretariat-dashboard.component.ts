import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secretariat-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Info Header -->
      <div class="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-200">
         <div class="relative z-10">
           <h1 class="text-3xl font-black mb-2">Tableau de Bord Opérationnel</h1>
           <p class="text-blue-100 font-medium opacity-90">Gestion des inscriptions, dossiers et services aux étudiants.</p>
         </div>
         <div class="absolute right-0 top-0 h-48 w-48 translate-x-12 translate-y--12 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <!-- Operational Metrics -->
      <div class="grid gap-8 md:grid-cols-4">
         <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-4">
               <i class="pi pi-user-plus font-bold"></i>
            </div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inscriptions en attente</p>
               <h4 class="text-2xl font-black text-slate-900">78</h4>
            </div>
         </div>

         <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
               <i class="pi pi-folder-open font-bold"></i>
            </div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dossiers Incomplets</p>
               <h4 class="text-2xl font-black text-orange-600">24</h4>
            </div>
         </div>

         <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
               <i class="pi pi-comments font-bold"></i>
            </div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tickets de Support</p>
               <h4 class="text-2xl font-black text-blue-600">14</h4>
            </div>
         </div>

         <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div class="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
               <i class="pi pi-check-circle font-bold"></i>
            </div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificats Délivrés</p>
               <h4 class="text-2xl font-black text-green-600">452</h4>
            </div>
         </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
         <!-- Quick Navigation -->
         <div class="lg:col-span-1 space-y-6">
            <h3 class="text-xl font-black text-slate-900">Raccourcis de Gestion</h3>
            <div class="grid gap-4">
               <div class="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group shadow-sm">
                  <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                     <i class="pi pi-user-plus text-lg"></i>
                  </div>
                  <div class="flex-1">
                     <div class="text-sm font-black text-slate-900">Nouvelle Inscription</div>
                     <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accès direct au formulaire</div>
                  </div>
               </div>

               <div class="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-indigo-200 transition-all cursor-pointer group shadow-sm">
                  <div class="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                     <i class="pi pi-id-card text-lg"></i>
                  </div>
                  <div class="flex-1">
                     <div class="text-sm font-black text-slate-900">Cartes Étudiant</div>
                     <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Impression en masse</div>
                  </div>
               </div>

               <div class="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-amber-200 transition-all cursor-pointer group shadow-sm">
                  <div class="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                     <i class="pi pi-file-excel text-lg"></i>
                  </div>
                  <div class="flex-1">
                     <div class="text-sm font-black text-slate-900">Extractions de Données</div>
                     <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listes et statistiques XLS</div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Activity Feed Mock -->
         <div class="lg:col-span-2 space-y-6">
            <h3 class="text-xl font-black text-slate-900">Activité Récente du Secrétariat</h3>
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div class="divide-y divide-slate-50">
                  <div *ngFor="let i of [1,2,3,4,5]" class="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-all">
                     <div class="mt-1 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <i class="pi pi-history text-xs"></i>
                     </div>
                     <div class="flex-1 space-y-1">
                        <div class="flex items-center justify-between">
                           <span class="text-sm font-bold text-slate-900">Modification de dossier étudiant</span>
                           <span class="text-[10px] font-bold text-slate-400 uppercase">Il y a 12 min</span>
                        </div>
                        <p class="text-xs text-slate-600">Le dossier de <span class="font-bold">Jean Malou</span> a été mis à jour par <span class="text-blue-600 font-bold">Sécretaire A1</span>.</p>
                     </div>
                  </div>
               </div>
               <div class="p-4 bg-slate-50 text-center">
                  <button class="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors underline decoration-slate-200 underline-offset-4">Voir tout l'historique</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  `
})
export class SecretariatDashboardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
