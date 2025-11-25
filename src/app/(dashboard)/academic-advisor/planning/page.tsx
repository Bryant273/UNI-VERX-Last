'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TimetableEventType } from '@/lib/data';
import { allEvents } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const eventTypeConfig: Record<TimetableEventType, { label: string; color: string }> = {
  cours: { label: 'Cours', color: 'bg-blue-500' },
  td: { label: 'TD', color: 'bg-green-500' },
  tp: { label: 'TP', color: 'bg-amber-500' },
  examen: { label: 'Examen', color: 'bg-red-500' },
  projet: { label: 'Projet', color: 'bg-purple-500' },
  activité: { label: 'Activité', color: 'bg-indigo-500' },
  devoir: { label: 'Devoir', color: 'bg-pink-500' },
};

const initialEvents = {
    "Lundi_08:30-10:00": { module: "Mathématiques Discrètes", type: "cours", professor: "Prof. Dubois", room: "Amphi A" },
    "Mercredi_08:30-10:00": { module: "Programmation Orientée Objet", type: "cours", professor: "Prof. Laurent", room: "Amphi B" },
    "Vendredi_08:30-10:00": { module: "Développement Web", type: "cours", professor: "Prof. Girard", room: "Amphi C" },
    "Mardi_10:30-12:00": { module: "Intelligence Artificielle", type: "td", professor: "Prof. Richard", room: "Salle 303" },
    "Mercredi_10:30-12:00": { module: "Réseaux", type: "cours", professor: "Prof. Leroy", room: "Amphi A" },
    "Vendredi_10:30-12:00": { module: "Machines Virtuelles", type: "tp", professor: "Prof. Blanc", room: "Labo 203" },
    "Mercredi_13:30-15:00": { module: "Systèmes d'Exploitation", type: "cours", professor: "Prof. Petit", room: "Amphi B" },
    "Jeudi_13:30-15:00": { module: "Architecture des Ordinateurs", type: "td", professor: "Prof. Leclerc", room: "Salle 302" },
    "Lundi_15:30-17:00": { module: "Big Data", type: "cours", professor: "Prof. Robert", room: "Amphi A" },
    "Mercredi_15:30-17:00": { module: "Interfaces Homme-Machine", type: "cours", professor: "Prof. Morel", room: "Amphi C" },
    "Jeudi_15:30-17:00": { module: "Réseaux Avancés", type: "examen", professor: "Prof. Leroy", room: "Salle 301" },
    "Vendredi_15:30-17:00": { module: "Anglais Technique", type: "td", professor: "Prof. Williams", room: "Salle 107" },
    "Samedi_15:30-17:00": { module: "Projet Tutoré", type: "projet", professor: "Prof. Martin", room: "Salle 101" },
};


