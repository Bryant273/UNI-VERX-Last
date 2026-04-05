import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { UniversityModule, Department } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Gestion des Cours</h2>
          <p class="text-slate-500">Gérez les cours universitaires, les crédits et les affectations de département.</p>
        </div>
        <app-button icon="pi-plus">Ajouter un Cours</app-button>
      </div>

      <app-card>
        <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
            <div class="relative flex-1">
              <app-input placeholder="Rechercher un cours..." icon="pi-search"></app-input>
            </div>
            <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tous les Départements</option>
              <option *ngFor="let dept of departments$ | async" [value]="dept.id">{{ dept.name }}</option>
            </select>
          </div>
          <div class="flex gap-2">
             <app-button variant="outline" icon="pi-filter" size="sm">Filtrer</app-button>
             <app-button variant="outline" icon="pi-download" size="sm">Exporter</app-button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-500">
            <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
              <tr>
                <th scope="col" class="px-6 py-3">Cours</th>
                <th scope="col" class="px-6 py-3">Code</th>
                <th scope="col" class="px-6 py-3">Département</th>
                <th scope="col" class="px-6 py-3">Crédits</th>
                <th scope="col" class="px-6 py-3">Statut</th>
                <th scope="col" class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of modules$ | async" class="border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-slate-900">
                  {{ course.name }}
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-bold uppercase">
                    {{ course.code }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs font-medium text-slate-600">
                  {{ universityService.getDepartmentName(course.departmentId) | async }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    {{ course.credits }} ECTS
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div [class]="'h-2 w-2 rounded-full ' + (course.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-red-500')"></div>
                    <span class="text-xs">{{ course.status }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-1">
                    <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                    <button class="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors">
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-4">
          <div>Affichage de 1 à 5 sur 45 cours</div>
          <div class="flex items-center gap-2">
            <button class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Précédent</button>
            <div class="flex gap-1">
                 <button class="h-6 w-6 rounded bg-blue-50 text-blue-600 font-bold border border-blue-200">1</button>
                 <button class="h-6 w-6 rounded hover:bg-slate-50 border border-transparent">2</button>
            </div>
            <button class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 transition-colors">Suivant</button>
          </div>
        </div>
      </app-card>
    </div>

  `
})
export class CoursesComponent implements OnInit {
  modules$!: Observable<UniversityModule[]>;
  departments$!: Observable<Department[]>;

  constructor(public universityService: UniversityService) {}

  ngOnInit() {
    this.modules$ = this.universityService.getModules();
    this.departments$ = this.universityService.getDepartments();
  }
}
