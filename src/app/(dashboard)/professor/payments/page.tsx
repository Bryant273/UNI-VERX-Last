
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
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { userData } from '@/lib/static-data';

interface Payslip {
  id: string;
  period: string;
  payDate: string;
  netAmount: number;
  grossAmount: number;
  deductions: number;
  status: 'Payé' | 'En cours';
  reference: string;
}

const payslips: Payslip[] = [
    { id: 'ps-001', period: 'Avril 2025', payDate: '30/04/2025', netAmount: 1250000, grossAmount: 1550000, deductions: 300000, status: 'Payé', reference: 'FP-2025-04-123' },
    { id: 'ps-002', period: 'Mars 2025', payDate: '31/03/2025', netAmount: 1250000, grossAmount: 1550000, deductions: 300000, status: 'Payé', reference: 'FP-2025-03-123' },
    { id: 'ps-003', period: 'Février 2025', payDate: '28/02/2025', netAmount: 1250000, grossAmount: 1550000, deductions: 300000, status: 'Payé', reference: 'FP-2025-02-123' },
    { id: 'ps-004', period: 'Janvier 2025', payDate: '31/01/2025', netAmount: 1250000, grossAmount: 1550000, deductions: 300000, status: 'Payé', reference: 'FP-2025-01-123' },
    { id: 'ps-005', period: 'Décembre 2024', payDate: '31/12/2024', netAmount: 1200000, grossAmount: 1500000, deductions: 300000, status: 'Payé', reference: 'FP-2024-12-123' },
];

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
    </Card>
);

const statusConfig = {
    'Payé': { icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    'En cours': { icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
};

export default function ProfessorPaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterYear, setFilterYear] = useState('2025');

  const filteredPayslips = payslips.filter(p => p.payDate.endsWith(filterYear));
  const latestPayslip = payslips[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Ma Rémunération</CardTitle>
            <CardDescription>Consultez l'historique de vos fiches de paie et vos récapitulatifs annuels.</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Télécharger le récapitulatif annuel
          </Button>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Dernier Salaire Net" value={`${latestPayslip.netAmount.toLocaleString('fr-FR')} FCFA`} subtitle={`Période: ${latestPayslip.period}`} />
                <StatCard title="Total Net Annuel (2024)" value={`14 800 000 FCFA`} subtitle="+3.5% vs 2023" />
                <StatCard title="Prochain Paiement" value={`${latestPayslip.netAmount.toLocaleString('fr-FR')} FCFA`} subtitle="Le 31/05/2025" />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Fiches de Paie</CardTitle>
           <div className="pt-2">
             <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2025">Année 2025</SelectItem>
                    <SelectItem value="2024">Année 2024</SelectItem>
                </SelectContent>
             </Select>
           </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead>Montant Brut</TableHead>
                <TableHead>Cotisations</TableHead>
                <TableHead className="text-right">Montant Net</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayslips.map((payslip) => {
                  const config = statusConfig[payslip.status];
                  return (
                    <TableRow key={payslip.id} className="even:bg-muted/40">
                      <TableCell className="font-medium">{payslip.period}</TableCell>
                      <TableCell>{payslip.payDate}</TableCell>
                      <TableCell>{payslip.grossAmount.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell className="text-red-600">-{payslip.deductions.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">{payslip.netAmount.toLocaleString('fr-FR')} FCFA</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
