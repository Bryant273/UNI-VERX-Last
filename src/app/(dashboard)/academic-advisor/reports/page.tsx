
'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  BarChart2,
  Database,
  Clock,
  CheckCircle,
  FileCog,
  Search,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { reportsData, statusConfig, type Report } from '@/lib/reports-data';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ITEMS_PER_PAGE = 10;

export default function GlobalReportsPage() {
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationSuccess, setGenerationSuccess] = useState(false);

    const totalPages = Math.ceil(reportsData.length / ITEMS_PER_PAGE);
    const paginatedReports = reportsData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setGenerationSuccess(false);
        setTimeout(() => {
            setIsGenerating(false);
            setGenerationSuccess(true);
        }, 2000);
    };

    const handleViewReport = (report: Report) => {
      setSelectedReport(report);
      setPreviewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl">Centre de Rapports</CardTitle>
                            <CardDescription>Générez, consultez et gérez tous les rapports de la plateforme.</CardDescription>
                        </div>
                         <div className="flex flex-wrap gap-3">
                             <Select defaultValue="semester">
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semester">Rapport Semestriel</SelectItem>
                                    <SelectItem value="annual">Rapport Annuel</SelectItem>
                                    <SelectItem value="custom">Rapport Personnalisé</SelectItem>
                                </SelectContent>
                             </Select>
                            <Button onClick={handleGenerateReport} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                                Générer avec l'IA
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                {generationSuccess && (
                     <CardFooter>
                        <Alert className="border-green-500/50 text-green-700 dark:text-green-300 [&>svg]:text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Rapport généré !</AlertTitle>
                          <AlertDescription>
                            Le nouveau rapport est maintenant disponible dans l'historique ci-dessous.
                          </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Historique des rapports générés</CardTitle>
                    <div className="pt-2">
                        <Input placeholder="Rechercher un rapport..." className="max-w-xs" />
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rapport</TableHead>
                                <TableHead>Demandeur</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Généré le</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedReports.map((report) => {
                                const status = statusConfig[report.status];
                                return (
                                    <TableRow key={report.id} className="even:bg-muted/40">
                                        <TableCell>
                                            <div className="font-medium">{report.title}</div>
                                            <div className="text-xs text-muted-foreground">{report.description}</div>
                                        </TableCell>
                                        <TableCell>{"Dr. Claire Dubois"}</TableCell>
                                        <TableCell>{report.period}</TableCell>
                                        <TableCell>{report.generatedAt}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={status.color}>
                                                <status.icon className="mr-1.5 h-3 w-3" />
                                                {status.text}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewReport(report)} disabled={report.status !== 'available'}><Eye className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" onClick={() => {}} disabled={report.status !== 'available'}><Download className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">
                        Affichage de {paginatedReports.length} sur {reportsData.length} rapports
                    </p>
                     {totalPages > 1 && (
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
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
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
                    )}
                </CardFooter>
            </Card>

            <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{selectedReport?.title || 'Rapport'}</DialogTitle>
                        <DialogDescription>{selectedReport?.description} - {selectedReport?.period}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4 border rounded-md my-4">
                      <h3 className="text-lg font-semibold mb-4">Aperçu du contenu</h3>
                      <p className="text-muted-foreground">
                        Le contenu détaillé du rapport serait affiché ici. Pour cette démo, voici une représentation textuelle.
                      </p>
                      <pre className="mt-4 p-4 bg-muted rounded-md text-xs whitespace-pre-wrap">
                        {JSON.stringify(selectedReport, null, 2)}
                      </pre>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>Fermer</Button>
                        <Button>
                            <Download className="mr-2 h-4 w-4"/>
                            Exporter en PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
