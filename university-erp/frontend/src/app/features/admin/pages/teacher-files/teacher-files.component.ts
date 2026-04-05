import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UniversityService } from '../../../../core/services/university.service';
import { TeacherFile } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-teacher-files',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    ButtonComponent, 
    BadgeComponent, 
    AvatarComponent,
    InputComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Dossiers Enseignants</h2>
          <p class="text-slate-500">Suivi des contrats, documents administratifs et spécialités.</p>
        </div>
      </div>

      <app-card>
        <div class="mb-4 flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <app-input placeholder="Rechercher un enseignant..." icon="pi-search"></app-input>
          </div>
          <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="">Tous les statuts</option>
            <option value="Complet">Complet</option>
            <option value="Incomplet">Incomplet</option>
            <option value="En attente">En attente</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-500">
            <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
              <tr>
                <th class="px-6 py-3">Enseignant</th>
                <th class="px-6 py-3">Spécialité</th>
                <th class="px-6 py-3">État du Dossier</th>
                <th class="px-6 py-3">Dernière Activité</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let teacher of teachers$ | async" class="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <app-avatar [name]="teacher.name" [src]="teacher.avatar" size="sm"></app-avatar>
                    <div>
                      <div class="font-medium text-slate-900">{{ teacher.name }}</div>
                      <div class="text-[10px] text-slate-500">{{ teacher.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs font-medium">{{ teacher.specialty }}</td>
                <td class="px-6 py-4">
                  <app-badge [variant]="getStatusVariant(teacher.fileStatus)">
                    <i [class]="'pi ' + getStatusIcon(teacher.fileStatus) + ' mr-1 text-[10px]'"></i>
                    {{ teacher.fileStatus }}
                  </app-badge>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">{{ teacher.lastActivity }}</td>
                <td class="px-6 py-4 text-right">
                  <app-button variant="outline" size="sm" icon="pi-briefcase">Contrats</app-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class TeacherFilesComponent implements OnInit {
  teachers$!: Observable<TeacherFile[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.teachers$ = this.universityService.getTeacherFiles();
  }

  getStatusVariant(status: string): any {
    switch (status) {
      case 'Complet': return 'success';
      case 'Incomplet': return 'danger';
      case 'En attente': return 'warning';
      default: return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Complet': return 'pi-check-circle';
      case 'Incomplet': return 'pi-exclamation-circle';
      case 'En attente': return 'pi-clock';
      default: return 'pi-info-circle';
    }
  }
}
