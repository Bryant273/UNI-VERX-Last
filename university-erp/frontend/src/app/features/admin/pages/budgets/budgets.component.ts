import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { BudgetItem } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ProgressComponent } from '../../../../shared/components/ui/progress/progress.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, ProgressComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Budgets & Trésorerie</h2>
          <p class="text-slate-500">Suivi des revenus et dépenses de l'université pour l'exercice 2025.</p>
        </div>
        <div class="flex gap-2">
          <app-button variant="outline" icon="pi-download">Exporter PDF</app-button>
          <app-button icon="pi-plus">Nouvelle Transaction</app-button>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <app-card>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium text-slate-500">Total Revenus</span>
            <span class="text-2xl font-bold text-emerald-600">{{ (totalIncomes$ | async) | number:'1.0-0' }} FCFA</span>
            <div class="mt-2 flex items-center gap-1 text-[10px] text-emerald-600">
              <i class="pi pi-arrow-up"></i>
              <span>+12% par rapport à 2024</span>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium text-slate-500">Total Dépenses</span>
            <span class="text-2xl font-bold text-rose-600">{{ (totalExpenses$ | async) | number:'1.0-0' }} FCFA</span>
            <div class="mt-2 flex items-center gap-1 text-[10px] text-rose-600">
              <i class="pi pi-arrow-up"></i>
              <span>+5.4% par rapport à 2024</span>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium text-slate-500">Solde Net</span>
            <span class="text-2xl font-bold text-blue-600">{{ (balance$ | async) | number:'1.0-0' }} FCFA</span>
            <div class="mt-2">
              <app-progress [value]="(marginPercent$ | async) || 0" color="blue" size="sm"></app-progress>
              <span class="text-[10px] text-slate-400">Marge opérationnelle: {{ (marginPercent$ | async) | number:'1.1-1' }}%</span>
            </div>
          </div>
        </app-card>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <app-card title="Répartition des Revenus">
          <div class="space-y-4">
            <div *ngFor="let item of incomes$ | async" class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-medium text-slate-700">{{ item.categoryLabel }}</span>
                <span class="text-slate-500">{{ item.amount | number:'1.0-0' }} FCFA</span>
              </div>
              <app-progress [value]="calculatePercent(item.amount, (totalIncomes$ | async) || 1)" color="emerald" size="xs"></app-progress>
            </div>
          </div>
        </app-card>

        <app-card title="Répartition des Dépenses">
          <div class="space-y-4">
            <div *ngFor="let item of expenses$ | async" class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-medium text-slate-700">{{ item.categoryLabel }}</span>
                <span class="text-slate-500">{{ item.amount | number:'1.0-0' }} FCFA</span>
              </div>
              <app-progress [value]="calculatePercent(item.amount, (totalExpenses$ | async) || 1)" color="rose" size="xs"></app-progress>
            </div>
          </div>
        </app-card>
      </div>

      <app-card title="Historique des Transactions Récentes">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-500">
            <thead class="bg-slate-50 text-xs uppercase text-slate-700 font-semibold">
              <tr>
                <th class="px-6 py-3">Catégorie</th>
                <th class="px-6 py-3">Année</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of budget$ | async" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900">{{ item.categoryLabel }}</td>
                <td class="px-6 py-4 text-xs">{{ item.year }}</td>
                <td class="px-6 py-4">
                  <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ' + 
                    (item.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100')">
                    {{ item.type === 'income' ? 'Revenu' : 'Dépense' }}
                  </span>
                </td>
                <td [class]="'px-6 py-4 text-right font-bold ' + (item.type === 'income' ? 'text-emerald-600' : 'text-rose-600')">
                  {{ item.type === 'income' ? '+' : '-' }} {{ item.amount | number:'1.0-0' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class BudgetsComponent implements OnInit {
  budget$!: Observable<BudgetItem[]>;
  incomes$!: Observable<BudgetItem[]>;
  expenses$!: Observable<BudgetItem[]>;
  totalIncomes$!: Observable<number>;
  totalExpenses$!: Observable<number>;
  balance$!: Observable<number>;
  marginPercent$!: Observable<number>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.budget$ = this.universityService.getBudgets();
    
    this.incomes$ = this.budget$.pipe(
      map((items: BudgetItem[]) => items.filter((i: BudgetItem) => i.type === 'income'))
    );
    
    this.expenses$ = this.budget$.pipe(
      map((items: BudgetItem[]) => items.filter((i: BudgetItem) => i.type === 'expense'))
    );

    this.totalIncomes$ = this.incomes$.pipe(
      map((items: BudgetItem[]) => items.reduce((acc: number, i: BudgetItem) => acc + i.amount, 0))
    );

    this.totalExpenses$ = this.expenses$.pipe(
      map((items: BudgetItem[]) => items.reduce((acc: number, i: BudgetItem) => acc + i.amount, 0))
    );

    this.balance$ = this.universityService.getBudgets().pipe(
      map((items: BudgetItem[]) => {
        const inc = items.filter((i: BudgetItem) => i.type === 'income').reduce((acc: number, i: BudgetItem) => acc + i.amount, 0);
        const exp = items.filter((i: BudgetItem) => i.type === 'expense').reduce((acc: number, i: BudgetItem) => acc + i.amount, 0);
        return inc - exp;
      })
    );

    this.marginPercent$ = this.universityService.getBudgets().pipe(
      map((items: BudgetItem[]) => {
        const inc = items.filter((i: BudgetItem) => i.type === 'income').reduce((acc: number, i: BudgetItem) => acc + i.amount, 0);
        const exp = items.filter((i: BudgetItem) => i.type === 'expense').reduce((acc: number, i: BudgetItem) => acc + i.amount, 0);
        if (inc === 0) return 0;
        return ((inc - exp) / inc) * 100;
      })
    );
  }

  calculatePercent(amount: number, total: number): number {
    return (amount / total) * 100;
  }
}
