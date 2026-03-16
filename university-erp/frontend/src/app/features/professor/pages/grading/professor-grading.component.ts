import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable, map } from 'rxjs';
import { ProfessorStudentGrade, UniversityClass, UniversityModule } from '../../../../core/models/university.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-professor-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Header & Filters -->
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8 transition-all hover:shadow-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-1">
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Saisie des Notes</h1>
            <p class="text-slate-500 font-medium">Gérez et validez les notes de vos étudiants par module.</p>
          </div>
          <div class="flex items-center gap-3">
             <button class="h-12 flex items-center gap-2 rounded-2xl bg-white px-6 font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                <i class="pi pi-print"></i>
                <span>Imprimer PV</span>
             </button>
             <button class="h-12 flex items-center gap-2 rounded-2xl bg-slate-900 px-6 font-bold text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                <i class="pi pi-save"></i>
                <span>Sauvegarder tout</span>
             </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div class="space-y-2">
             <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
             <select [(ngModel)]="selectedClass" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
               <option *ngFor="let c of (classes$ | async)" [value]="c.id">{{ c.name }}</option>
             </select>
           </div>
           
           <div class="space-y-2">
             <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Module</label>
             <select [(ngModel)]="selectedModule" class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
               <option *ngFor="let m of (modules$ | async)" [value]="m.id">{{ m.name }}</option>
             </select>
           </div>

           <div class="space-y-2">
             <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session</label>
             <select class="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none">
               <option value="normal">Normale (Juin 2025)</option>
               <option value="rattrapage">Rattrapage (Sept 2025)</option>
             </select>
           </div>

           <div class="flex items-end justify-end">
             <div class="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 w-full md:w-auto">
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
                <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Saisie déverrouillée</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white border-b border-slate-50">
                <th class="px-8 py-6 w-[350px]">Étudiant</th>
                <th class="px-8 py-6 text-center">Examen (60%)</th>
                <th class="px-8 py-6 text-center">TD (20%)</th>
                <th class="px-8 py-6 text-center">TP (20%)</th>
                <th class="px-8 py-6 text-center">Moy. QCM</th>
                <th class="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let student of (students$ | async)" class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{{ student.name }}</div>
                      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ student.number }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <input type="number" step="0.25" min="0" max="20" 
                         [ngModel]="student.grades['bdd']?.examen" 
                         [disabled]="student.locked?.['bdd']?.examen"
                         class="w-20 bg-slate-50 border-none rounded-xl px-2 py-3 text-center font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                </td>
                <td class="px-8 py-6 text-center">
                  <input type="number" step="0.25" min="0" max="20" 
                         [ngModel]="student.grades['bdd']?.td"
                         [disabled]="student.locked?.['bdd']?.td"
                         class="w-20 bg-slate-50 border-none rounded-xl px-2 py-3 text-center font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                </td>
                <td class="px-8 py-6 text-center">
                  <input type="number" step="0.25" min="0" max="20" 
                         [ngModel]="student.grades['bdd']?.tp"
                         [disabled]="student.locked?.['bdd']?.tp"
                         class="w-20 bg-slate-50 border-none rounded-xl px-2 py-3 text-center font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="inline-flex px-4 py-2 bg-indigo-50 text-indigo-700 font-black rounded-xl text-sm border border-indigo-100">
                    {{ student.grades['bdd']?.qcm_moyenne || '--' }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="p-4 text-slate-300 hover:text-blue-600 transition-colors">
                     <i class="pi pi-lock-open text-xl"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="!(students$ | async)?.length" class="text-center py-20 bg-slate-50/50">
           <div class="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg shadow-slate-100 text-slate-300 mb-6">
              <i class="pi pi-users text-3xl"></i>
           </div>
           <h4 class="text-xl font-black text-slate-900 mb-2">Aucun étudiant trouvé</h4>
           <p class="text-slate-500 max-w-xs mx-auto">Veuillez sélectionner une classe et un module valides pour commencer la saisie.</p>
        </div>
      </div>

      <!-- Bottom Info -->
      <div class="flex items-center justify-between p-8 bg-blue-50 rounded-3xl border border-blue-100">
         <div class="flex items-center gap-4 text-blue-800">
            <i class="pi pi-info-circle text-2xl"></i>
            <p class="text-sm font-bold">Important: Une fois que vous "verrouillez" une colonne de notes, elle ne pourra plus être modifiée sans l'autorisation de la scolarité.</p>
         </div>
         <button class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
            Verrouiller le PV
         </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
  `]
})
export class ProfessorGradingComponent implements OnInit {
  selectedClass: string = 'l3-info';
  selectedModule: string = 'bdd';

  classes$!: Observable<UniversityClass[]>;
  modules$!: Observable<UniversityModule[]>;
  students$!: Observable<ProfessorStudentGrade[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.classes$ = this.universityService.getClasses();
    this.modules$ = this.universityService.getModulesByDepartment('cs'); // Mocking with CS
    
    this.students$ = this.universityService.getProfessorStudents().pipe(
      map((data: Record<string, ProfessorStudentGrade[]>) => data[this.selectedClass] || [])
    );
  }
}
