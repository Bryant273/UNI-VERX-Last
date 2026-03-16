import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Ticket } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent, InputComponent, AvatarComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Support & Messagerie</h2>
          <p class="text-slate-500">Gérez les tickets de support et les communications administratives.</p>
        </div>
        <app-button icon="pi-plus">Nouveau Ticket</app-button>
      </div>

      <div class="grid gap-6 lg:grid-cols-12 h-[calc(100vh-240px)]">
        <!-- Sidebar: Ticket List -->
        <div class="lg:col-span-4 flex flex-col h-full overflow-hidden">
          <app-card class="flex-1 flex flex-col overflow-hidden p-0">
            <div class="p-4 border-b border-slate-100 flex flex-col gap-3">
              <app-input placeholder="Rechercher un ticket..." icon="pi-search"></app-input>
              <div class="flex gap-2">
                <button class="px-3 py-1 text-[10px] font-bold rounded bg-blue-50 text-blue-600 border border-blue-200">Tout</button>
                <button class="px-3 py-1 text-[10px] font-bold rounded hover:bg-slate-50 text-slate-500 border border-transparent">Ouverts</button>
                <button class="px-3 py-1 text-[10px] font-bold rounded hover:bg-slate-50 text-slate-500 border border-transparent">Fermés</button>
              </div>
            </div>
            
            <div class="flex-1 overflow-y-auto">
              <div *ngFor="let ticket of tickets$ | async" 
                   (click)="selectTicket(ticket)"
                   [class]="'p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50/50 ' + (selectedTicket?.id === ticket.id ? 'bg-blue-50/30 border-l-4 border-l-blue-600' : '')">
                <div class="flex justify-between items-start mb-1">
                  <span [class]="'text-[9px] font-bold uppercase ' + getDeptClass(ticket.department)">{{ ticket.department }}</span>
                  <span class="text-[9px] text-slate-400 font-mono">#{{ ticket.id }}</span>
                </div>
                <h4 class="text-sm font-bold text-slate-900 truncate">{{ ticket.subject }}</h4>
                <div class="mt-2 flex items-center justify-between">
                   <div class="flex items-center gap-2">
                     <app-avatar [name]="ticket.author" size="xs"></app-avatar>
                     <span class="text-[10px] text-slate-500">{{ ticket.author }}</span>
                   </div>
                   <app-badge [variant]="getStatusVariant(ticket.status)" size="sm">
                     {{ getStatusLabel(ticket.status) }}
                   </app-badge>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-8 flex flex-col h-full overflow-hidden">
          <app-card *ngIf="selectedTicket" class="flex-1 flex flex-col overflow-hidden p-0">
             <!-- Chat Header -->
             <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div class="flex items-center gap-3">
                  <div>
                    <h3 class="text-base font-bold text-slate-900">{{ selectedTicket.subject }}</h3>
                    <p class="text-[10px] text-slate-500">Dernière activité le {{ selectedTicket.lastUpdate | date:'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <app-button variant="outline" size="sm" icon="pi-check">Fermer Ticket</app-button>
                  <app-button variant="outline" size="sm" icon="pi-ellipsis-v"></app-button>
                </div>
             </div>

             <!-- Chat Messages -->
             <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <div *ngFor="let msg of selectedTicket.messages" 
                     [class]="'flex gap-3 ' + (msg.author === 'Admin' ? 'justify-end' : '')">
                  <app-avatar *ngIf="msg.author !== 'Admin'" [name]="msg.author" size="sm"></app-avatar>
                  <div [class]="'max-w-[80%] rounded-xl p-4 ' + (msg.author === 'Admin' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none')">
                    <p class="text-xs font-bold mb-1 opacity-80">{{ msg.author }}</p>
                    <p class="text-sm leading-relaxed">{{ msg.content }}</p>
                    <p class="mt-2 text-[9px] opacity-60 text-right">{{ msg.date | date:'HH:mm' }}</p>
                  </div>
                  <app-avatar *ngIf="msg.author === 'Admin'" name="AD" size="sm"></app-avatar>
                </div>
             </div>

             <!-- Chat Footer -->
             <div class="p-4 border-t border-slate-100">
                <div class="flex gap-3">
                   <div class="flex-1">
                     <textarea class="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20" 
                               placeholder="Écrivez votre réponse ici..."></textarea>
                   </div>
                   <div class="flex flex-col gap-2">
                      <button class="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <i class="pi pi-send"></i>
                      </button>
                      <button class="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors">
                        <i class="pi pi-paperclip"></i>
                      </button>
                   </div>
                </div>
             </div>
          </app-card>

          <!-- Empty State -->
          <app-card *ngIf="!selectedTicket" class="flex-1 flex flex-col items-center justify-center bg-slate-50/30">
             <div class="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
               <i class="pi pi-comments text-3xl text-blue-200"></i>
             </div>
             <p class="text-sm font-bold text-slate-900">Sélectionnez un ticket</p>
             <p class="text-xs text-slate-500 mt-1">Choisissez un ticket dans la liste pour voir la conversation.</p>
          </app-card>
        </div>
      </div>
    </div>
  `
})
export class TicketsComponent implements OnInit {
  tickets$!: Observable<Ticket[]>;
  selectedTicket: Ticket | null = null;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.tickets$ = this.universityService.getTickets();
    this.tickets$.subscribe((tickets: Ticket[]) => {
      if (tickets.length > 0) this.selectedTicket = tickets[0] || null;
    });
  }

  selectTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
  }

  getStatusVariant(status: string): 'primary' | 'success' | 'warning' | 'error' | 'info' {
    switch (status) {
      case 'open': return 'info';
      case 'pending': return 'warning';
      case 'closed': return 'success';
      default: return 'primary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'pending': return 'En attente';
      case 'closed': return 'Fermé';
      default: return status;
    }
  }

  getDeptClass(dept: string): string {
    switch (dept) {
      case 'scolarite': return 'text-purple-600';
      case 'technique': return 'text-orange-600';
      case 'pedagogique': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  }
}
