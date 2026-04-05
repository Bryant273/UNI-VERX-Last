import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UniversityService } from '../../../../core/services/university.service';
import { StudentEnrollment, EnrolledStudent } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-enrollments',
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
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Gestion des Inscriptions</h2>
          <p class="text-slate-500">Traitez les nouvelles demandes et gérez les dossiers des étudiants inscrits.</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-slate-200">
        <button 
          (click)="activeTab = 'new'"
          [class]="'px-6 py-3 text-sm font-medium transition-colors border-b-2 ' + (activeTab === 'new' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')"
        >
          Nouvelles Inscriptions
        </button>
        <button 
          (click)="activeTab = 'enrolled'"
          [class]="'px-6 py-3 text-sm font-medium transition-colors border-b-2 ' + (activeTab === 'enrolled' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')"
        >
          Étudiants Inscrits
        </button>
      </div>

      <!-- Tab Content: New Inscriptions -->
      <div *ngIf="activeTab === 'new'" class="space-y-6">
        <app-card>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-500">
              <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
                <tr>
                  <th class="px-6 py-3">Étudiant</th>
                  <th class="px-6 py-3">Formation demandée</th>
                  <th class="px-6 py-3">Date</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of enrollments$ | async" class="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                  <td class="px-6 py-4">
                    <div class="font-medium text-slate-900">{{ item.firstName }} {{ item.lastName }}</div>
                    <div class="text-xs">{{ item.email }}</div>
                  </td>
                  <td class="px-6 py-4 text-xs">
                    <div class="font-medium text-slate-700">{{ item.level }} - {{ item.program }}</div>
                    <div class="text-slate-500">{{ item.department }}</div>
                  </td>
                  <td class="px-6 py-4 text-xs text-slate-500">{{ item.dateSubmitted }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                       <app-button variant="ghost" icon="pi-eye" size="sm"></app-button>
                       <app-button variant="outline" class="text-green-600" icon="pi-check" size="sm"></app-button>
                       <app-button variant="outline" class="text-red-600" icon="pi-times" size="sm"></app-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card>
      </div>

      <!-- Tab Content: Enrolled Students -->
      <div *ngIf="activeTab === 'enrolled'" class="space-y-6">
        <app-card>
          <div class="mb-4 flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
              <app-input placeholder="Rechercher par nom, matricule..." icon="pi-search"></app-input>
            </div>
            <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">Tous les niveaux</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-500">
              <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
                <tr>
                  <th class="px-6 py-3">Étudiant</th>
                  <th class="px-6 py-3">Formation</th>
                  <th class="px-6 py-3">Moyenne</th>
                  <th class="px-6 py-3">Dossier</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of enrolledStudents$ | async" class="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <app-avatar [name]="student.name" [src]="student.avatar" size="sm"></app-avatar>
                      <div>
                        <div class="font-medium text-slate-900">{{ student.name }}</div>
                        <div class="text-[10px] font-mono text-slate-500">{{ student.studentNumber }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs">
                    <div class="font-medium text-slate-700">{{ student.currentLevel }}</div>
                    <div class="text-slate-500">{{ student.currentProgram }}</div>
                  </td>
                  <td class="px-6 py-4 font-mono font-bold text-slate-900">{{ student.gpa }}/20</td>
                  <td class="px-6 py-4">
                    <app-badge [variant]="getFileStatusVariant(student.fileStatus)">
                      {{ student.fileStatus }}
                    </app-badge>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <app-button variant="ghost" icon="pi-folder-open" size="sm"></app-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class EnrollmentsComponent implements OnInit {
  activeTab: 'new' | 'enrolled' = 'new';
  enrollments$!: Observable<StudentEnrollment[]>;
  enrolledStudents$!: Observable<EnrolledStudent[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.enrollments$ = this.universityService.getEnrollments();
    this.enrolledStudents$ = this.universityService.getEnrolledStudents();
  }

  getFileStatusVariant(status: string): any {
    switch (status) {
      case 'Complet': return 'success';
      case 'Incomplet': return 'danger';
      case 'En attente': return 'warning';
      default: return 'secondary';
    }
  }
}
