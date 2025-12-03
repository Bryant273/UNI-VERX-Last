'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  FilePlus,
  BarChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { allPresenceData, type Presence } from '@/lib/presence-data';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusConfig = {
  present: {
    label: 'Présent',
    icon: CheckCircle,
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  absent: {
    label: 'Absent',
    icon: XCircle,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  },
  late: {
    label: 'En retard',
    icon: Clock,
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  },
  justified: {
    label: 'Justifié',
    icon: FileCheck,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  },
};

const ITEMS_PER_PAGE = 10;

export default function ProfessorPresencePage() {
  const [presences, setPresences] = useState<Presence[]>(allPresenceData);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Presence | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();
  
  const filteredPresences = useMemo(() => {
    return presences.filter(p => {
        const date = new Date(p.date);
        const yearMatch = yearFilter === 'all' || date.getFullYear().toString() === yearFilter;
        const monthMatch = monthFilter === 'all' || (date.getMonth() + 1).toString() === monthFilter;
        return yearMatch && monthMatch;
    })
  }, [presences, monthFilter, yearFilter]);

  const stats = useMemo(() => {
    const data = filteredPresences;
    const total = data.length;
    const present = data.filter(p => p.status === 'present' || p.status === 'justified').length;
    const absent = data.filter(p => p.status === 'absent').length;
    const late = data.filter(p => p.status === 'late').length;
    const rate = total > 0 ? ((present / (total - data.filter(p => p.status === 'justified').length)) * 100).toFixed(1) : '100.0';
    return { total, rate, absent, late };
  }, [filteredPresences]);

  const totalPages = Math.ceil(filteredPresences.length / ITEMS_PER_PAGE);

  const paginatedPresences = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPresences.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPresences, currentPage]);

  const handleJustify = (absence: Presence) => {
    setSelectedAbsence(absence);
    setIsJustifyModalOpen(true);
  };

  const handleJustificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAbsence) return;

    setPresences(prev =>
      prev.map(p =>
        p.id === selectedAbsence.id ? { ...p, status: 'justified', justification: 'Certificat médical' } : p
      )
    );
    setIsJustifyModalOpen(false);
    toast({
      title: 'Justificatif envoyé',
      description: `Votre ${selectedAbsence.status === 'absent' ? 'absence' : 'retard'} a été marqué comme justifié.`,
    });
  };
  
  const uniqueYears = useMemo(() => {
    return ["all", ...Array.from(new Set(presences.map(p => new Date(p.date).getFullYear().toString())))];
  }, [presences]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Taux de présence</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.rate}%</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total des cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Absences</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{stats.absent}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Retards</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-orange-600">{stats.late}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des présences</CardTitle>
          <CardDescription>Consultez votre historique de présence à tous vos cours.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
                 <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Année" /></SelectTrigger>
                    <SelectContent>
                        {uniqueYears.map(year => <SelectItem key={year} value={year}>{year === 'all' ? 'Toutes les années' : year}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Mois" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les mois</SelectItem>
                        {Array.from({length: 12}).map((_, i) => <SelectItem key={i} value={(i+1).toString()}>{new Date(0, i).toLocaleString('fr-FR', {month: 'long'})}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPresences.map((p) => {
                const status = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className="even:bg-muted/40">
                    <TableCell>{p.date}</TableCell>
                    <TableCell className="font-medium">{p.course}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.salle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border-0", status.color)}>
                        <status.icon className="mr-1.5 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(p.status === 'absent' || p.status === 'late') && (
                        <Button variant="outline" size="sm" onClick={() => handleJustify(p)}>
                          <FilePlus className="mr-2 h-4 w-4" />
                          Justifier
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
             <p className="text-sm text-muted-foreground">Affichage de {paginatedPresences.length} sur {filteredPresences.length} enregistrements</p>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                    <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                </div>
            )}
        </CardFooter>
      </Card>

      <Dialog open={isJustifyModalOpen} onOpenChange={setIsJustifyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier une absence ou un retard</DialogTitle>
            <DialogDescription>
              Fournissez un motif pour votre {selectedAbsence?.status === 'absent' ? 'absence' : 'retard'} du {selectedAbsence?.date} au cours de {selectedAbsence?.course}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJustificationSubmit}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="reason">Motif</Label>
                    <Textarea id="reason" placeholder="Ex: Rendez-vous médical, urgence familiale..." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="attachment">Justificatif (PDF, JPG, PNG)</Label>
                    <Input id="attachment" type="file" />
                </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Annuler</Button>
              </DialogClose>
              <Button type="submit">Envoyer le justificatif</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
