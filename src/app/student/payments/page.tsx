
'use client';

import React from 'react';
import { Download, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { studentPaymentHistory, getStatusConfig, type PaymentHistoryItem, type PaymentStatus } from '@/lib/student-payment-data';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const StudentPaymentsPage = () => {
  const { summary, installments } = studentPaymentHistory;
  const paymentProgress = (summary.paid / summary.total) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Annuel à Payer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.total.toLocaleString('fr-FR')} FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Déjà Payé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{summary.paid.toLocaleString('fr-FR')} FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solde Restant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{summary.remaining.toLocaleString('fr-FR')} FCFA</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ma Scolarité 2024-2025</CardTitle>
          <CardDescription>Suivez l'état de vos paiements pour l'année universitaire en cours.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progression du paiement</span>
                    <span>{Math.round(paymentProgress)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-2" />
            </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((item) => {
                const status = getStatusConfig(item.status);
                return (
                  <TableRow key={item.id} className="even:bg-muted/40">
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.amount.toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        <status.icon className="mr-1.5 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === 'paid' && (
                        <TooltipProvider>
                           <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Voir le reçu</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={item.receiptUrl} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Télécharger le reçu</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default StudentPaymentsPage;
