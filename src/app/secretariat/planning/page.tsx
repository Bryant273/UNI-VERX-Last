
'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AcademicEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'vacances' | 'examen' | 'rentree' | 'ferie';
}

const initialEvents: AcademicEvent[] = [
  { id: 1, title: 'Rentrée Universitaire', startDate: new Date('2024-09-02'), endDate: new Date('2024-09-02'), type: 'rentree' },
  { id: 2, title: 'Vacances de la Toussaint', startDate: new Date('2024-10-26'), endDate: new Date('2024-11-03'), type: 'vacances' },
  { id: 3, title: 'Vacances de Noël', startDate: new Date('2024-12-21'), endDate: new Date('2025-01-05'), type: 'vacances' },
  { id: 4, title: 'Examens du Semestre 1', startDate: new Date('2025-01-13'), endDate: new Date('2025-01-24'), type: 'examen' },
  { id: 5, title: 'Vacances d\'hiver', startDate: new Date('2025-02-15'), endDate: new Date('2025-03-02'), type: 'vacances' },
  { id: 6, title: 'Vacances de printemps', startDate: new Date('2025-04-12'), endDate: new Date('2025-04-27'), type: 'vacances' },
  { id: 7, title: 'Examens du Semestre 2', startDate: new Date('2025-05-19'), endDate: new Date('2025-05-30'), type: 'examen' },
  { id: 8, title: 'Fête du Travail', startDate: new Date('2025-05-01'), endDate: new Date('2025-05-01'), type: 'ferie' },
];

const EventModal = ({
    isOpen, onClose, onSave, event
}: { isOpen: boolean; onClose: () => void; onSave: (event: Omit<AcademicEvent, 'id'> & { id?: number }) => void; event: AcademicEvent | null }) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newEventData = {
            id: event?.id,
            title: formData.get('title') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
            type: formData.get('type') as AcademicEvent['type'],
        };
        onSave(newEventData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{event ? 'Modifier' : 'Ajouter'} un événement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre de l'événement</Label>
                        <Input id="title" name="title" defaultValue={event?.title} placeholder="Ex: Rentrée universitaire" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="startDate">Date de début</Label>
                            <Input id="startDate" name="startDate" type="date" defaultValue={event?.startDate.toISOString().split('T')[0]} required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">Date de fin</Label>
                            <Input id="endDate" name="endDate" type="date" defaultValue={event?.endDate.toISOString().split('T')[0]} required/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Type d'événement</Label>
                        <select id="type" name="type" defaultValue={event?.type} className="w-full h-10 border-input bg-background rounded-md border px-3">
                            <option value="rentree">Rentrée</option>
                            <option value="vacances">Vacances</option>
                            <option value="examen">Période d'examens</option>
                            <option value="ferie">Jour férié</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function SecretariatPlanningPage() {
    const [events, setEvents] = useState<AcademicEvent[]>(initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const { toast } = useToast();

    const calendarEvents = useMemo(() => {
        const calendar: { [key: string]: AcademicEvent[] } = {};
        events.filter(e => e.startDate.getFullYear() === year).forEach(event => {
            const month = format(event.startDate, 'MMMM', { locale: fr });
            if (!calendar[month]) {
                calendar[month] = [];
            }
            calendar[month].push(event);
        });
        Object.values(calendar).forEach(monthEvents => monthEvents.sort((a,b) => a.startDate.getTime() - b.startDate.getTime()));
        return Object.entries(calendar);
    }, [events, year]);
    
    const handleOpenModal = (event: AcademicEvent | null = null) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (eventData: Omit<AcademicEvent, 'id'> & { id?: number }) => {
        if (eventData.id) {
            setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } as AcademicEvent : e));
            toast({ title: 'Événement mis à jour !' });
        } else {
            setEvents([...events, { ...eventData, id: Date.now() }]);
            toast({ title: 'Événement ajouté !' });
        }
        setIsModalOpen(false);
    };

    const handleDeleteEvent = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
        toast({ title: 'Événement supprimé', variant: 'destructive' });
    }

    const typeColors = {
        vacances: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        examen: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        rentree: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        ferie: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><CalendarIcon /> Calendrier Universitaire</CardTitle>
                            <CardDescription>Gérez les dates clés de l'année académique.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-10 border-input bg-background rounded-md border px-3">
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                             </select>
                            <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4"/>Ajouter un événement</Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calendarEvents.map(([month, monthEvents]) => (
                    <Card key={month}>
                        <CardHeader><CardTitle className="capitalize">{month} {year}</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {monthEvents.map(event => (
                                <div key={event.id} className={cn("p-3 rounded-lg flex justify-between items-center", typeColors[event.type])}>
                                    <div>
                                        <p className="font-semibold text-sm">{event.title}</p>
                                        <p className="text-xs">{format(event.startDate, 'd MMMM', { locale: fr })} - {format(event.endDate, 'd MMMM yyyy', { locale: fr })}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenModal(event)}><Edit className="h-4 w-4"/></Button>
                                         <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEvent} event={editingEvent}/>
        </div>
    );
}
