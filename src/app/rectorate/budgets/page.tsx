
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Plus, Download, TrendingUp, TrendingDown, Goal } from 'lucide-react';
import { budgetData, type BudgetItem } from '@/lib/budgets-data';
import { allIncomes } from '@/lib/treasury-data';
import { allExpenses } from '@/lib/treasury-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: React.ElementType, color: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{change}</p>
        </CardContent>
    </Card>
);

const getActualAmount = (item: BudgetItem) => {
    if (item.type === 'income') {
        return allIncomes
            .filter(i => i.type === item.category && i.status === 'completed')
            .reduce((acc, curr) => acc + curr.amount, 0);
    } else {
        return allExpenses
            .filter(e => e.category === item.category && e.status === 'paid')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }
};

export default function BudgetsPage() {
    const totalBudgetedIncome = budgetData.filter(b => b.type === 'income').reduce((acc, b) => acc + b.amount, 0);
    const totalActualIncome = allIncomes.filter(i => i.status === 'completed').reduce((acc, i) => acc + i.amount, 0);

    const totalBudgetedExpense = budgetData.filter(b => b.type === 'expense').reduce((acc, b) => acc + b.amount, 0);
    const totalActualExpense = allExpenses.filter(e => e.status === 'paid').reduce((acc, e) => acc + e.amount, 0);
    
    const performance = totalBudgetedIncome > 0 ? (totalActualIncome / totalBudgetedIncome) * 100 : 0;
    const expenseRatio = totalBudgetedExpense > 0 ? (totalActualExpense / totalBudgetedExpense) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 /> Suivi Budgétaire - 2025
              </CardTitle>
              <CardDescription>
                Planifiez, suivez et analysez les budgets alloués aux différents départements et projets.
              </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><Plus className="mr-2"/>Ajouter une ligne</Button>
                <Button><Download className="mr-2"/>Exporter le rapport</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Budget Total Prévu" value={`${(totalBudgetedIncome - totalBudgetedExpense).toLocaleString('fr-FR')} FCFA`} change="Solde prévisionnel" icon={Goal} color="text-primary"/>
            <StatCard title="Revenus Réalisés" value={`${totalActualIncome.toLocaleString('fr-FR')} FCFA`} change={`sur ${totalBudgetedIncome.toLocaleString('fr-FR')} FCFA prévus`} icon={TrendingUp} color="text-green-500"/>
            <StatCard title="Dépenses Réalisées" value={`${totalActualExpense.toLocaleString('fr-FR')} FCFA`} change={`sur ${totalBudgetedExpense.toLocaleString('fr-FR')} FCFA prévus`} icon={TrendingDown} color="text-red-500"/>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Performance Budgétaire (Revenus)</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{performance.toFixed(1)}%</p>
                    <Progress value={performance} className="h-2 mt-2" />
                </CardContent>
            </Card>
        </div>

      <Card>
        <CardHeader>
            <CardTitle>Analyse Comparative Détaillée</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Catégorie</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Montant Budgété</TableHead>
                        <TableHead className="text-right">Montant Réel</TableHead>
                        <TableHead className="text-right">Écart</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {budgetData.map(item => {
                        const actualAmount = getActualAmount(item);
                        const difference = actualAmount - item.amount;
                        const isIncome = item.type === 'income';
                        const isGood = isIncome ? difference >= 0 : difference <= 0;
                        const isBad = isIncome ? difference < 0 : difference > 0;
                        
                        return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.categoryLabel}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={isIncome ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}>
                                    {item.type === 'income' ? 'Revenu' : 'Dépense'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{item.amount.toLocaleString('fr-FR')} FCFA</TableCell>
                            <TableCell className="text-right font-mono">{actualAmount.toLocaleString('fr-FR')} FCFA</TableCell>
                            <TableCell className={cn("text-right font-mono font-semibold", isGood && 'text-green-600', isBad && 'text-red-600')}>
                                {difference.toLocaleString('fr-FR')} FCFA
                            </TableCell>
                        </TableRow>
                        )
                    })}
                     <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={2}>TOTAL REVENUS</TableCell>
                        <TableCell className="text-right font-mono">{totalBudgetedIncome.toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell className="text-right font-mono">{totalActualIncome.toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell className={cn("text-right font-mono", (totalActualIncome - totalBudgetedIncome) >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {(totalActualIncome - totalBudgetedIncome).toLocaleString('fr-FR')} FCFA
                        </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={2}>TOTAL DÉPENSES</TableCell>
                        <TableCell className="text-right font-mono">{totalBudgetedExpense.toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell className="text-right font-mono">{totalActualExpense.toLocaleString('fr-FR')} FCFA</TableCell>
                         <TableCell className={cn("text-right font-mono", (totalActualExpense - totalBudgetedExpense) <= 0 ? 'text-green-600' : 'text-red-600')}>
                            {(totalActualExpense - totalBudgetedExpense).toLocaleString('fr-FR')} FCFA
                        </TableCell>
                    </TableRow>
                    <TableRow className="border-t-2 border-primary">
                        <TableCell colSpan={2} className="font-extrabold text-lg">SOLDE</TableCell>
                        <TableCell className="text-right font-mono font-extrabold text-lg">{(totalBudgetedIncome - totalBudgetedExpense).toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell className="text-right font-mono font-extrabold text-lg">{(totalActualIncome - totalActualExpense).toLocaleString('fr-FR')} FCFA</TableCell>
                        <TableCell className="text-right font-mono font-extrabold text-lg">
                           {((totalActualIncome - totalActualExpense) - (totalBudgetedIncome - totalBudgetedExpense)).toLocaleString('fr-FR')} FCFA
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
