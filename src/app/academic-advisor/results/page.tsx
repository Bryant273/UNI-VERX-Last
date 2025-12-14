'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Check, Download, Eye, X, MoreHorizontal, CheckCheck, FileUp, ListFilter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { allBulletinsData, type Bulletin, type BulletinStatus } from '@/lib/bulletins-data';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ITEMS_PER_PAGE = 20;

const statusConfig: Record<BulletinStatus, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' },
    pending: { label: 'En attente', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    validated: { label: 'Validé', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    published: { label: 'Publié', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    rejected: { label: 'Rejeté', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
};

const StatCard = ({ title, value, percentage, icon: Icon, color }: { title: string; value: number; percentage?: string; icon: React.ElementType, color: string }) => (
    <Card className="hover-lift">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {percentage && <p className="text-xs text-muted-foreground">{percentage}</p>}
            </div>
        </CardContent>
    </Card>
);

export default function BulletinsPage() {
    const [bulletins, setBulletins] = useState<Bulletin[]>(allBulletinsData);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [previewBulletin, setPreviewBulletin] = useState<Bulletin | null>(null);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const { toast } = useToast();

    // Filters
    const [classFilter, setClassFilter] = useState('all');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredBulletins = useMemo(() => {
        return bulletins.filter(b => 
            (classFilter === 'all' || b.class === classFilter) &&
            (semesterFilter === 'all' || b.semester === semesterFilter) &&
            (statusFilter === 'all' || b.status === statusFilter) &&
            (b.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || b.studentNumber.includes(searchTerm))
        );
    }, [bulletins, classFilter, semesterFilter, statusFilter, searchTerm]);
    
    const paginatedBulletins = useMemo(() => {
        return filteredBulletins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredBulletins, currentPage]);

    const stats = useMemo(() => {
        const total = bulletins.length;
        return {
            total,
            validated: bulletins.filter(b => b.status === 'validated').length,
            pending: bulletins.filter(b => b.status === 'pending').length,
            rejected: bulletins.filter(b => b.status === 'rejected').length
        }
    }, [bulletins]);

    const handleSelect = (id: number) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    }
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedBulletins.map(b => b.id)));
        } else {
            setSelectedIds(new Set());
        }
    }

    const handleAction = (ids: Set<number>, newStatus: BulletinStatus) => {
        setBulletins(prev => prev.map(b => ids.has(b.id) ? { ...b, status: newStatus, lastUpdate: new Date() } : b));
        toast({ title: 'Action effectuée', description: `${ids.size} bulletin(s) mis à jour.` });
        setSelectedIds(new Set());
        setIsBulkModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Bulletins" value={stats.total} icon={FileText} color="text-blue-600" />
                <StatCard title="Validés" value={stats.validated} percentage={`${((stats.validated / stats.total) * 100).toFixed(1)}%`} icon={CheckCheck} color="text-green-600" />
                <StatCard title="En attente" value={stats.pending} percentage={`${((stats.pending / stats.total) * 100).toFixed(1)}%`} icon={Clock} color="text-amber-600" />
                <StatCard title="Rejetés" value={stats.rejected} percentage={`${((stats.rejected / stats.total) * 100).toFixed(1)}%`} icon={X} color="text-red-600" />
            </div>

            {selectedIds.size > 0 && (
                <Card className="bg-primary/10 border-primary/20 sticky top-2 z-10">
                    <CardContent className="p-4 flex items-center justify-between">
                         <p className="font-medium text-primary">{selectedIds.size} bulletin(s) sélectionné(s)</p>
                         <div className="flex gap-2">
                             <Button onClick={() => setIsBulkModalOpen(true)}>Actions en lot</Button>
                             <Button variant="ghost" onClick={() => setSelectedIds(new Set())}>Annuler</Button>
                         </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Filtrer les bulletins</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger><SelectValue placeholder="Toutes les classes"/></SelectTrigger><SelectContent>{['all', 'l1-info', 'l2-info', 'l3-info', 'm1-info', 'm2-info'].map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Toutes les classes' : c.replace('-',' ').toUpperCase()}</SelectItem>)}</SelectContent></Select>
                    <Select value={semesterFilter} onValueChange={setSemesterFilter}><SelectTrigger><SelectValue placeholder="Tous les semestres"/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="S1">Semestre 1</SelectItem><SelectItem value="S2">Semestre 2</SelectItem></SelectContent></Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Tous les statuts"/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem>{Object.entries(statusConfig).map(([k,v])=><SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
                    <Input placeholder="Rechercher étudiant..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>

            <Card>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Checkbox checked={selectedIds.size > 0 && paginatedBulletins.every(b => selectedIds.has(b.id))} onCheckedChange={(checked) => {
                                    const newSelection = new Set(selectedIds);
                                    paginatedBulletins.forEach(b => {
                                        if (checked) newSelection.add(b.id);
                                        else newSelection.delete(b.id);
                                    });
                                    setSelectedIds(newSelection);
                                }} /></TableHead>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Moyenne</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Dernière MAJ</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedBulletins.map(b => {
                                const status = statusConfig[b.status];
                                return (
                                    <TableRow key={b.id} className={selectedIds.has(b.id) ? 'bg-primary/5' : ''}>
                                        <TableCell><Checkbox checked={selectedIds.has(b.id)} onCheckedChange={() => handleSelect(b.id)}/></TableCell>
                                        <TableCell>{b.studentName}<br/><span className="text-xs text-muted-foreground">{b.studentNumber}</span></TableCell>
                                        <TableCell>{b.className} - {b.semester}</TableCell>
                                        <TableCell className="font-bold">{b.average.toFixed(2)}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("border-0", status.color)}>{status.label}</Badge></TableCell>
                                        <TableCell>{b.lastUpdate.toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setPreviewBulletin(b)}><Eye /></Button>
                                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                 </div>
                 <CardFooter className="p-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedBulletins.length} sur {filteredBulletins.length} bulletins</p>
                    {/* Pagination here */}
                 </CardFooter>
            </Card>

            <Dialog open={!!previewBulletin} onOpenChange={() => setPreviewBulletin(null)}>
                <DialogContent className="max-w-4xl">
                     <DialogHeader>
                        <DialogTitle>Aperçu du bulletin - {previewBulletin?.studentName}</DialogTitle>
                        <DialogDescription>L3 Informatique • Semestre 2 • 2024-2025</DialogDescription>
                    </DialogHeader>
                    {/* Content will be similar to student's view */}
                    <p className="py-10 text-center">Le contenu détaillé du bulletin sera affiché ici.</p>
                    <DialogFooter>
                         <Button variant="ghost" onClick={() => setPreviewBulletin(null)}>Fermer</Button>
                        <Button onClick={() => handleAction(new Set([previewBulletin!.id]), 'validated')}>Valider</Button>
                        <Button onClick={() => handleAction(new Set([previewBulletin!.id]), 'published')}>Publier</Button>
                        <Button variant="secondary"><Download className="mr-2"/>PDF</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Actions en lot</DialogTitle>
                        <DialogDescription>{selectedIds.size} bulletin(s) sélectionné(s).</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" onClick={() => handleAction(selectedIds, 'validated')}><CheckCheck className="mr-2" />Valider la sélection</Button>
                        <Button variant="outline" onClick={() => handleAction(selectedIds, 'published')}><FileUp className="mr-2" />Publier la sélection</Button>
                        <Button variant="outline" onClick={() => handleAction(selectedIds, 'rejected')} className="text-destructive hover:text-destructive"><X className="mr-2" />Rejeter la sélection</Button>
                        <Button variant="outline"><Download className="mr-2"/>Exporter en PDF</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

