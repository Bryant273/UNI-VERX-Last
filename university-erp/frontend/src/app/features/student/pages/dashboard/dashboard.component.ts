import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../shared/components/layout/stat-card/stat-card.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Hello, John!</h2>
          <p class="text-slate-500">Welcome back. Here's your overview for Semester 5.</p>
        </div>
        <app-button>View Full Timetable</app-button>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <app-stat-card 
          title="Current GPA" 
          value="3.8/4.0" 
          icon="pi-star-fill" 
          iconBgClass="bg-yellow-100" 
          iconTextClass="text-yellow-600"
          trendValue="Top 15%" 
          trendLabel="of your class"
        ></app-stat-card>
        
        <app-stat-card 
          title="Attendance" 
          value="95%" 
          icon="pi-calendar-plus" 
          iconBgClass="bg-blue-100" 
          iconTextClass="text-blue-600"
          trendValue="Great!" 
          trendLabel="Keep it up"
        ></app-stat-card>
        
        <app-stat-card 
          title="Pending Assignments" 
          value="3" 
          icon="pi-file-edit" 
          iconBgClass="bg-red-100" 
          iconTextClass="text-red-600"
          trendValue="1 due soon" 
          trendColorClass="text-red-500"
          trendIcon="pi-exclamation-circle"
          trendLabel="Tomorrow, 11:59 PM"
        ></app-stat-card>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <app-card title="Today's Classes">
          <div class="space-y-4">
            <div class="flex items-center gap-4 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
               <div class="flex h-12 w-16 flex-col items-center justify-center rounded bg-blue-50 text-blue-700">
                 <span class="text-xs font-bold">09:00</span>
                 <span class="text-xs">11:00</span>
               </div>
               <div class="flex-1">
                 <h4 class="font-semibold text-slate-900">Advanced Algorithms</h4>
                 <p class="text-sm text-slate-500">Room A-204 • Dr. Smith</p>
               </div>
               <span class="rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">Ongoing</span>
            </div>
            
            <div class="flex items-center gap-4 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
               <div class="flex h-12 w-16 flex-col items-center justify-center rounded bg-slate-100 text-slate-600">
                 <span class="text-xs font-bold">14:00</span>
                 <span class="text-xs">16:00</span>
               </div>
               <div class="flex-1">
                 <h4 class="font-semibold text-slate-900">Database Systems</h4>
                 <p class="text-sm text-slate-500">Lab 3 • Dr. Johnson</p>
               </div>
               <span class="rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">Upcoming</span>
            </div>
          </div>
        </app-card>

        <app-card title="Recent Announcements">
          <div class="space-y-4">
            <div class="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div class="mb-1 flex items-center justify-between">
                <span class="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">University Event</span>
                <span class="text-xs text-slate-400">2 days ago</span>
              </div>
              <h4 class="font-medium text-slate-900">Annual Tech Fair Registration</h4>
              <p class="mt-1 text-sm text-slate-500 line-clamp-2">The annual tech fair is back! Register your projects before the end of the month to participate in the competition.</p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `
})
export class StudentDashboardComponent {}
