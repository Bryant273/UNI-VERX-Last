import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { UniversityService } from '../../../../core/services/university.service';
import { ScholarshipPayment } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { ProgressComponent } from '../../../../shared/components/ui/progress/progress.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-scholarships',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    ButtonComponent, 
    BadgeComponent, 
    AvatarComponent,
    ProgressComponent,
    InputComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Suivi des Paiements & Bourses</h2>
          <p class="text-slate-500">Gérez les frais de scolarité, les bourses et les relances de paiement.</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-card class="bg-blue-600 text-white border-none shadow-blue-200">
          <div class="p-1">
            <p class="text-xs font-medium text-blue-100 uppercase tracking-wider">Total Attendu</p>
            <h3 class="mt-2 text-2xl font-bold">{{ (totalExpected$ | async) | number:'1.0-0' }} FCFA</h3>
            <p class="mt-1 text-[10px] text-blue-200">Revenus prévisionnels 2024</p>
          </div>
        </app-card>

        <app-card>
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Perçu</p>
          <h3 class="mt-2 text-2xl font-bold text-green-600">{{ (totalPaid$ | async) | number:'1.0-0' }} FCFA</h3>
          <div class="mt-2 flex items-center gap-2">
            <app-progress [value]="(collectionRate$ | async) || 0" color="success" class="h-1.5"></app-progress>
            <span class="text-[10px] font-bold text-slate-500">{{ (collectionRate$ | async) | number:'1.0-0' }}%</span>
          </div>
        </app-card>

        <app-card>
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Solde Restant</p>
          <h3 class="mt-2 text-2xl font-bold text-slate-900">{{ (totalRemaining$ | async) | number:'1.0-0' }} FCFA</h3>
          <p class="mt-1 text-[10px] text-slate-400">À recouvrer avant Mars 2025</p>
        </app-card>

        <app-card>
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Paiements en Retard</p>
          <h3 class="mt-2 text-2xl font-bold text-red-600">{{ (lateCount$ | async) }}</h3>
          <p class="mt-1 text-[10px] text-red-400 font-medium">Étudiants à relancer d'urgence</p>
        </app-card>
      </div>

      <!-- Main Table -->
      <app-card>
        <div class="mb-4 flex flex-col sm:flex-row gap-4">
          <app-input class="flex-1" placeholder="Rechercher un étudiant..." icon="pi-search"></app-input>
          <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
             <option value="">Toutes les classes</option>
             <option value="L1">L1</option>
             <option value="L2">L2</option>
             <option value="L3">L3</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-500">
            <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold border-b border-slate-100">
              <tr>
                <th class="px-6 py-3">Étudiant</th>
                <th class="px-6 py-3">Classe</th>
                <th class="px-6 py-3">Progression</th>
                <th class="px-6 py-3">Statut</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of payments$ | async" class="border-b border-slate-100 bg-white hover:bg-slate-50/50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <app-avatar [name]="payment.name" [src]="payment.avatar" size="sm"></app-avatar>
                    <div>
                      <div class="font-medium text-slate-900">{{ payment.name }}</div>
                      <div class="text-[10px] text-slate-500 font-mono">{{ payment.studentNumber }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs font-medium">{{ payment.class }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <app-progress [value]="getProgress(payment)" [color]="getProgressColor(payment)" class="w-24 h-2"></app-progress>
                    <span class="text-[10px] font-mono font-bold">{{ getProgress(payment) }}%</span>
                  </div>
                  <div class="mt-1 text-[9px] text-slate-400">
                    {{ payment.paidAmount | number:'1.0-0' }} / {{ payment.totalAmount | number:'1.0-0' }} FCFA
                  </div>
                </td>
                <td class="px-6 py-4">
                  <app-badge [variant]="getStatusVariant(payment.status)">
                    {{ getStatusLabel(payment.status) }}
                  </app-badge>
                </td>
                <td class="px-6 py-4 text-right">
                   <div class="flex justify-end gap-1">
                      <app-button variant="ghost" icon="pi-plus-circle" size="sm" class="text-blue-600"></app-button>
                      <app-button *ngIf="payment.status === 'late'" variant="ghost" icon="pi-bell" size="sm" class="text-red-500"></app-button>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class ScholarshipsComponent implements OnInit {
  payments$!: Observable<ScholarshipPayment[]>;
  totalExpected$!: Observable<number>;
  totalPaid$!: Observable<number>;
  totalRemaining$!: Observable<number>;
  lateCount$!: Observable<number>;
  collectionRate$!: Observable<number>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.payments$ = this.universityService.getScholarships();

    this.totalExpected$ = this.payments$.pipe(
      map(payments => payments.reduce((acc, p) => acc + p.totalAmount, 0))
    );

    this.totalPaid$ = this.payments$.pipe(
      map(payments => payments.reduce((acc, p) => acc + p.paidAmount, 0))
    );

    this.totalRemaining$ = this.payments$.pipe(
      map(payments => payments.reduce((acc, p) => acc + (p.totalAmount - p.paidAmount), 0))
    );

    this.lateCount$ = this.payments$.pipe(
      map(payments => payments.filter(p => p.status === 'late').length)
    );

    this.collectionRate$ = this.payments$.pipe(
      map(payments => {
        const total = payments.reduce((acc, p) => acc + p.totalAmount, 0);
        const paid = payments.reduce((acc, p) => acc + p.paidAmount, 0);
        return total > 0 ? (paid / total) * 100 : 0;
      })
    );
  }

  getProgress(payment: ScholarshipPayment): number {
    return Math.round((payment.paidAmount / payment.totalAmount) * 100);
  }

  getProgressColor(payment: ScholarshipPayment): any {
    const progress = this.getProgress(payment);
    if (progress >= 100) return 'success';
    if (payment.status === 'late') return 'danger';
    return 'primary';
  }

  getStatusVariant(status: string): any {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'late': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paid': return 'Réglé';
      case 'partial': return 'Partiel';
      case 'late': return 'En Retard';
      default: return status;
    }
  }
}
