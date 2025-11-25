
'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  Check,
  RefreshCw,
  CheckCheck,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  allValidations,
  validationData,
  type Validation,
  type ValidationType,
  type ValidationPriority,
} from '@/lib/validations-data';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <Card className="hover-lift">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.replace('text-', 'bg-').replace('-500', '-50 dark:bg-900/20'))}>
                    <Icon className={cn("text-xl", color)} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const ITEMS_PER_PAGE = 10;

export default function ValidationsPage() {
    const [validations, setValidations] = useState<Validation[]>(allValidations);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedValidation, setSelectedValidation] = useState<Validation | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const pendingValidations = useMemo(() => validations.filter(v => v.status === 'pending'), [validations]);

    const filteredValidations = useMemo(() => {
        return pendingValidations.filter(v => 
            (priorityFilter === 'all' || v.priority === priorityFilter) &&
            (typeFilter === 'all' || v.type === typeFilter)
        );
    }, [pendingValidations, priorityFilter, typeFilter]);

    const paginatedValidations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredValidations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredValidations, currentPage]);

    const totalPages = Math.ceil(filteredValidations.length / ITEMS_PER_PAGE);

    const stats = useMemo(() => ({
        pending: pendingValidations.length,
        urgent: pendingValidations.filter(v => v.priority === 'urgent').length,
        approvedToday: validations.filter(v => v.status === 'approved' && new Date(v.actionDate || 0).toDateString() === new Date().toDateString()).length,
    }), [validations, pendingValidations]);

    const handleValidationAction = (ids: number[], action: 'approve' | 'reject') => {
        setValidations(prev => prev.map(v => 
            ids.includes(v.id) ? { ...v, status: action === 'approve' ? 'approved' : 'rejected', actionDate: new Date().toISOString() } : v
        ));
        setSelectedRows(new Set());
        setSelectedValidation(null);
    };

    const handleSelectRow = (id: number) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedRows(newSelection);
    };

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked) {
            setSelectedRows(new Set(paginatedValidations.map(v => v.id)));
        } else {
            setSelectedRows(new Set());
        }
    };
    
    const getPriorityBadge = (priority: ValidationPriority) => {
        const config = {
            urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            normal: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
            low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        };
        return <Badge variant="outline" className={cn("border-0", config[priority])}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>;
    };

    const getTypeBadge = (type: ValidationType) => {
        const config = {
            notes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            planning: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
            course: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
            absence: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
        };
        return <Badge variant="outline" className={cn("border-0", config[type])}>{type}</Badge>;
    };

    const modalData = useMemo(() => {
        return selectedValidation ? validationData[selectedValidation.id as keyof typeof validationData] : null;
    }, [selectedValidation]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total en attente" value={stats.pending} icon={Clock} color="text-amber-500" />
                <StatCard title="Urgent" value={stats.urgent} icon={AlertTriangle} color="text-red-500" />
                <StatCard title="Validées aujourd'hui" value={stats.approvedToday} icon={Check} color="text-green-500" />
                <StatCard title="Temps moyen" value="2.3h" icon={Clock} color="text-blue-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                         <div className="flex items-center space-x-3">
                            <Checkbox 
                                id="selectAll" 
                                checked={selectedRows.size > 0 && selectedRows.size === paginatedValidations.length} 
                                onCheckedChange={handleSelectAll}
                            />
                             <label htmlFor="selectAll" className="text-sm text-gray-700 dark:text-gray-300">Tout sélectionner</label>
                             <div className="h-4 w-px bg-gray-300 dark:bg-slate-600"></div>
                             <Button size="sm" variant="outline" onClick={() => handleValidationAction(Array.from(selectedRows), 'approve')} disabled={selectedRows.size === 0}>
                                <CheckCheck className="mr-2 h-4 w-4"/> Approuver
                            </Button>
                             <Button size="sm" variant="destructive" onClick={() => handleValidationAction(Array.from(selectedRows), 'reject')} disabled={selectedRows.size === 0}>
                                <X className="mr-2 h-4 w-4"/> Rejeter
                            </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                             <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Priorité"/></SelectTrigger>
                                <SelectContent><SelectItem value="all">Toutes les priorités</SelectItem><SelectItem value="urgent">Urgent</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="low">Faible</SelectItem></SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type"/></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous les types</SelectItem><SelectItem value="notes">Notes</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="course">Cours</SelectItem><SelectItem value="absence">Absence</SelectItem></SelectContent>
                            </Select>
                             <Button variant="ghost" size="icon"><RefreshCw /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"><Checkbox onCheckedChange={handleSelectAll} checked={selectedRows.size > 0 && selectedRows.size === paginatedValidations.length} /></TableHead>
                                    <TableHead>Demande</TableHead>
                                    <TableHead>Type/Priorité</TableHead>
                                    <TableHead>Demandeur</TableHead>
                                    <TableHead>Échéance</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedValidations.map(v => (
                                    <TableRow key={v.id} data-state={selectedRows.has(v.id) ? "selected" : ""}>
                                        <TableCell><Checkbox checked={selectedRows.has(v.id)} onCheckedChange={() => handleSelectRow(v.id)} /></TableCell>
                                        <TableCell>
                                            <div className="font-medium">{v.title}</div>
                                            <div className="text-sm text-muted-foreground">{v.details}</div>
                                        </TableCell>
                                        <TableCell><div className="flex flex-col gap-1">{getTypeBadge(v.type)}{getPriorityBadge(v.priority)}</div></TableCell>
                                        <TableCell>
                                            <div className="font-medium">{v.teacher}</div>
                                            <div className="text-sm text-muted-foreground">{v.time}</div>
                                        </TableCell>
                                        <TableCell>{v.deadline}</TableCell>
                                        <TableCell><Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-0">{v.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedValidation(v)}><Eye /></Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleValidationAction([v.id], 'reject')}><X /></Button>
                                            <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={() => handleValidationAction([v.id], 'approve')}><Check /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 <CardFooter className="flex items-center justify-between p-4 border-t">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedValidations.length} sur {filteredValidations.length} validations</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={!!selectedValidation} onOpenChange={() => setSelectedValidation(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{modalData?.title}</DialogTitle>
                        <DialogDescription>Détails de la demande de validation</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {modalData && (
                            <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Informations générales</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-muted-foreground">Demandeur:</span> <span className="font-medium">{modalData.teacher}</span></div>
                                            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{modalData.type}</span></div>
                                            {modalData.level && <div><span className="text-muted-foreground">Niveau:</span> <span className="font-medium">{modalData.level}</span></div>}
                                            {modalData.students && <div><span className="text-muted-foreground">Étudiants:</span> <span className="font-medium">{modalData.students}</span></div>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Détails spécifiques</h4>
                                        <div className="space-y-2 text-sm">
                                            {modalData.average && <div><span className="text-muted-foreground">Moyenne:</span> <span className="font-medium">{modalData.average}</span></div>}
                                            {modalData.successRate && <div><span className="text-muted-foreground">Taux réussite:</span> <span className="font-medium">{modalData.successRate}</span></div>}
                                            {modalData.oldSlot && <div><span className="text-muted-foreground">Ancien créneau:</span> <span className="font-medium">{modalData.oldSlot}</span></div>}
                                            {modalData.newSlot && <div><span className="text-muted-foreground">Nouveau créneau:</span> <span className="font-medium">{modalData.newSlot}</span></div>}
                                            {modalData.room && <div><span className="text-muted-foreground">Salle:</span> <span className="font-medium">{modalData.room}</span></div>}
                                            {modalData.hours && <div><span className="text-muted-foreground">Volume horaire:</span> <span className="font-medium">{modalData.hours}</span></div>}
                                            {modalData.ects && <div><span className="text-muted-foreground">ECTS:</span> <span className="font-medium">{modalData.ects}</span></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{modalData.details}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedValidation(null)}>Fermer</Button>
                        <Button variant="destructive" onClick={() => handleValidationAction([selectedValidation!.id], 'reject')}><X className="mr-2 h-4 w-4"/> Rejeter</Button>
                        <Button onClick={() => handleValidationAction([selectedValidation!.id], 'approve')}><Check className="mr-2 h-4 w-4"/> Approuver</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
