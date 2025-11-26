
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  History,
  Filter,
  Download,
  Calendar as CalendarIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Globe,
  LogIn,
  Eye,
  CheckCheck,
  Megaphone,
  FileBarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ActionType = 'connexion' | 'validation' | 'rapport' | 'annonce' | 'planning' | 'consultation';

interface Action {
  id: string;
  date: Date;
  type: ActionType;
  details: string;
  location: string;
  device: 'Windows' | 'macOS' | 'iOS' | 'Android';
}

const actionConfig: Record<ActionType, { label: string; icon: LucideIcon; color: string; }> = {
  connexion: { label: 'Connexion', icon: LogIn, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
  validation: { label: 'Validation', icon: CheckCheck, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  rapport: { label: 'Rapport', icon: FileBarChart, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
  annonce: { label: 'Annonce', icon: Megaphone, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
  planning: { label: 'Planning', icon: CalendarIcon, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' },
  consultation: { label: 'Consultation', icon: Eye, color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300' },
};

const deviceConfig: Record<Action['device'], { icon: LucideIcon }> = {
    Windows: { icon: Monitor },
    macOS: { icon: Monitor },
    iOS: { icon: Smartphone },
    Android: { icon: Smartphone },
};

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const dayBeforeYesterday = new Date();
dayBeforeYesterday.setDate(today.getDate() - 2);

const mockActions: Action[] = [
  { id: 't-1', date: new Date(new Date(today).setHours(9, 2, 18)), type: 'connexion', details: 'Première connexion de la journée', location: 'Bureau C201', device: 'Windows' },
  { id: 't-2', date: new Date(new Date(today).setHours(9, 15, 30)), type: 'validation', details: 'Validation de 23 bulletins pour la L3 Info', location: 'Bureau C201', device: 'Windows' },
  { id: 't-3', date: new Date(new Date(today).setHours(10, 30, 5)), type: 'rapport', details: 'Génération du rapport de performance semestriel', location: 'Bureau C201', device: 'Windows' },
  { id: 'y-1', date: new Date(new Date(yesterday).setHours(8, 55, 12)), type: 'connexion', details: 'Connexion depuis un appareil mobile', location: 'À distance', device: 'iOS' },
  { id: 'y-2', date: new Date(new Date(yesterday).setHours(11, 45, 20)), type: 'annonce', details: 'Envoi de l\'annonce "Rappel inscriptions S2"', location: 'Bureau C201', device: 'macOS' },
  { id: 'y-3', date: new Date(new Date(yesterday).setHours(15, 0, 41)), type: 'consultation', details: 'Consultation du dossier de l\'étudiant Lucas Dupont (L1)', location: 'Bureau C201', device: 'macOS' },
  { id: 'dby-1', date: new Date(new Date(dayBeforeYesterday).setHours(10, 10, 10)), type: 'connexion', details: 'Première connexion de la journée', location: 'Bureau C201', device: 'macOS' },
  { id: 'dby-2', date: new Date(new Date(dayBeforeYesterday).setHours(14, 20, 0)), type: 'planning', details: 'Modification du planning des examens de M1', location: 'Bureau C201', device: 'macOS' },
  { id: 'dby-3', date: new Date(new Date(dayBeforeYesterday).setHours(16, 50, 15)), type: 'validation', details: 'Rejet de la demande de changement de salle pour "Physique Quantique"', location: 'Bureau C201', device: 'macOS' },
];

const ITEMS_PER_PAGE = 10;

export default function AcademicAdvisorActionsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeFilter, setActiveFilter] = useState<ActionType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActions = useMemo(() => {
    let actions = mockActions.filter(action =>
      date ? format(action.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') : true
    );
    if (activeFilter !== 'all') {
      actions = actions.filter(action => action.type === activeFilter);
    }
    return actions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [date, activeFilter]);

  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);
  const paginatedActions = filteredActions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [date, activeFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Journal d'Actions</CardTitle>
          <CardDescription>
            Retrouvez ici l'historique de toutes vos activités sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-semibold">
                Actions pour le {date ? format(date, "d MMMM yyyy", { locale: fr }) : '...'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {filteredActions.length} action{filteredActions.length > 1 ? 's' : ''} enregistrée{filteredActions.length > 1 ? 's' : ''}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>

              <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as ActionType | 'all')}>
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder="Filtrer par action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Toutes les actions</span>
                    </div>
                  </SelectItem>
                  {Object.keys(actionConfig).map((key) => {
                    const config = actionConfig[key as ActionType];
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <config.icon className="mr-2 h-4 w-4" />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Heure</TableHead>
                <TableHead>Type d'action</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Appareil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActions.length > 0 ? (
                paginatedActions.map((action) => {
                  const { icon: ActionIcon, label, color } = actionConfig[action.type];
                  const { icon: DeviceIcon } = deviceConfig[action.device];
                  
                  return (
                    <TableRow key={action.id} className={cn('even:bg-muted/40', action.type === 'connexion' && action.details === 'Première connexion de la journée' && 'bg-gradient-to-r from-primary/10 to-transparent')}>
                      <TableCell className="font-mono text-xs">{format(action.date, 'HH:mm:ss')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('border-0 font-normal', color)}>
                          <ActionIcon className="mr-1.5 h-3 w-3" />
                          {label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{action.details}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{action.location}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <DeviceIcon className="h-4 w-4" />
                          {action.device}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Aucune action trouvée pour cette date ou ce filtre.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <CardFooter className="p-4 flex items-center justify-between border-t">
            <p className="text-sm text-muted-foreground">
              Affichage de {paginatedActions.length} sur {filteredActions.length} actions
            </p>
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
              <span className="text-sm font-medium">
                Page {currentPage} sur {totalPages}
              </span>
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

