import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Report } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Rapports & Analyses</h2>
          <p class="text-slate-500">Gérez, générez et téléchargez les rapports académiques et administratifs.</p>
        </div>
        <app-button icon="pi-plus">Générer un Rapport</app-button>
      </div>

      <div class="grid gap-6 md:grid-cols-4">
        <div class="md:col-span-3 space-y-6">
          <app-card title="Rapports Récents">
            <div class="overflow-x-auto">
              <table class="w-full text-left font-sans">
                <thead class="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th class="px-6 py-4">Nom du Rapport</th>
                    <th class="px-6 py-4">Période</th>
                    <th class="px-6 py-4">Statut</th>
                    <th class="px-6 py-4">Taille</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr *ngFor="let report of reports$ | async" class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-start gap-3">
                        <div class="mt-1 h-8 w-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100">
                          <i class="pi pi-file-pdf"></i>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-slate-900">{{ report.title }}</p>
                          <p class="text-[10px] text-slate-500">{{ report.description }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-slate-600">{{ report.period }}</td>
                    <td class="px-6 py-4">
                      <app-badge [variant]="report.status === 'available' ? 'success' : 'warning'">
                        {{ report.status === 'available' ? 'Disponible' : 'En traitement' }}
                      </app-badge>
                    </td>
                    <td class="px-6 py-4 text-[10px] text-slate-400 font-mono">{{ report.size }}</td>
                    <td class="px-6 py-4 text-right">
                       <div class="flex justify-end gap-1">
                          <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="Aperçu">
                            <i class="pi pi-eye text-xs"></i>
                          </button>
                          <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors" title="Télécharger">
                            <i class="pi pi-download text-xs"></i>
                          </button>
                          <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors" title="Supprimer">
                            <i class="pi pi-trash text-xs"></i>
                          </button>
                       </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </app-card>
        </div>

        <div class="space-y-6">
          <app-card title="Modèles de Rapports">
            <div class="space-y-3">
              <div *ngFor="let template of reportTemplates" class="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer transition-all">
                <div class="flex items-center gap-3">
                   <div [class]="'h-8 w-8 rounded-full flex items-center justify-center ' + template.color">
                     <i [class]="'pi ' + template.icon + ' text-xs'"></i>
                   </div>
                   <div>
                     <p class="text-xs font-bold text-slate-800">{{ template.name }}</p>
                     <p class="text-[9px] text-slate-500">{{ template.type }}</p>
                   </div>
                </div>
              </div>
            </div>
          </app-card>

          <app-card class="bg-blue-600 border-none text-white overflow-hidden relative">
            <div class="relative z-10">
              <h3 class="text-sm font-bold">Blue IA Analytics</h3>
              <p class="mt-2 text-[10px] text-blue-100">Générez des rapports prédictifs basés sur les performances actuelles.</p>
              <button class="mt-4 w-full rounded bg-white py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors uppercase">
                Essayer Blue IA
              </button>
            </div>
            <div class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue-500/20"></div>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  reports$!: Observable<Report[]>;

  reportTemplates = [
    { name: 'Présences Mensuelles', type: 'Scolarité', icon: 'pi-users', color: 'bg-purple-100 text-purple-600' },
    { name: 'PV des Délibérations', type: 'Académique', icon: 'pi-file', color: 'bg-amber-100 text-amber-600' },
    { name: 'Bilan de Progression', type: 'Étudiants', icon: 'pi-chart-line', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'État de Trésorerie', type: 'Finance', icon: 'pi-money-bill', color: 'bg-blue-100 text-blue-600' }
  ];

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.reports$ = this.universityService.getReports();
  }
}
