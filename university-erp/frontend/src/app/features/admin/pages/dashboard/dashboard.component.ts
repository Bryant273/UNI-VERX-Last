import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../shared/components/layout/stat-card/stat-card.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { UniversityService } from '../../../../core/services/university.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, CardComponent],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div class="p-6 rounded-lg bg-white shadow-sm border border-slate-200 w-full flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {{ greeting }}, Admin !
            </h1>
            <p class="text-slate-500 mt-1">Bienvenue sur votre tableau de bord.</p>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-md border border-slate-200">
            <i class="pi pi-calendar"></i>
            <span>{{ currentDate | date:'mediumDate' }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <app-stat-card 
          title="Total Étudiants" 
          [value]="(studentCount$ | async) || '0'" 
          icon="pi-users" 
          iconBgClass="bg-blue-100" 
          iconTextClass="text-blue-600"
          trendValue="+150" 
          trendLabel="depuis S1"
        ></app-stat-card>
        
        <app-stat-card 
          title="Total Professeurs" 
          [value]="(professorCount$ | async) || '0'" 
          icon="pi-user" 
          iconBgClass="bg-indigo-100" 
          iconTextClass="text-indigo-600"
          trendValue="+12" 
          trendLabel="nouvelles recrues"
        ></app-stat-card>

        <app-stat-card 
          title="Cours Actifs" 
          [value]="(courseCount$ | async) || '0'" 
          icon="pi-book" 
          iconBgClass="bg-emerald-100" 
          iconTextClass="text-emerald-600"
          trendValue="Tous" 
          trendLabel="départements"
        ></app-stat-card>
      </div>

      <!-- Main Layout -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
           <!-- Stats Chart Placeholder in Card -->
           <app-card title="Statistiques de l'université" description="Taux d'inscription et de diplomation des 5 dernières années.">
              <div class="h-[300px] flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-300">
                <div class="text-slate-400 flex flex-col items-center gap-2">
                  <i class="pi pi-chart-bar text-3xl"></i>
                  <span>Visualisation Graphique (Recharts-like)</span>
                </div>
              </div>
           </app-card>

           <!-- Recent Activity -->
           <app-card title="Activités Récentes">
              <div class="space-y-4">
                <div class="flex items-start gap-4" *ngFor="let activity of activities">
                  <div [class]="'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ' + activity.bgClass">
                    <i [class]="'pi text-sm ' + activity.icon + ' ' + activity.textClass"></i>
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium leading-none text-slate-900">{{ activity.title }}</p>
                    <p class="text-sm text-slate-500">{{ activity.description }}</p>
                    <p class="text-xs text-slate-400">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
           </app-card>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
           <!-- Strategic Actions -->
           <app-card title="Accès Stratégiques" description="Outils de pilotage de l'université.">
              <div class="grid grid-cols-2 gap-4">
                <div *ngFor="let action of strategicActions" 
                     class="cursor-pointer group flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-500 hover:shadow-md h-24">
                  <div class="text-blue-600 group-hover:scale-110 transition-transform">
                    <i [class]="'pi text-xl ' + action.icon"></i>
                  </div>
                  <span class="text-center text-[10px] font-bold text-slate-700 uppercase tracking-tight">{{ action.label }}</span>
                </div>
              </div>
           </app-card>

           <!-- AI Report Card -->
           <div class="p-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg space-y-4">
              <div class="flex items-center gap-2">
                <i class="pi pi-sparkles"></i>
                <h3 class="font-bold">IA Rapport Flash</h3>
              </div>
              <p class="text-sm text-blue-100">Générez une analyse instantanée de la performance académique cette semaine.</p>
              <button class="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold transition-colors border border-white/20">
                Générer le rapport
              </button>
           </div>
        </div>
      </div>
    </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  greeting = '';
  
  studentCount$!: Observable<string>;
  professorCount$!: Observable<string>;
  courseCount$!: Observable<string>;

  activities = [
    { title: 'Nouvelle clé API générée', description: 'Fournisseur ERP connecté avec succès.', time: 'il y a 2 heures', icon: 'pi-key', bgClass: 'bg-emerald-100', textClass: 'text-emerald-600' },
    { title: 'Sauvegarde Système Terminée', description: 'La sauvegarde de la base de données a fini sans erreurs.', time: 'il y a 5 heures', icon: 'pi-database', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
    { title: 'Tentative de Connexion Échouée', description: 'Plusieurs échecs de connexion depuis l\'IP 192.168.1.1', time: 'il y a 12 heures', icon: 'pi-exclamation-triangle', bgClass: 'bg-red-100', textClass: 'text-red-600' },
  ];

  strategicActions = [
    { label: 'Suivi Budgétaire', icon: 'pi-chart-line', route: '/admin/budgets' },
    { label: 'Gestion Départements', icon: 'pi-building', route: '/admin/departments' },
    { label: 'Consulter Contrats', icon: 'pi-file-pdf', route: '/admin/contracts' },
    { label: 'Statistiques', icon: 'pi-chart-pie', route: '/admin/stats' },
  ];

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.updateGreeting();
    
    const stats$ = this.universityService.getStats();
    
    this.studentCount$ = stats$.pipe(map((s: {students: number}) => s.students.toString()));
    this.professorCount$ = stats$.pipe(map((s: {professors: number}) => s.professors.toString()));
    this.courseCount$ = stats$.pipe(map((s: {courses: number}) => s.courses.toString()));
  }

  private updateGreeting(): void {
    const hours = new Date().getHours();
    if (hours < 12) this.greeting = 'Bonjour';
    else if (hours < 18) this.greeting = 'Bon après-midi';
    else this.greeting = 'Bonsoir';
  }
}
