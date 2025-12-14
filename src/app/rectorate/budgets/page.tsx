
'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Plus, Download, TrendingUp, TrendingDown, Goal, Edit, Trash2 } from 'lucide-react';
import { budgetData, type BudgetItem } from '@/lib/budgets-data';
import { allIncomes } from '@/lib/treasury-data';
import { allExpenses } from '@/lib/treasury-data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<BudgetItem[]>(budgetData);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const filteredBudgets = useMemo(() => budgets.filter(b => b.year === selectedYear), [budgets, selectedYear]);

    const totalBudgetedIncome = useMemo(() => filteredBudgets.filter(b => b.type === 'income').reduce((acc, b) => acc + b.amount, 0), [filteredBudgets]);
    const totalActualIncome = useMemo(() => allIncomes.filter(i => i.status === 'completed' && new Date(i.date).getFullYear() === selectedYear).reduce((acc, i) => acc + i.amount, 0), [selectedYear]);

    const totalBudgetedExpense = useMemo(() => filteredBudgets.filter(b => b.type === 'expense').reduce((acc, b) => acc + b.amount, 0), [filteredBudgets]);
    const totalActualExpense = useMemo(() => allExpenses.filter(e => e.status === 'paid' && new Date(e.date).getFullYear() === selectedYear).reduce((acc, e) => acc + e.amount, 0), [selectedYear]);
    
    const performance = totalBudgetedIncome > 0 ? (totalActualIncome / totalBudgetedIncome) * 100 : 0;

    const handleSaveBudget = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newBudget: BudgetItem = {
            id: `budget-${Date.now()}`,
            year: selectedYear,
            type: formData.get('type') as 'income' | 'expense',
            categoryLabel: formData.get('label') as string,
            amount: Number(formData.get('amount')),
            category: 'other' // Simplified for demo
        };
        setBudgets(prev => [...prev, newBudget]);
        setIsModalOpen(false);
        toast({ title: 'Ligne budgétaire ajoutée !' });
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 /> Suivi Budgétaire
                        </CardTitle>
                        <CardDescription>
                            Planifiez, suivez et analysez les budgets alloués aux différents départements et projets.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select value={String(selectedYear)} onValueChange={val => setSelectedYear(Number(val))}>
                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[2025, 2024, 2023].map(year => <SelectItem key={year} value={String(year)}>Année {year}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2"/>Nouveau budget</Button>
                        <Button variant="outline"><Download className="mr-2"/>Exporter</Button>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Revenus Prévisionnels</CardTitle></CardHeader>
                <CardContent>
                     <Table><TableHeader><TableRow><TableHead>Catégorie</TableHead><TableHead className="text-right">Montant Budgété</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredBudgets.filter(b => b.type === 'income').map(item => (
                                <TableRow key={item.id}><TableCell className="font-medium">{item.categoryLabel}</TableCell><TableCell className="text-right font-mono">{item.amount.toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                            ))}
                        </TableBody>
                        <TableFooter className="font-bold"><TableRow><TableCell>Total Revenus Prévus</TableCell><TableCell className="text-right font-mono">{totalBudgetedIncome.toLocaleString('fr-FR')} FCFA</TableCell></TableRow></TableFooter>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Dépenses Prévisionnelles</CardTitle></CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Catégorie</TableHead><TableHead className="text-right">Montant Budgété</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredBudgets.filter(b => b.type === 'expense').map(item => (
                                <TableRow key={item.id}><TableCell className="font-medium">{item.categoryLabel}</TableCell><TableCell className="text-right font-mono">{item.amount.toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                            ))}
                        </TableBody>
                        <TableFooter className="font-bold"><TableRow><TableCell>Total Dépenses Prévues</TableCell><TableCell className="text-right font-mono">{totalBudgetedExpense.toLocaleString('fr-FR')} FCFA</TableCell></TableRow></TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>

      <Card>
        <CardHeader>
            <CardTitle>Tableau Récapitulatif et Comparatif</CardTitle>
            <CardDescription>Comparaison entre les montants budgétés et les flux de trésorerie réels.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Catégorie</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Budgété</TableHead><TableHead className="text-right">Réel</TableHead><TableHead className="text-right">Écart</TableHead></TableRow></TableHeader>
                <TableBody>
                     {filteredBudgets.map(item => {
                        const actualAmount = item.type === 'income' ? allIncomes.filter(i => i.status === 'completed' && new Date(i.date).getFullYear() === selectedYear && i.type === item.category).reduce((acc, curr) => acc + curr.amount, 0) : allExpenses.filter(e => e.status === 'paid' && new Date(e.date).getFullYear() === selectedYear && e.category === item.category).reduce((acc, curr) => acc + curr.amount, 0);
                        const difference = actualAmount - item.amount;
                        const isIncome = item.type === 'income';
                        const isGood = isIncome ? difference >= 0 : difference <= 0;
                        const isBad = isIncome ? difference < 0 : difference > 0;
                        return (
                        <TableRow key={`comp-${item.id}`}><TableCell className="font-medium">{item.categoryLabel}</TableCell><TableCell><Badge variant="outline" className={isIncome ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}>{item.type === 'income' ? 'Revenu' : 'Dépense'}</Badge></TableCell><TableCell className="text-right font-mono">{item.amount.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className="text-right font-mono">{actualAmount.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className={cn("text-right font-mono font-semibold", isGood && 'text-green-600', isBad && 'text-red-600')}>{difference.toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                     <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>TOTAL REVENUS</TableCell><TableCell className="text-right font-mono">{totalBudgetedIncome.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className="text-right font-mono">{totalActualIncome.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className={cn("text-right font-mono", (totalActualIncome - totalBudgetedIncome) >= 0 ? 'text-green-600' : 'text-red-600')}>{(totalActualIncome - totalBudgetedIncome).toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                    <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>TOTAL DÉPENSES</TableCell><TableCell className="text-right font-mono">{totalBudgetedExpense.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className="text-right font-mono">{totalActualExpense.toLocaleString('fr-FR')} FCFA</TableCell><TableCell className={cn("text-right font-mono", (totalActualExpense - totalBudgetedExpense) <= 0 ? 'text-green-600' : 'text-red-600')}>{(totalActualExpense - totalBudgetedExpense).toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                    <TableRow className="border-t-2 border-primary"><TableCell colSpan={2} className="font-extrabold text-lg">SOLDE</TableCell><TableCell className="text-right font-mono font-extrabold text-lg">{(totalBudgetedIncome - totalBudgetedExpense).toLocaleString('fr-FR')} FCFA</TableCell><TableCell className="text-right font-mono font-extrabold text-lg">{(totalActualIncome - totalActualExpense).toLocaleString('fr-FR')} FCFA</TableCell><TableCell className="text-right font-mono font-extrabold text-lg">{((totalActualIncome - totalActualExpense) - (totalBudgetedIncome - totalBudgetedExpense)).toLocaleString('fr-FR')} FCFA</TableCell></TableRow>
                </TableFooter>
            </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Nouvelle Ligne Budgétaire</DialogTitle>
                <DialogDescription>Ajouter une nouvelle prévision de revenu ou de dépense pour l'année {selectedYear}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveBudget}>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select name="type" required><SelectTrigger><SelectValue placeholder="Sélectionnez le type..."/></SelectTrigger><SelectContent><SelectItem value="income">Revenu</SelectItem><SelectItem value="expense">Dépense</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="label">Libellé</Label>
                        <Input name="label" placeholder="Ex: Contrats de maintenance" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Montant (FCFA)</Label>
                        <Input name="amount" type="number" placeholder="Ex: 5000000" required/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Annuler</Button></DialogClose>
                    <Button type="submit">Enregistrer</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
