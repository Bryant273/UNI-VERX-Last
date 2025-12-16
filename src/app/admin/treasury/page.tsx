'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Check,
  X,
  Eye,
  Download,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  allIncomes as initialIncomes,
  allExpenses as initialExpenses,
  incomeStatusConfig,
  expenseStatusConfig,
  type Income,
  type Expense,
} from '@/lib/treasury-data';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; }> = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const IncomesTab = () => {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleValidate = (id: string) => {
    setIncomes(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'completed' } : inc));
    toast({ title: 'Opération validée', description: `L'entrée #${id} a été marquée comme complétée.` });
  };
  
  const handleCancel = (id: string) => {
    setIncomes(prev => prev.filter(inc => inc.id !== id));
    toast({ title: 'Opération annulée', description: `L'entrée #${id} a été supprimée.`, variant: 'destructive' });
  };

  const totalPages = Math.ceil(incomes.length / ITEMS_PER_PAGE);
  const paginatedIncomes = incomes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Détail des Entrées</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimer l'état</Button>
            <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle recette</Button>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
            <Input placeholder="Rechercher..." className="max-w-xs" />
            <Select><SelectTrigger className="w-[180px]"><SelectValue placeholder="Type de recette..."/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[180px]"><SelectValue placeholder="Statut..."/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem></SelectContent></Select>
        </div>
      </CardHeader>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {paginatedIncomes.map(income => {
            const status = incomeStatusConfig[income.status];
            return (
              <TableRow key={income.id}>
                <TableCell>{income.date}</TableCell>
                <TableCell className="font-medium">{income.description}<p className="text-xs text-muted-foreground">{income.origin}</p></TableCell>
                <TableCell className="font-semibold text-green-600">{income.amount.toLocaleString('fr-FR')} FCFA</TableCell>
                <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                <TableCell className="text-right">
                   <TooltipProvider>
                    {income.status === 'pending' ? (
                        <>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleValidate(income.id)}><Check/></Button></TooltipTrigger><TooltipContent><p>Valider</p></TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancel(income.id)}><X/></Button></TooltipTrigger><TooltipContent><p>Annuler</p></TooltipContent></Tooltip>
                        </>
                    ) : (
                         <>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye/></Button></TooltipTrigger><TooltipContent><p>Voir</p></TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Download/></Button></TooltipTrigger><TooltipContent><p>Télécharger</p></TooltipContent></Tooltip>
                        </>
                    )}
                   </TooltipProvider>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
       <CardFooter className="flex items-center justify-between p-4 border-t">
        <p className="text-sm text-muted-foreground">Affichage de {paginatedIncomes.length} sur {incomes.length} entrées</p>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ExpensesTab = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const handleValidate = (id: string) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'paid' } : exp));
    toast({ title: 'Dépense validée', description: `La dépense #${id} a été marquée comme payée.` });
  };
  
  const handleCancel = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast({ title: 'Dépense annulée', description: `La dépense #${id} a été supprimée.`, variant: 'destructive' });
  };

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = expenses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Détail des Sorties</CardTitle>
             <div className="flex gap-2">
                <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> Imprimer l'état</Button>
                <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle dépense</Button>
            </div>
        </div>
      </CardHeader>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {paginatedExpenses.map(expense => {
            const status = expenseStatusConfig[expense.status];
            return (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell className="font-medium">{expense.description}<p className="text-xs text-muted-foreground">Catégorie: {expense.category}</p></TableCell>
                <TableCell className="font-semibold text-red-600">{expense.amount.toLocaleString('fr-FR')} FCFA</TableCell>
                <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                <TableCell className="text-right">
                    <TooltipProvider>
                        {expense.status === 'pending' || expense.status === 'due' ? (
                            <>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleValidate(expense.id)}><Check/></Button></TooltipTrigger><TooltipContent><p>Marquer comme payé</p></TooltipContent></Tooltip>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleCancel(expense.id)}><X/></Button></TooltipTrigger><TooltipContent><p>Annuler</p></TooltipContent></Tooltip>
                            </>
                        ) : (
                            <>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye/></Button></TooltipTrigger><TooltipContent><p>Voir le justificatif</p></TooltipContent></Tooltip>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Download/></Button></TooltipTrigger><TooltipContent><p>Télécharger</p></TooltipContent></Tooltip>
                            </>
                        )}
                    </TooltipProvider>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
       <CardFooter className="flex items-center justify-between p-4 border-t">
        <p className="text-sm text-muted-foreground">Affichage de {paginatedExpenses.length} sur {expenses.length} sorties</p>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function AdminTreasuryPage() {
  const [allIncomes, setAllIncomes] = useState(initialIncomes);
  const [allExpenses, setAllExpenses] = useState(initialExpenses);

  const totalIncomes = useMemo(() => allIncomes.filter(i => i.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0), [allIncomes]);
  const totalExpenses = useMemo(() => allExpenses.filter(e => e.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0), [allExpenses]);
  const balance = totalIncomes - totalExpenses;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Trésorerie</CardTitle>
                    <CardDescription>Suivi des entrées et sorties financières de l'université.</CardDescription>
                </div>
                <Button><Printer className="mr-2 h-4 w-4"/> Générer l'état général</Button>
            </div>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total des Entrées Validées" value={`${totalIncomes.toLocaleString('fr-FR')} FCFA`} icon={ArrowUpCircle} color="text-green-600" />
                <StatCard title="Total des Sorties Payées" value={`${totalExpenses.toLocaleString('fr-FR')} FCFA`} icon={ArrowDownCircle} color="text-red-600" />
                <StatCard title="Solde Actuel" value={`${balance.toLocaleString('fr-FR')} FCFA`} icon={DollarSign} color={balance >= 0 ? "text-primary" : "text-destructive"} />
            </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="incomes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incomes">Entrées</TabsTrigger>
          <TabsTrigger value="expenses">Sorties</TabsTrigger>
        </TabsList>
        <TabsContent value="incomes" className="mt-4">
          <IncomesTab />
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <ExpensesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
