
'use client';

import React, { useState, useMemo } from 'react';
import { Download, ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { professorPayments, type ProfessorPayment, type PaymentStatus } from '@/lib/payments-data';

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; color: string; }> = {
  paid: { label: 'Payé', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
};

export default function ProfessorPaymentsPage() {
  const [payments, setPayments] = useState<ProfessorPayment[]>(professorPayments);
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  const uniqueYears = useMemo(() => {
    const years = new Set(payments.map(p => new Date(p.date).getFullYear().toString()));
    return ['all', ...Array.from(years)];
  }, [payments]);
  
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const paymentDate = new Date(p.date);
      const yearMatch = yearFilter === 'all' || paymentDate.getFullYear().toString() === yearFilter;
      const monthMatch = monthFilter === 'all' || (paymentDate.getMonth() + 1).toString() === monthFilter;
      return yearMatch && monthMatch;
    });
  }, [payments, yearFilter, monthFilter]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const paginatedPayments = useMemo(() => {
    return filteredPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes Paiements</CardTitle>
          <CardDescription>Consultez l'historique de vos paiements et téléchargez vos bulletins de paie.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
             <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les années</SelectItem>
                    {uniqueYears.filter(y => y !== 'all').map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
             <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les mois</SelectItem>
                    {Array.from({length: 12}, (_, i) => (
                        <SelectItem key={i+1} value={(i+1).toString()}>{new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
          </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant Net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => {
                const status = statusConfig[payment.status];
                return (
                    <TableRow key={payment.id} className="even:bg-muted/40">
                        <TableCell className="font-medium">{new Date(payment.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3" />{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                                <a href={payment.invoiceUrl} download>
                                    <Download className="h-4 w-4" />
                                </a>
                            </Button>
                        </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">Affichage de {paginatedPayments.length} sur {filteredPayments.length} paiements</p>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                    <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
