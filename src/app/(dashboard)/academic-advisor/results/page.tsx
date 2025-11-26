
'use client';

import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileStack, CheckCircle, Clock, XCircle, Download, FileText, Check, MoreHorizontal, Search, Settings, FileCheck, Award, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { allBulletinsData, type Bulletin, type BulletinStatus } from '@/lib/bulletins-data';
import { cn } from '@/lib/utils';
import { semesterResults } from '@/lib/results-data';

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) => (
    <Card className="stat-card">
        <CardContent className="p-6">
            <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${color.replace('text-', 'bg-').replace('-600', '-100 dark:bg-900/30')}`}>
                    <Icon className={`text-xl ${color}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const statusConfig: Record<BulletinStatus, { label: string, color: string }> = {
    draft: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    validated: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    published: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const itemsPerPage = 20;

export default function BulletinsPage() {
    const [bulletins, setBulletins] = useState(allBulletinsData);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBulletins, setSelectedBulletins] = useState(new Set<number>());
    const [filters, setFilters] = useState({ class: 'all', semester: 'all', status: 'all', search: '' });
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);

    const filteredBulletins = useMemo(() => {
        return bulletins.filter(b => 
            (filters.class === 'all' || b.class === filters.class) &&
            (filters.semester === 'all' || b.semester === filters.semester) &&
            (filters.status === 'all' || b.status === filters.status) &&
            (filters.search === '' || b.studentName.toLowerCase().includes(filters.search) || b.studentNumber.includes(filters.search))
        );
    }, [bulletins, filters]);

    const paginatedBulletins = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBulletins.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBulletins, currentPage]);

    const stats = useMemo(() => {
        return {
            total: bulletins.length,
            validated: bulletins.filter(b => b.status === 'validated').length,
            pending: bulletins.filter(b => b.status === 'pending').length,
            rejected: bulletins.filter(b => b.status === 'rejected').length,
        };
    }, [bulletins]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({...prev, [key]: value}));
        setCurrentPage(1);
    }
    
    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked) {
            setSelectedBulletins(new Set(paginatedBulletins.map(b => b.id)));
        } else {
            setSelectedBulletins(new Set());
        }
    }

    const handleSelectOne = (id: number) => {
        const newSelection = new Set(selectedBulletins);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedBulletins(newSelection);
    }
    
    const openPreview = (bulletin: Bulletin) => {
        setSelectedBulletin(bulletin);
        setIsPreviewModalOpen(true);
    }

    const handleBulkAction = (action: BulletinStatus) => {
        setBulletins(bulletins.map(b => selectedBulletins.has(b.id) ? { ...b, status: action, lastUpdate: new Date() } : b));
        setSelectedBulletins(new Set());
        setIsBulkModalOpen(false);
    }

    const getGradeClass = (grade: number) => {
        if (grade >= 16) return 'text-green-600 dark:text-green-400';
        if (grade >= 14) return 'text-blue-600 dark:text-blue-400';
        if (grade >= 10) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Bulletins" value={stats.total} icon={FileStack} color="text-blue-600" />
                <StatCard title="Validés" value={stats.validated} icon={CheckCircle} color="text-green-600" />
                <StatCard title="En attente" value={stats.pending} icon={Clock} color="text-amber-600" />
                <StatCard title="À revoir" value={stats.rejected} icon={XCircle} color="text-red-600" />
            </div>
            
            {selectedBulletins.size > 0 && (
                 <Card className="sticky top-16 z-10 bg-primary/5 dark:bg-primary-900/20 border-primary/20">
                     <CardContent className="p-4 flex items-center justify-between">
                         <span className="font-medium text-primary">{selectedBulletins.size} bulletin(s) sélectionné(s)</span>
                         <div className="flex space-x-2">
                             <Button onClick={() => setIsBulkModalOpen(true)}>Actions en lot</Button>
                             <Button variant="ghost" onClick={() => setSelectedBulletins(new Set())}>Désélectionner</Button>
                         </div>
                     </CardContent>
                 </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Bulletins des étudiants</CardTitle>
                    <CardDescription>Gérez, validez et publiez les bulletins de notes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select value={filters.class} onValueChange={(v) => handleFilterChange('class', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les classes</SelectItem><SelectItem value="l1-info">L1 Info</SelectItem><SelectItem value="l2-info">L2 Info</SelectItem><SelectItem value="l3-info">L3 Info</SelectItem></SelectContent></Select>
                        <Select value={filters.semester} onValueChange={(v) => handleFilterChange('semester', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les semestres</SelectItem><SelectItem value="S1">Semestre 1</SelectItem><SelectItem value="S2">Semestre 2</SelectItem></SelectContent></Select>
                        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="draft">Brouillon</SelectItem><SelectItem value="pending">En attente</SelectItem><SelectItem value="validated">Validé</SelectItem><SelectItem value="published">Publié</SelectItem><SelectItem value="rejected">Rejeté</SelectItem></SelectContent></Select>
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input placeholder="Nom ou n° étudiant..." className="pl-10" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} /></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 px-6"><Checkbox onCheckedChange={handleSelectAll} /></TableHead>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Moyenne</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Dernière MàJ</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedBulletins.map(b => (
                                <TableRow key={b.id} data-state={selectedBulletins.has(b.id) ? 'selected' : ''}>
                                    <TableCell className="px-6"><Checkbox checked={selectedBulletins.has(b.id)} onCheckedChange={() => handleSelectOne(b.id)} /></TableCell>
                                    <TableCell>
                                        <div className="font-medium">{b.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{b.studentNumber}</div>
                                    </TableCell>
                                    <TableCell>{b.className} ({b.semester})</TableCell>
                                    <TableCell className={cn("font-semibold", getGradeClass(b.average))}>{b.average.toFixed(2)}/20</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("border-0", statusConfig[b.status])}>{statusConfig[b.status].label}</Badge></TableCell>
                                    <TableCell>{b.lastUpdate.toLocaleDateString('fr-FR')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openPreview(b)}><Eye/></Button>
                                        <Button variant="ghost" size="icon"><Download/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            
            {/* Modal for Bulletin Preview */}
            <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Aperçu du bulletin - {selectedBulletin?.studentName}</DialogTitle>
                        <DialogDescription>{selectedBulletin?.className} • {selectedBulletin?.semester}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto">
                         <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Informations étudiant</h4>
                                <p><strong>Nom:</strong> {selectedBulletin?.studentName}</p>
                                <p><strong>N°:</strong> {selectedBulletin?.studentNumber}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Résultats</h4>
                                <p><strong>Moyenne:</strong> <span className={cn(getGradeClass(selectedBulletin?.average || 0))}>{selectedBulletin?.average.toFixed(2)}/20</span></p>
                                <p><strong>Crédits:</strong> {selectedBulletin?.creditsValidated}/{selectedBulletin?.creditsTotal}</p>
                            </div>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead>Matière</TableHead><TableHead>Note</TableHead><TableHead>Crédits</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {/* Mock data for preview */}
                                {semesterResults.s1.courses.slice(0,4).map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.module}</TableCell>
                                        <TableCell className={cn(getGradeClass(parseFloat(c.grade)))}>{c.grade}</TableCell>
                                        <TableCell>{c.creditsValidated}/{c.creditsToValidate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPreviewModalOpen(false)}>Fermer</Button>
                        <Button variant="destructive" onClick={() => { setBulletins(bulletins.map(b => b.id === selectedBulletin?.id ? {...b, status: 'rejected'} : b)); setIsPreviewModalOpen(false); }}>Rejeter</Button>
                        <Button onClick={() => { setBulletins(bulletins.map(b => b.id === selectedBulletin?.id ? {...b, status: 'validated'} : b)); setIsPreviewModalOpen(false); }}>Valider</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Modal for Bulk Actions */}
             <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actions en lot</DialogTitle>
                        <DialogDescription>{selectedBulletins.size} bulletin(s) sélectionné(s)</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" onClick={() => handleBulkAction('validated')}><CheckCircle className="mr-2"/>Valider</Button>
                        <Button variant="outline" onClick={() => handleBulkAction('published')}><FileCheck className="mr-2"/>Publier</Button>
                        <Button variant="outline" onClick={() => handleBulkAction('rejected')}><XCircle className="mr-2"/>Rejeter</Button>
                        <Button variant="outline"><Download className="mr-2"/>Exporter en PDF</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
