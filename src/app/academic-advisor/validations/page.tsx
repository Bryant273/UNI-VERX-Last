
'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock, Check, X, Eye, RefreshCw, CheckCircle, FileText, Calendar, User, UserCheck, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { allValidations, validationData as detailedValidationData, type Validation, type ValidationType, type ValidationPriority } from '@/lib/validations-data';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const priorityConfig: Record<ValidationPriority, { text: string; color: string; }> = {
    urgent: { text: "Urgent", color: "border-red-500/80 bg-red-500/5 text-red-600 dark:text-red-400" },
    normal: { text: "Normal", color: "border-orange-500/80 bg-orange-500/5 text-orange-600 dark:text-orange-400" },
    low: { text: "Faible", color: "border-green-500/80 bg-green-500/5 text-green-600 dark:text-green-400" },
};

const typeConfig: Record<ValidationType, { text: string; icon: React.ElementType; }> = {
    notes: { text: "Notes", icon: FileText },
    planning: { text: "Planning", icon: Calendar },
    course: { text: "Cours", icon: FileText },
    absence: { text: "Absence", icon: UserCheck },
};

const ValidationRow = ({ validation, onSelect, onOpenModal, isSelected }: { validation: Validation, onSelect: (id: number, checked: boolean) => void, onOpenModal: (id: number) => void, isSelected: boolean }) => {
    const priority = priorityConfig[validation.priority];
    const type = typeConfig[validation.type];
    
    return (
        <TableRow className={cn('hover-lift transition-all', isSelected && 'bg-primary/5')}>
            <TableCell className="w-12 text-center">
                <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(validation.id, !!checked)} />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-12 rounded-full", priority.color.replace('border-','bg-'))}></div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{validation.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{validation.details}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className={cn("capitalize font-medium", priority.color)}>
                    {type.icon && <type.icon className="mr-1.5 h-3.5 w-3.5" />}
                    {type.text}
                </Badge>
            </TableCell>
            <TableCell>
                <p className="text-sm font-medium">{validation.teacher}</p>
                <p className="text-xs text-muted-foreground">{validation.time}</p>
            </TableCell>
             <TableCell className="text-sm">{validation.deadline}</TableCell>
            <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onOpenModal(validation.id)}><Eye className="h-4 w-4" /></Button>
            </TableCell>
        </TableRow>
    );
};

