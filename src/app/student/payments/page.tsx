
'use client';

import React, { useState, useMemo } from 'react';
import { Download, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle, User, Search } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scholarshipsData, getStatusConfig, type StudentPayment } from '@/lib/scholarships-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import { Progress } from '@/components/ui/progress';

const ITEMS_PER_PAGE = 8;

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<StudentPayment[]>(scholarshipsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueClasses = useMemo(() => {
    const classes = new Set(payments.map(p => p.class));
    return ['all', ...Array.from(classes)];
  }, [payments]);
  
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const statusMatch = statusFilter === 'all' || p.status === statusFilter;
      const classMatch = classFilter === 'all' || p.class === classFilter;
      const searchMatch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.studentId.includes(searchTerm);
      return statusMatch && classMatch && searchMatch;
    });
  }, [payments, statusFilter, classFilter, searchTerm]);
  
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const paginatedPayments = useMemo(() => {
    return filteredPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const summary = useMemo(() => {
    const total = payments.reduce((acc, p) => acc + p.totalAmount, 0);
    const paid = payments.reduce((acc, p) => acc + p.paidAmount, 0);
    const late = payments.filter(p => p.status === 'late').length;
    return { total, paid, remaining: total - paid, lateCount: late };
  }, [payments]);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Facturé</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{summary.total.toLocaleString('fr-FR')} FCFA</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Payé</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">{summary.paid.toLocaleString('fr-FR')} FCFA</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Solde Restant</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-orange-600">{summary.remaining.toLocaleString('fr-FR')} FCFA</p></CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dossiers en Retard</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-red-600">{summary.lateCount}</p></CardContent>
          </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Suivi de la scolarité</CardTitle>
          <CardDescription>Consultez l'historique des paiements de scolarité des étudiants.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher par nom ou matricule..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filière" /></SelectTrigger>
                    <SelectContent>
                        {uniqueClasses.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Toutes les filières' : c}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="partial">Partiel</SelectItem>
                        <SelectItem value="late">En retard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Progression du paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => {
                const status = getStatusConfig(payment.status);
                const progress = (payment.paidAmount / payment.totalAmount) * 100;
                return (
                    <TableRow key={payment.id} className="even:bg-muted/40">
                         <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={payment.avatar} alt={payment.name} />
                                    <AvatarFallback>{getInitials(payment.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{payment.name}</p>
                                    <p className="text-xs text-muted-foreground">{payment.studentId}</p>
                                </div>
                            </div>
                         </TableCell>
                        <TableCell>{payment.class}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <Progress value={progress} className="h-2" />
                                <div className="text-xs text-muted-foreground flex justify-between">
                                    <span>{payment.paidAmount.toLocaleString('fr-FR')} FCFA</span>
                                    <span>{payment.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3" />{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                                <a href="#" download>
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
