
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
  Eye,
  Banknote,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { studentData } from '@/lib/static-data';

interface Transaction {
  id: string;
  date: string;
  type: 'Frais de scolarité' | 'Frais d\'inscription' | 'Autres frais';
  description: string;
  amount: number;
  status: 'Payé' | 'En attente';
  reference: string;
  paymentMethod: string;
}

const transactions: Transaction[] = [
  { id: 'tr-001', date: '15/09/2024', type: 'Frais d\'inscription', description: 'Année 2024-2025', amount: 250000, status: 'Payé', reference: 'INV-24-00123', paymentMethod: 'Virement bancaire' },
  { id: 'tr-002', date: '01/10/2024', type: 'Frais de scolarité', description: '1ère tranche', amount: 750000, status: 'Payé', reference: 'INV-24-00345', paymentMethod: 'Paiement mobile' },
  { id: 'tr-003', date: '01/01/2025', type: 'Frais de scolarité', description: '2ème tranche', amount: 750000, status: 'En attente', reference: 'INV-25-00012', paymentMethod: '-' },
  { id: 'tr-004', date: '01/04/2025', type: 'Frais de scolarité', description: '3ème tranche', amount: 750000, status: 'En attente', reference: 'INV-25-00256', paymentMethod: '-' },
  { id: 'tr-005', date: '20/01/2025', type: 'Autres frais', description: 'Frais de bibliothèque', amount: 15000, status: 'Payé', reference: 'INV-25-00150', paymentMethod: 'Carte de crédit' },
];

const ITEMS_PER_PAGE = 5;

const TransactionDetailsModal = ({ transaction, onClose }: { transaction: Transaction | null, onClose: () => void }) => {
    if (!transaction) return null;
    
    const config = statusConfig[transaction.status];

    return (
        <Dialog open={!!transaction} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Détails de la transaction</DialogTitle>
                    <DialogDescription>Référence : {transaction.reference}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Montant</p>
                        <p className="text-2xl font-bold">{transaction.amount.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Statut</p>
                        <Badge variant="outline" className={cn('border-0', config.color)}>
                            <config.icon className="mr-1.5 h-3 w-3" />
                            {transaction.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{transaction.date}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium">{transaction.type}</p>
                    </div>
                     <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Description</p>
                        <p className="font-medium">{transaction.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground">Moyen de paiement</p>
                        <p className="font-medium">{transaction.paymentMethod}</p>
                    </div>
                     <Separator />
                     <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Documents</p>
                        <Button variant="outline" className="w-full justify-start" disabled={transaction.status !== 'Payé'}>
                           <Receipt className="mr-2 h-4 w-4" />
                           Télécharger le reçu
                        </Button>
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const statusConfig = {
    'Payé': { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    'En attente': { icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
};

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => filterType === 'all' || t.type === filterType);
  
  const totalDue = transactions
    .filter(t => t.status === 'En attente')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Situation Financière</CardTitle>
            <CardDescription>Consultez le solde de votre scolarité et votre historique de paiements.</CardDescription>
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
                        <p className="text-3xl font-bold">{totalDue.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <Banknote className="h-10 w-10 text-muted-foreground"/>
                </CardContent>
            </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Transactions</CardTitle>
           <div className="pt-2">
             <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Filtrer par type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les transactions</SelectItem>
                    <SelectItem value="Frais de scolarité">Frais de scolarité</SelectItem>
                    <SelectItem value="Frais d'inscription">Frais d'inscription</SelectItem>
                    <SelectItem value="Autres frais">Autres frais</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => {
                  const config = statusConfig[transaction.status];
                  return (
                    <TableRow key={transaction.id} className="even:bg-muted/40">
                      <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className="text-right font-semibold">{transaction.amount.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn('border-0', config.color)}>
                            <config.icon className="mr-1.5 h-3 w-3" />
                            {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(transaction)}>
                          <Eye className="h-4 w-4" />
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
              Affichage de {paginatedTransactions.length} sur {filteredTransactions.length} transactions
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
      
      <TransactionDetailsModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />

    </div>
  );
}
