import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Department } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Gestion des Départements</h2>
          <p class="text-slate-500">Gérez les départements universitaires, les facultés et les chefs de département.</p>
        </div>
        <app-button icon="pi-plus">Ajouter un Département</app-button>
      </div>

      <app-card>
        <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
            <div class="relative flex-1">
              <app-input placeholder="Rechercher un département..." icon="pi-search"></app-input>
            </div>
            <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Toutes les Facultés</option>
              <option *ngFor="let faculty of faculties" [value]="faculty">{{ faculty }}</option>
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
                <th scope="col" class="px-6 py-3">Département</th>
                <th scope="col" class="px-6 py-3">Faculté</th>
                <th scope="col" class="px-6 py-3">Chef de Dépt</th>
                <th scope="col" class="px-6 py-3">Statut</th>
                <th scope="col" class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let dept of departments$ | async" class="border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-bold text-slate-900 border-l-4 border-l-blue-500">
                  {{ dept.name }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border border-slate-200">
                    {{ dept.faculty }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100 uppercase">
                      {{ (universityService.getProfessorName(dept.headId) | async)?.substring(0, 2) }}
                    </div>
                    <span class="font-medium text-slate-700">{{ universityService.getProfessorName(dept.headId) | async }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div [class]="'h-2 w-2 rounded-full ' + (dept.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-red-500')"></div>
                    <span class="text-xs">{{ dept.status }}</span>
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
      </app-card>
    </div>

  `
})
export class DepartmentsComponent implements OnInit {
  departments$!: Observable<Department[]>;
  faculties: string[] = [];

  constructor(public universityService: UniversityService) {}

  ngOnInit() {
    this.departments$ = this.universityService.getDepartments();
    this.faculties = this.universityService.getFaculties();
  }
}
