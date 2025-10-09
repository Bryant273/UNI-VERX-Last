
'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  Printer,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { studentData } from '@/lib/static-data';

interface Transaction {
  id: string;
  date: string;
  type: 'Frais de scolarité' | 'Frais d\'inscription' | 'Paiement';
  description: string;
  amount: number;
  status: 'Payé' | 'En attente';
}

const transactions: Transaction[] = [
  { id: 'tr-001', date: '15/09/2024', type: 'Frais d\'inscription', description: 'Année 2024-2025', amount: 500, status: 'Payé' },
  { id: 'tr-002', date: '01/10/2024', type: 'Frais de scolarité', description: '1ère tranche', amount: 2500, status: 'Payé' },
  { id: 'tr-003', date: '01/01/2025', type: 'Frais de scolarité', description: '2ème tranche', amount: 2500, status: 'Payé' },
  { id: 'tr-004', date: '01/04/2025', type: 'Frais de scolarité', description: '3ème tranche', amount: 2500, status: 'En attente' },
];

const ITEMS_PER_PAGE = 5;

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalDue = transactions
    .filter(t => t.status === 'En attente')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statusConfig = {
    'Payé': { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    'En attente': { icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Situation Financière</CardTitle>
            <CardDescription>Consultez le solde de vos frais de scolarité et votre historique de paiements.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer un relevé
            </Button>
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Effectuer un paiement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Solde restant à payer</p>
                        <p className="text-3xl font-bold">{totalDue.toLocaleString('fr-FR')} €</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-muted-foreground"/>
                </CardContent>
            </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Transactions</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Reçu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => {
                  const config = statusConfig[transaction.status];
                  return (
                    <TableRow key={transaction.id} className="even:bg-muted/40">
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.description}</TableCell>
                      <TableCell className="text-right font-semibold">{transaction.amount.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn('border-0', config.color)}>
                            <config.icon className="mr-1.5 h-3 w-3" />
                            {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled={transaction.status !== 'Payé'}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <CardFooter className="p-4 flex items-center justify-between border-t">
            <p className="text-sm text-muted-foreground">
              Affichage de {paginatedTransactions.length} sur {transactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
