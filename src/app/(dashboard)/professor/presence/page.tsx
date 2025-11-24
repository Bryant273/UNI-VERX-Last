
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  Calendar,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { allPresenceData, type Presence } from '@/lib/presence-data';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) => (
    <Card className="hover-lift">
        <CardContent className="p-6">
            <div className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${color.replace('text-', 'bg-').replace('-500', '-100 dark:bg-900/30')}`}>
                    <Icon className={`text-xl ${color}`} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const statusConfig = {
  present: { text: 'Présent', icon: CheckCircle, color: 'status-present' },
  absent: { text: 'Absent', icon: XCircle, color: 'status-absent' },
  late: { text: 'Retard', icon: Clock, color: 'status-late' },
  justified: { text: 'Justifié', icon: FileCheck, color: 'status-justified' },
};


export default function ProfessorPresencePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [periodFilter, setPeriodFilter] = useState('current');
    const [courseFilter, setCourseFilter] = useState('all');
    const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);
    const [selectedAbsence, setSelectedAbsence] = useState<Presence | null>(null);

    const filteredData = useMemo(() => {
        return allPresenceData.filter(item => {
            let passesFilter = true;
            if (courseFilter !== 'all') {
                passesFilter = passesFilter && item.course === courseFilter;
            }
            // Logic for periodFilter can be added here
            return passesFilter;
        });
    }, [courseFilter, periodFilter]);

    const stats = useMemo(() => {
        return filteredData.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        }, { present: 0, absent: 0, late: 0, justified: 0 });
    }, [filteredData]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);
    
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const handleOpenJustification = (item: Presence) => {
        setSelectedAbsence(item);
        setIsJustificationModalOpen(true);
    };


    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Présent" value={stats.present} icon={CheckCircle} color="text-green-500" />
                <StatCard title="Absent" value={stats.absent} icon={XCircle} color="text-red-500" />
                <StatCard title="Retard" value={stats.late} icon={Clock} color="text-amber-500" />
                <StatCard title="Justifié" value={stats.justified} icon={FileCheck} color="text-blue-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Historique des présences</CardTitle>
                            <CardDescription>Consultez et gérez l'assiduité de vos cours.</CardDescription>
                        </div>
                        <Button><Download className="mr-2 h-4 w-4" /> Exporter la liste</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="periodFilter" className="text-sm shrink-0">Période :</Label>
                            <Select value={periodFilter} onValueChange={setPeriodFilter}>
                                <SelectTrigger id="periodFilter" className="w-full md:w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current">Semestre actuel</SelectItem>
                                    <SelectItem value="month">Ce mois</SelectItem>
                                    <SelectItem value="week">Cette semaine</SelectItem>
                                    <SelectItem value="all">Tout</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                             <Label htmlFor="courseFilter" className="text-sm shrink-0">Cours :</Label>
                             <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger id="courseFilter" className="w-full md:w-[240px]">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les cours</SelectItem>
                                    <SelectItem value="Bases de Données L3">Bases de Données L3</SelectItem>
                                    <SelectItem value="Programmation Python L2">Programmation Python L2</SelectItem>
                                    <SelectItem value="Algorithmique L1">Algorithmique L1</SelectItem>
                                    <SelectItem value="Projet Informatique M1">Projet Informatique M1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Cours</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map(item => {
                                const statusInfo = statusConfig[item.status];
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{item.time}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.course}</div>
                                            <div className="text-xs text-muted-foreground">Salle: {item.salle}</div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{item.type}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn('border-0 font-medium', statusInfo.color)}>
                                                <statusInfo.icon className="mr-1.5 h-3.5 w-3.5" />
                                                {statusInfo.text}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.status === 'absent' && !item.justification && (
                                                <Button variant="link" size="sm" className="h-auto p-0" onClick={() => handleOpenJustification(item)}>
                                                    Justifier
                                                </Button>
                                            )}
                                            {item.justification && (
                                                <span className="text-xs text-muted-foreground italic">{item.justification}</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">
                        Affichage de {paginatedData.length} sur {filteredData.length} résultats
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={isJustificationModalOpen} onOpenChange={setIsJustificationModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><FileCheck />Justifier une absence</DialogTitle>
                        <DialogDescription>
                            Cours : {selectedAbsence?.course} <br/>
                            Date : {selectedAbsence?.date ? new Date(selectedAbsence.date).toLocaleDateString('fr-FR') : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="justificationReason">Motif d'absence</Label>
                            <Select>
                                <SelectTrigger id="justificationReason"><SelectValue placeholder="Sélectionnez un motif" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="medical">Arrêt maladie</SelectItem>
                                    <SelectItem value="family">Urgence familiale</SelectItem>
                                    <SelectItem value="mission">Mission officielle</SelectItem>
                                    <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="justificationComment">Commentaire (optionnel)</Label>
                            <Textarea id="justificationComment" placeholder="Précisions sur l'absence..." />
                        </div>
                        <div>
                            <Label htmlFor="justificationFile">Pièce justificative</Label>
                            <Input id="justificationFile" type="file" />
                            <p className="text-xs text-muted-foreground mt-1">Formats : PDF, JPG, PNG (max 5MB)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsJustificationModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => {setIsJustificationModalOpen(false); /* Logic to handle submission */}}>
                            <Upload className="mr-2 h-4 w-4"/>
                            Envoyer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