export default function GlobalTimetablePage() {
    const [events, setEvents] = useState(initialEvents);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{ day: string; time: string } | null>(null);
    const isEditMode = useMemo(() => editingCell && events[`${editingCell.day}_${editingCell.time}` as keyof typeof events], [editingCell, events]);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    
    const handleCellClick = (day: string, time: string) => {
        setEditingCell({ day, time });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingCell) return;

        const formData = new FormData(e.currentTarget);
        const newEvent = {
            module: formData.get('courseModule') as string,
            type: formData.get('courseType') as TimetableEventType,
            professor: formData.get('courseProfessor') as string,
            room: formData.get('courseRoom') as string,
        };
        const key = `${editingCell.day}_${editingCell.time}`;
        setEvents(prev => ({...prev, [key]: newEvent }));
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        if (!editingCell) return;
        const key = `${editingCell.day}_${editingCell.time}`;
        const newEvents = { ...events };
        // @ts-ignore
        delete newEvents[key];
        setEvents(newEvents);
        setIsModalOpen(false);
    };

  return (
    <div className="flex flex-col h-full gap-6 animate-fadeIn">
       <Card>
            <CardHeader>
                <CardTitle>Programmation des Cours</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="w-full md:w-auto">
                            <Label htmlFor="classFilter">Classe/Niveau</Label>
                            <Select defaultValue="l3-info">
                                <SelectTrigger id="classFilter">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="l3-info">L3 Informatique</SelectItem>
                                    <SelectItem value="l2-info">L2 Informatique</SelectItem>
                                    <SelectItem value="l1-info">L1 Informatique</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-auto">
                             <Label htmlFor="weekFilter">Semaine</Label>
                             <Input id="weekFilter" type="week" defaultValue="2025-W20" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline"><Save className="mr-2"/>Enregistrer tout</Button>
                        <Button variant="destructive"><Trash2 className="mr-2"/>Vider planning</Button>
                        <Button variant="outline"><Copy className="mr-2"/>Copier semaine</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold">L3 Informatique</h3>
                    <p className="text-sm text-muted-foreground">Semaine du 12/05/2025 au 18/05/2025 • 89 étudiants inscrits</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-sm font-medium">Volume horaire</span>
                        <span className="text-lg font-bold text-primary ml-2">24h</span>
                        <span className="text-sm text-muted-foreground">/ 30h max</span>
                    </div>
                    <div className="relative h-16 w-16">
                        <Progress value={80} className="absolute w-full h-full rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">80%</div>
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                {Object.values(eventTypeConfig).map(type => (
                    <div key={type.label} className="flex items-center">
                        <div className={cn("w-3 h-3 rounded-full mr-2", type.color)}></div>
                        <span>{type.label}</span>
                    </div>
                ))}
            </div>
          <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
            <table className="w-full min-w-[80rem] border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 border font-semibold text-sm w-36">HORAIRES</th>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <th key={day} className="p-2 border font-semibold text-sm">
                      {day.toUpperCase()}
                      <span className="block font-normal text-xs text-muted-foreground">({format(addDays(weekStart, index), 'dd/MM')})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((time, timeIndex) => (
                  <React.Fragment key={time}>
                    <tr className='h-32'>
                      <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">{time}</td>
                      {DAYS_OF_WEEK.map((day) => {
                        const eventKey = `${day}_${time.replace(' ', '')}`;
                        // @ts-ignore
                        const event = events[eventKey];
                        const config = event ? eventTypeConfig[event.type as TimetableEventType] : null;
                        
                        return (
                          <td key={`${day}-${time}`} className="p-0 border align-top transition-colors relative group" onClick={() => handleCellClick(day, time)}>
                            {event ? (
                              <div className="h-full w-full p-2.5">
                                <p className="font-bold text-sm">{event.module}</p>
                                <span className={cn("text-xs font-medium text-white px-2 py-0.5 rounded-full", config?.color)}>{config?.label}</span>
                                <div className="text-xs text-muted-foreground mt-2">{event.professor}</div>
                                <div className="text-xs italic text-muted-foreground/80 mt-1">{event.room}</div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center hover:bg-muted/30">
                                <Button variant="ghost" size="icon" className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus />
                                </Button>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {timeIndex === 0 && <tr><td colSpan={7} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>}
                    {timeIndex === 1 && <tr><td colSpan={7} className="p-1.5 text-center text-sm font-bold bg-muted/80 border">PAUSE DÉJEUNER</td></tr>}
                    {timeIndex === 2 && <tr><td colSpan={7} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle>
                    <DialogDescription>Remplissez les détails du créneau.</DialogDescription>
                </DialogHeader>
                 <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="courseModule">Module/Matière *</Label>
                                <Select name="courseModule" defaultValue={isEditMode ? (events[`${editingCell?.day}_${editingCell?.time}` as keyof typeof events] as any).module : ''}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un module" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mathématiques Discrètes">Mathématiques Discrètes</SelectItem>
                                        <SelectItem value="Algorithmique Avancée">Algorithmique Avancée</SelectItem>
                                        <SelectItem value="Programmation Orientée Objet">Programmation Orientée Objet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="courseType">Type de cours *</Label>
                                <Select name="courseType" defaultValue={isEditMode ? (events[`${editingCell?.day}_${editingCell?.time}` as keyof typeof events] as any).type : ''}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(eventTypeConfig).map(([key, {label}]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="courseProfessor">Enseignant *</Label>
                                <Select name="courseProfessor" defaultValue={isEditMode ? (events[`${editingCell?.day}_${editingCell?.time}` as keyof typeof events] as any).professor : ''}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un enseignant" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Prof. Dubois">Prof. Dubois</SelectItem>
                                        <SelectItem value="Prof. Laurent">Prof. Laurent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="courseRoom">Salle *</Label>
                                <Select name="courseRoom" defaultValue={isEditMode ? (events[`${editingCell?.day}_${editingCell?.time}` as keyof typeof events] as any).room : ''}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner une salle" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Amphi A">Amphi A</SelectItem>
                                        <SelectItem value="Salle 101">Salle 101</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="courseClass">Classe/Niveau *</Label>
                                <Select name="courseClass" defaultValue="l3-info">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="l3-info">L3 Informatique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="courseNotes">Notes (optionnel)</Label>
                                <Textarea name="courseNotes" placeholder="Notes supplémentaires..." />
                            </div>
                        </div>
                    </div>
                     <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        {isEditMode && <Button type="button" variant="destructive" onClick={handleDelete}>Supprimer</Button>}
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
