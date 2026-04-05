import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { UniversityUser } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { Observable } from 'rxjs';

import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, InputComponent, AvatarComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Gestion des Utilisateurs</h2>
          <p class="text-slate-500">Gérez tous les comptes de l'université, leurs rôles et permissions.</p>
        </div>
        <app-button icon="pi-plus">Ajouter un utilisateur</app-button>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-slate-200">
        <nav class="flex gap-8">
          <button (click)="activeTab = 'users'" 
                  [class]="'pb-4 text-sm font-medium transition-colors border-b-2 ' + (activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')">
            Utilisateurs
          </button>
          <button (click)="activeTab = 'roles'" 
                  [class]="'pb-4 text-sm font-medium transition-colors border-b-2 ' + (activeTab === 'roles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700')">
            Rôles & Permissions
          </button>
        </nav>
      </div>

      <!-- Users Content -->
      <div *ngIf="activeTab === 'users'" class="space-y-6">
        <app-card>
          <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
              <div class="relative flex-1">
                <app-input placeholder="Rechercher par nom ou email..." icon="pi-search"></app-input>
              </div>
              <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tous les rôles</option>
                <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
              </select>
              <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div class="flex gap-2">
               <app-button variant="outline" icon="pi-archive" size="sm">Archives</app-button>
               <app-button variant="outline" icon="pi-download" size="sm">Exporter</app-button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-500">
              <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
                <tr>
                  <th scope="col" class="px-6 py-3">Utilisateur</th>
                  <th scope="col" class="px-6 py-3">Rôle</th>
                  <th scope="col" class="px-6 py-3">Statut</th>
                  <th scope="col" class="px-6 py-3">Dernière connexion</th>
                  <th scope="col" class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users$ | async" class="border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <app-avatar [name]="user.name" [src]="user.avatar" size="sm"></app-avatar>
                      <div>
                        <div class="font-semibold text-slate-900">{{ user.name }}</div>
                        <div class="text-xs text-slate-500 font-mono">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ' + getRoleClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div [class]="'h-2 w-2 rounded-full ' + (user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500')"></div>
                      <span class="text-xs font-medium">{{ user.status }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-xs text-slate-500">il y a 2 jours</td>
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
          
          <div class="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
            <div>Affichage de 1 à 5 sur 1,234 utilisateurs</div>
            <div class="flex items-center gap-2">
              <button class="rounded border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Précédent</button>
              <div class="flex items-center gap-1">
                <button class="h-8 w-8 rounded border border-blue-200 bg-blue-50 text-blue-600 font-bold">1</button>
                <button class="h-8 w-8 rounded border border-slate-200 hover:bg-slate-50 transition-colors">2</button>
                <button class="h-8 w-8 rounded border border-slate-200 hover:bg-slate-50 transition-colors">3</button>
              </div>
              <button class="rounded border border-slate-200 px-3 py-1 hover:bg-slate-50 transition-colors">Suivant</button>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Roles Content -->
      <div *ngIf="activeTab === 'roles'" class="space-y-6">
        <app-card title="Rôles et Permissions" description="Visualisez et modifiez les permissions pour chaque rôle au sein de l'université.">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-500">
              <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
                <tr>
                  <th scope="col" class="px-6 py-3">Rôle</th>
                  <th scope="col" class="px-6 py-3">Description</th>
                  <th scope="col" class="px-6 py-3">Utilisateurs</th>
                  <th scope="col" class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let roleKey of roles" class="border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-900">{{ roleKey }}</td>
                  <td class="px-6 py-4 text-xs text-slate-500">Permissions de base pour le rôle {{ roleKey.toLowerCase() }}</td>
                  <td class="px-6 py-4">124</td>
                  <td class="px-6 py-4 text-right">
                    <app-button variant="outline" size="sm" icon="pi-cog text-xs">Gérer</app-button>
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
export class UsersComponent implements OnInit {
  activeTab: 'users' | 'roles' = 'users';
  users$!: Observable<UniversityUser[]>;
  roles: string[] = [];

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.users$ = this.universityService.getUsers();
    this.roles = this.universityService.getRoles();
  }

  getRoleClass(role: string): string {
    const roleClasses: Record<string, string> = {
      'ADMIN': 'bg-rose-100 text-rose-700 border border-rose-200',
      'RECTORATE': 'bg-purple-100 text-purple-700 border border-purple-200',
      'SECRETARIAT': 'bg-amber-100 text-amber-700 border border-amber-200',
      'ACADEMIC ADVISOR': 'bg-sky-100 text-sky-700 border border-sky-200',
      'PROFESSOR': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      'STUDENT': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      'ERP PROVIDER': 'bg-slate-100 text-slate-700 border border-slate-200'
    };
    return roleClasses[role] || 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}