export default function ValidationsPage() {
    const [validations, setValidations] = useState<Validation[]>(allValidations.filter(v => v.status === 'pending'));
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<ValidationPriority | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<ValidationType | 'all'>('all');
    const [selectedValidationId, setSelectedValidationId] = useState<number | null>(null);
    const { toast } = useToast();
    
    const filteredValidations = useMemo(() => {
        return validations.filter(v => 
            (priorityFilter === 'all' || v.priority === priorityFilter) &&
            (typeFilter === 'all' || v.type === typeFilter)
        );
    }, [validations, priorityFilter, typeFilter]);

    const handleSelect = (id: number, checked: boolean) => {
        setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? filteredValidations.map(v => v.id) : []);
    };
    
    const handleAction = (ids: number[], action: 'approve' | 'reject') => {
        setValidations(prev => prev.filter(v => !ids.includes(v.id)));
        setSelectedIds([]);
        toast({
            title: `Succès`,
            description: `${ids.length} validation(s) ${action === 'approve' ? 'approuvée(s)' : 'rejetée(s)'}.`,
        })
    };

    const urgentCount = useMemo(() => validations.filter(v => v.priority === 'urgent').length, [validations]);
    const totalCount = validations.length;

    const DetailItem = ({ label, value }: { label: string; value: any }) => value ? (
        <div className="text-sm"><span className="text-muted-foreground">{label}:</span> <span className="font-semibold">{value}</span></div>
    ) : null;


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total en attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalCount}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Urgences</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{urgentCount}</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Validées aujourd'hui</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">8</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Temps moyen de traitement</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">2.3h</p></CardContent></Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Demandes de validation</CardTitle>
                    <CardDescription>{totalCount} demandes en attente de votre approbation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Checkbox id="selectAll" onCheckedChange={(checked) => handleSelectAll(!!checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredValidations.length} />
                            <Label htmlFor="selectAll" className="text-sm">Tout sélectionner</Label>
                            <Button variant="outline" size="sm" onClick={() => handleAction(selectedIds, 'approve')} disabled={selectedIds.length === 0}><Check className="mr-2 h-4 w-4"/>Approuver</Button>
                            <Button variant="outline" size="sm" onClick={() => handleAction(selectedIds, 'reject')} disabled={selectedIds.length === 0}><X className="mr-2 h-4 w-4"/>Rejeter</Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Toutes les priorités</SelectItem><SelectItem value="urgent">Urgent</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="low">Faible</SelectItem></SelectContent></Select>
                            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les types</SelectItem><SelectItem value="notes">Notes</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="course">Cours</SelectItem><SelectItem value="absence">Absence</SelectItem></SelectContent></Select>
                            <Button variant="ghost" size="icon" onClick={() => setValidations(allValidations.filter(v => v.status === 'pending'))}><RefreshCw className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">
                                    <Checkbox onCheckedChange={(checked) => handleSelectAll(!!checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredValidations.length} />
                                </TableHead>
                                <TableHead>Demande</TableHead>
                                <TableHead>Type/Priorité</TableHead>
                                <TableHead>Demandeur</TableHead>
                                <TableHead>Échéance</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredValidations.map(v => 
                                <ValidationRow 
                                    key={v.id} 
                                    validation={v} 
                                    onSelect={handleSelect} 
                                    onOpenModal={setSelectedValidationId}
                                    isSelected={selectedIds.includes(v.id)}
                                />
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={!!selectedValidationId} onOpenChange={() => setSelectedValidationId(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedValidationId && detailedValidationData[selectedValidationId] ? (
                        <>
                        <DialogHeader>
                            <DialogTitle>{detailedValidationData[selectedValidationId].title}</DialogTitle>
                            <DialogDescription>Détails de la demande de validation</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem label="Demandeur" value={detailedValidationData[selectedValidationId].teacher} />
                                <DetailItem label="Type" value={detailedValidationData[selectedValidationId].type} />
                                <DetailItem label="Niveau" value={detailedValidationData[selectedValidationId].level} />
                                <DetailItem label="Étudiants concernés" value={detailedValidationData[selectedValidationId].students} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem label="Moyenne" value={detailedValidationData[selectedValidationId].average} />
                                <DetailItem label="Taux de réussite" value={detailedValidationData[selectedValidationId].successRate} />
                                <DetailItem label="Ancien créneau" value={detailedValidationData[selectedValidationId].oldSlot} />
                                <DetailItem label="Nouveau créneau" value={detailedValidationData[selectedValidationId].newSlot} />
                                <DetailItem label="Salle" value={detailedValidationData[selectedValidationId].room} />
                                <DetailItem label="Volume horaire" value={detailedValidationData[selectedValidationId].hours} />
                                <DetailItem label="Crédits ECTS" value={detailedValidationData[selectedValidationId].ects} />
                            </div>
                             <div>
                                <h4 className="font-semibold text-sm mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{detailedValidationData[selectedValidationId].details}</p>
                             </div>
                        </div>
                        <DialogFooter>
                            <Button variant="destructive" onClick={() => { handleAction([selectedValidationId], 'reject'); setSelectedValidationId(null); }}>Rejeter</Button>
                            <Button onClick={() => { handleAction([selectedValidationId], 'approve'); setSelectedValidationId(null); }}>Approuver</Button>
                        </DialogFooter>
                        </>
                    ) : (
                        <p>Détails non disponibles pour cette validation.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
