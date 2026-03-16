import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../shared/components/layout/stat-card/stat-card.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, CardComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Welcome, Professor!</h2>
        <p class="text-slate-500">Manage your classes, students, and grading.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-4">
        <app-stat-card 
          title="My Courses" 
          value="4" 
          icon="pi-book" 
          iconBgClass="bg-blue-100" 
          iconTextClass="text-blue-600"
          trendValue="Active" 
          trendLabel="this semester"
        ></app-stat-card>
        
        <app-stat-card 
          title="Total Students" 
          value="156" 
          icon="pi-users" 
          iconBgClass="bg-indigo-100" 
          iconTextClass="text-indigo-600"
          trendValue="+12" 
          trendLabel="vs last year"
        ></app-stat-card>
        
        <app-stat-card 
          title="Average Attendance" 
          value="88%" 
          icon="pi-chart-line" 
          iconBgClass="bg-emerald-100" 
          iconTextClass="text-emerald-600"
          trendValue="+5%" 
          trendLabel="vs last month"
        ></app-stat-card>

        <app-stat-card 
          title="Exams to Grade" 
          value="42" 
          icon="pi-pen-to-square" 
          iconBgClass="bg-amber-100" 
          iconTextClass="text-amber-600"
          trendValue="Needs action" 
          trendColorClass="text-amber-500"
          trendIcon="pi-clock"
          trendLabel="Due Friday"
        ></app-stat-card>
      </div>
    </div>
  `
})
export class ProfessorDashboardComponent {}
