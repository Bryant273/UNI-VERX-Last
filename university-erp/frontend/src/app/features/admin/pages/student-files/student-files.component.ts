import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UniversityService } from '../../../../core/services/university.service';
import { EnrolledStudent } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-student-files',
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
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Dossiers Étudiants</h2>
          <p class="text-slate-500">Gérez les documents et la conformité des dossiers académiques.</p>
        </div>
      </div>

      <app-card>
        <div class="mb-4 flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <app-input placeholder="Rechercher un dossier..." icon="pi-search"></app-input>
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
                <th class="px-6 py-3">Étudiant</th>
                <th class="px-6 py-3">Classe</th>
                <th class="px-6 py-3">État du Dossier</th>
                <th class="px-6 py-3">Dernière Maj</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of students$ | async" class="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <app-avatar [name]="student.name" [src]="student.avatar" size="sm"></app-avatar>
                    <div>
                      <div class="font-medium text-slate-900">{{ student.name }}</div>
                      <div class="text-[10px] text-slate-500 font-mono">{{ student.studentNumber }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs font-medium">{{ student.currentLevel }} - {{ student.currentProgram }}</td>
                <td class="px-6 py-4">
                  <app-badge [variant]="getStatusVariant(student.fileStatus)">
                    <i [class]="'pi ' + getStatusIcon(student.fileStatus) + ' mr-1 text-[10px]'"></i>
                    {{ student.fileStatus }}
                  </app-badge>
                </td>
                <td class="px-6 py-4 text-xs text-slate-500">Aujourd'hui</td>
                <td class="px-6 py-4 text-right">
                  <app-button variant="outline" size="sm" icon="pi-folder-open">Gérer</app-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class StudentFilesComponent implements OnInit {
  students$!: Observable<EnrolledStudent[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.students$ = this.universityService.getEnrolledStudents();
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
