
'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  BarChart2,
  Database,
  Clock,
  UserCheck,
  ChartBar,
  TrendingUp,
  CalendarCheck,
  Cog,
  Scale,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { reportsData, statusConfig } from '@/lib/reports-data';

const StatCard = ({ title, value, subtitle, icon: Icon, color }: { title: string; value: string; subtitle: string; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="text-white" />
                </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-500">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>{subtitle}</span>
            </div>
        </CardContent>
    </Card>
);

const ReportTypeCard = ({ type, title, description, lastGenerated, average, icon: Icon, color, onGenerate, onExport }: any) => (
    <Card className="flex flex-col hover-lift">
        <CardHeader>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg}`}>
                    <Icon className={`text-xl ${color.text}`} />
                </div>
                <Badge variant="outline">{lastGenerated}</Badge>
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
            {average && (
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Moyenne:</span>
                    <span className="font-medium text-gray-800 dark:text-white">{average}</span>
                </div>
            )}
        </CardContent>
        <div className="p-6 pt-0 flex gap-2">
            <Button className="flex-1" variant="outline" onClick={() => onGenerate(type)}>
                <Eye className="mr-2 h-4 w-4" /> Voir
            </Button>
            <Button className="py-2 px-3" variant="ghost" onClick={() => onExport(type)}>
                <Download className="h-4 w-4" />
            </Button>
        </div>
    </Card>
);

export default function ReportsPage() {
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState({ title: '', subtitle: '', content: '' });

    const handleGenerateReport = (type: string) => {
        setPreviewContent({
            title: `Rapport de ${type}`,
            subtitle: `Généré le ${new Date().toLocaleDateString()}`,
            content: `<p>Contenu simulé pour le rapport de type: <strong>${type}</strong>.</p><p>Les graphiques et les données détaillées apparaîtraient ici.</p>`
        });
        setPreviewModalOpen(true);
    };

    const handleExportReport = (type: string) => {
        console.log(`Exporting ${type}`);
    };
    
    const reportTypes = [
        { type: 'attendance', title: "Rapport de présences", description: "Analyse détaillée des présences par cours et par étudiant", lastGenerated: "Il y a 2 heures", average: "91.2%", icon: UserCheck, color: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-500' } },
        { type: 'grades', title: "Rapport de notes", description: "Statistiques complètes des résultats et évaluations", lastGenerated: "Aujourd'hui", average: "14.7/20", icon: ChartBar, color: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500' } },
        { type: 'progress', title: "Rapport de progression", description: "Évolution des performances par cours et période", lastGenerated: "Hier", average: "↗ Positive", icon: TrendingUp, color: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-500' } },
        { type: 'activities', title: "Rapport d'activités", description: "Récapitulatif des cours, TD et évaluations", lastGenerated: "Il y a 1 jour", average: "47/semaine", icon: CalendarCheck, color: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500' } },
        { type: 'custom', title: "Rapport personnalisé", description: "Créez un rapport avec vos critères spécifiques", lastGenerated: "N/A", average: "8 modèles", icon: Cog, color: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-500' } },
        { type: 'comparative', title: "Rapport comparatif", description: "Comparaison entre classes, semestres ou années", lastGenerated: "Il y a 3 jours", average: "4 classes", icon: Scale, color: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-500' } },
    ];


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl">Rapports Stratégiques</CardTitle>
                            <CardDescription>Générez et consultez les rapports stratégiques de l'université.</CardDescription>
                        </div>
                         <div className="flex flex-wrap gap-3">
                             <Select defaultValue="month">
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="week">Cette semaine</SelectItem>
                                    <SelectItem value="month">Ce mois</SelectItem>
                                    <SelectItem value="semester">Ce semestre</SelectItem>
                                    <SelectItem value="year">Cette année</SelectItem>
                                </SelectContent>
                             </Select>
                            <Button>
                                <Plus className="mr-2 h-4 w-4"/>
                                Nouveau rapport
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Rapports générés" value="47" subtitle="+12% vs mois dernier" icon={FileText} color="bg-blue-500" />
                <StatCard title="Exports PDF" value="128" subtitle="+23 cette semaine" icon={Download} color="bg-green-500" />
                <StatCard title="Temps moyen" value="2.3s" subtitle="-0.7s génération" icon={Clock} color="bg-amber-500" />
                <StatCard title="Taille moyenne" value="2.1Mo" subtitle="Stable" icon={Database} color="bg-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report) => (
                    <ReportTypeCard 
                        key={report.type}
                        {...report}
                        onGenerate={handleGenerateReport}
                        onExport={handleExportReport}
                    />
                ))}
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Historique des rapports</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Généré le</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportsData.map((report) => {
                                const status = statusConfig[report.status];
                                return (
                                    <TableRow key={report.id} className="even:bg-muted/40">
                                        <TableCell>
                                            <div className="font-medium">{report.title}</div>
                                            <div className="text-xs text-muted-foreground">{report.description}</div>
                                        </TableCell>
                                        <TableCell>{report.period}</TableCell>
                                        <TableCell>{report.generatedAt}</TableCell>
                                        <TableCell>{report.size}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={status.color}>
                                                <status.icon className="mr-1.5 h-3 w-3" />
                                                {status.text}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" disabled={report.status !== 'available'}><Eye className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" disabled={report.status !== 'available'}><Download className="h-4 w-4"/></Button>
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
                        Affichage de {reportsData.length} sur {reportsData.length} rapports
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page 1 sur 1
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{previewContent.title}</DialogTitle>
                        <DialogDescription>{previewContent.subtitle}</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-1 pr-4" dangerouslySetInnerHTML={{ __html: previewContent.content }}>
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
