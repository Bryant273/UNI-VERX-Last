import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable, combineLatest, map } from 'rxjs';
import { SemesterResult, AnnualResult, CourseResult } from '../../../../core/models/university.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div class="space-y-2">
          <h1 class="text-3xl font-black text-slate-900 leading-tight">Mes Résultats</h1>
          <p class="text-slate-500 text-lg">Consultez vos notes et téléchargez vos bulletins officiels.</p>
        </div>
        <div class="flex flex-wrap gap-4">
           <div class="flex flex-col gap-1.5">
             <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Affichage</label>
             <select [(ngModel)]="displayType" class="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-w-[160px]">
               <option value="bulletin">Bulletin Officiel</option>
               <option value="course">Par Matière</option>
             </select>
           </div>
           
           <div *ngIf="displayType === 'bulletin'" class="flex flex-col gap-1.5">
             <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Période</label>
             <select [(ngModel)]="selectedSemester" class="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none min-w-[160px]">
               <option value="all">Annuel</option>
               <option value="S1">Semestre 1</option>
               <option value="S2">Semestre 2</option>
             </select>
           </div>

           <button class="h-[42px] mt-auto flex items-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95">
             <i class="pi pi-download"></i>
             <span>Télécharger</span>
           </button>
        </div>
      </div>

      <!-- Student Info Card -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase">Matricule</p>
            <p class="font-bold text-slate-900">2023001</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase">Filière</p>
            <p class="font-bold text-slate-900">Informatique</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase">Niveau</p>
            <p class="font-bold text-slate-900">Licence 3</p>
          </div>
          <div class="space-y-1 text-right">
            <p class="text-xs font-bold text-slate-400 uppercase">Année</p>
            <p class="font-bold text-slate-900">2024-2025</p>
          </div>
      </div>

      <!-- Content Area -->
      <div *ngIf="displayType === 'bulletin'" class="space-y-10">
        <!-- Semester Table(s) -->
        <div *ngFor="let s of visibleSemesters" class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-black text-slate-800 uppercase tracking-tight">Bulletin {{ s.name }}</h3>
            <div class="flex items-center gap-4">
               <span class="text-sm font-bold text-slate-500">Moyenne: <span class="text-blue-600 font-black">{{ s.data.average }}/20</span></span>
               <span class="h-5 w-[1px] bg-slate-200"></span>
               <span class="text-sm font-bold text-slate-500">Crédits: <span class="text-slate-900">{{ s.data.credits }}</span></span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-xs font-black text-slate-400 uppercase tracking-widest bg-white">
                  <th class="px-8 py-5 w-[25%]">Unité d'Enseignement</th>
                  <th class="px-8 py-5">Module</th>
                  <th class="px-8 py-5 text-center">Note</th>
                  <th class="px-8 py-5 text-center">Crédits</th>
                  <th class="px-8 py-5 text-right">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <ng-container *ngFor="let ue of getUeKeys(s.data.groupedCourses); let ueIdx = index">
                  <tr *ngFor="let course of s.data.groupedCourses[ue]; let courseIdx = index" class="hover:bg-slate-50/50 transition-colors group">
                    <td *ngIf="courseIdx === 0" [attr.rowspan]="s.data.groupedCourses[ue].length" class="px-8 py-5 align-top font-black text-slate-700 border-r border-slate-50 bg-slate-50/20">
                      {{ ue }}
                    </td>
                    <td class="px-8 py-5">
                      <div class="font-bold text-slate-900">{{ course.name }}</div>
                      <div class="text-xs text-slate-400">{{ course.teacher }}</div>
                    </td>
                    <td class="px-8 py-5 text-center">
                      <span class="inline-flex h-9 w-14 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        {{ course.grade }}
                      </span>
                    </td>
                    <td class="px-8 py-5 text-center font-bold text-slate-600">
                      {{ course.credits }}
                    </td>
                    <td class="px-8 py-5 text-right">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                            [ngClass]="course.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                        <i class="pi" [ngClass]="course.status === 'validated' ? 'pi-check-circle' : 'pi-times-circle'"></i>
                        {{ course.status === 'validated' ? 'Validé' : 'Échec' }}
                      </span>
                    </td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Annual Summary Summary -->
        <div *ngIf="selectedSemester === 'all' && annualResults$ | async as annual" class="grid md:grid-cols-4 gap-8">
           <div class="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
             <p class="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Moyenne Annuelle</p>
             <h4 class="text-5xl font-black mb-4">{{ annual.average }}/20</h4>
             <span class="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{{ annual.mention }}</span>
           </div>
           
           <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p class="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Crédits</p>
             <h4 class="text-3xl font-black text-slate-900">{{ annual.credits }}</h4>
             <p class="text-amber-600 text-[10px] font-black uppercase tracking-widest mt-2">{{ annual.creditsStatus }}</p>
           </div>

           <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p class="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Classement</p>
             <h4 class="text-3xl font-black text-slate-900">{{ annual.rank }}</h4>
             <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">sur {{ annual.totalStudents }}</p>
           </div>

           <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
             <p class="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Décision Finale</p>
             <h4 class="text-2xl font-black text-green-600">{{ annual.status }}</h4>
             <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Année Validée</p>
           </div>
        </div>
      </div>

       <div *ngIf="displayType === 'course'" class="flex items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div class="text-center space-y-4">
             <div class="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
                <i class="pi pi-search text-3xl"></i>
             </div>
             <p class="text-slate-400 font-bold">Sélectionnez une matière pour voir le détail des notes.</p>
             <button class="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">Parcourir les matières</button>
          </div>
       </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 40px; }
  `]
})
export class StudentResultsComponent implements OnInit {
  displayType: 'bulletin' | 'course' = 'bulletin';
  selectedSemester: 'all' | 'S1' | 'S2' = 'all';

  semesterResults$!: Observable<{ s1: SemesterResult; s2: SemesterResult; annual: AnnualResult } | null>;
  annualResults$!: Observable<AnnualResult | undefined>;
  
  visibleSemesters: { name: string; data: SemesterResult }[] = [];

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.semesterResults$ = this.universityService.getStudentResults();
    this.annualResults$ = this.semesterResults$.pipe(map(res => res?.annual));

    this.semesterResults$.subscribe(res => {
      this.updateVisibleSemesters(res);
    });
  }

  updateVisibleSemesters(res: any) {
    if (!res) return;
    this.visibleSemesters = [];
    if (this.selectedSemester === 'all' || this.selectedSemester === 'S1') {
      this.visibleSemesters.push({ name: 'Semestre 1', data: res.s1 });
    }
    if (this.selectedSemester === 'all' || this.selectedSemester === 'S2') {
      this.visibleSemesters.push({ name: 'Semestre 2', data: res.s2 });
    }
  }

  getUeKeys(groupedCourses: Record<string, CourseResult[]>): string[] {
    return Object.keys(groupedCourses);
  }

  // Triggered by ngModelChange if needed, or we just use getters
  ngDoCheck() {
    this.semesterResults$.subscribe(res => {
      this.updateVisibleSemesters(res);
    });
  }
}
