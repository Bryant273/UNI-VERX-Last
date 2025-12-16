
'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Save,
  Users,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import {
  initialEvents,
  roomsData,
  teachersData,
  modulesData,
  classesData,
  eventTypeColors,
  getEventTypeName,
  type TimetableEvent,
  type UniversityClass,
} from '@/lib/planning-data';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const AdminTimetablePage = () => {
  const [events, setEvents] = useState<TimetableEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('l3-info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const { toast } = useToast();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekString = `Semaine du ${format(weekStart, 'dd MMMM yyyy', { locale: fr })}`;

  const classEvents = useMemo(() => {
    return events.filter(e => e.classId === selectedClass);
  }, [events, selectedClass]);

  const stats = useMemo(() => {
    const totalHours = classEvents.length * 1.5;
    const roomUsage = new Set(classEvents.map(e => e.roomId)).size;
    const teacherCount = new Set(classEvents.map(e => e.teacherId)).size;
    return { totalHours, roomUsage, teacherCount };
  }, [classEvents]);

  const getEventForSlot = (day: string, time: string) => {
    return classEvents.find(event => event.day === day && event.time === time);
  };

  const handleCellClick = (day: string, time: string) => {
    const event = getEventForSlot(day, time);
    setSelectedSlot({ day, time });
    setEditingEvent(event || null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (formData: Omit<TimetableEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => (e.id === editingEvent.id ? { ...editingEvent, ...formData } : e)));
      toast({ title: "Cours modifié", description: "Le cours a été mis à jour avec succès." });
    } else {
      const newEvent = { ...formData, id: `event-${Date.now()}` };
      setEvents(prev => [...prev, newEvent]);
      toast({ title: "Cours ajouté", description: "Le nouveau cours a été ajouté au planning." });
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
      toast({ title: "Cours supprimé", variant: "destructive" });
    }
    setIsModalOpen(false);
  };

  const currentClassInfo = classesData.find(c => c.id === selectedClass);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <CardTitle>Emploi du temps global</CardTitle>
              <CardDescription>Gérez l'emploi du temps de toute l'université.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><Save className="mr-2" />Enregistrer</Button>
              <Button variant="outline"><Copy className="mr-2" />Copier la semaine</Button>
              <Button variant="destructive"><Trash2 className="mr-2" />Vider le planning</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[250px]"><SelectValue /></SelectTrigger>
            <SelectContent>{classesData.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 7))}><ChevronLeft/></Button>
            <span className="font-semibold text-sm w-full md:w-auto text-center">{weekString}</span>
            <Button variant="outline" size="icon" onClick={() => addDays(currentDate, 7)}><ChevronRight/></Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Classe sélectionnée</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{currentClassInfo?.name}</p><p className="text-sm text-muted-foreground">{currentClassInfo?.studentCount} étudiants</p></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Volume horaire</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{stats.totalHours}h / 30h</p><Progress value={(stats.totalHours / 30) * 100} className="h-2 mt-2"/></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Salles utilisées</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{stats.roomUsage}</p><p className="text-sm text-muted-foreground">salles distinctes</p></CardContent>
          </Card>
           <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Enseignants mobilisés</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{stats.teacherCount}</p><p className="text-sm text-muted-foreground">enseignants cette semaine</p></CardContent>
          </Card>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        <table className="w-full min-w-[80rem] border-collapse">
            <thead>
                <tr className="bg-muted/50">
                    <th className="p-2 border font-semibold text-sm w-36">HORAIRES</th>
                    {DAYS_OF_WEEK.map((day, index) => (
                        <th key={day} className="p-2 border font-semibold text-sm">
                            {day.toUpperCase()}
                            <span className="block font-normal text-xs text-muted-foreground">{format(addDays(weekStart, index), 'dd/MM')}</span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {TIME_SLOTS.map((time, timeIndex) => (
                    <React.Fragment key={time}>
                        <tr className="h-32">
                             <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">{time}</td>
                             {DAYS_OF_WEEK.map(day => {
                                 const event = getEventForSlot(day, time);
                                 const colorConfig = event ? eventTypeColors[event.type] : null;
                                 const module = modulesData.find(m => m.id === event?.moduleId);
                                 const teacher = teachersData.find(t => t.id === event?.teacherId);
                                 const room = roomsData.find(r => r.id === event?.roomId);

                                 return (
                                    <td key={`${day}-${time}`} className={cn("p-0 border align-top transition-colors cursor-pointer", !event && 'bg-muted/10 hover:bg-muted/30')} onClick={() => handleCellClick(day, time)}>
                                        {event && colorConfig ? (
                                            <div className={cn("relative h-full w-full p-2.5 border-l-4 flex flex-col group", colorConfig.border, colorConfig.bg)}>
                                                <p className={cn("font-bold text-sm", colorConfig.text)}>{module?.name}</p>
                                                <p className="text-xs font-semibold text-muted-foreground mt-0.5">{getEventTypeName(event.type)}</p>
                                                <div className="flex-grow" />
                                                <p className="text-xs text-muted-foreground mt-2">{teacher?.name}</p>
                                                <p className="text-xs italic text-muted-foreground/80 mt-1">{room?.name}</p>
                                            </div>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <Plus className="h-5 w-5 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </td>
                                 );
                             })}
                        </tr>
                        {timeIndex === 1 && <tr><td colSpan={DAYS_OF_WEEK.length + 1} className="p-1.5 text-center text-sm font-bold bg-muted/80 border">PAUSE DÉJEUNER</td></tr>}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={editingEvent}
        slot={selectedSlot}
        classId={selectedClass}
       />
    </div>
  );
};

const CourseModal = ({ isOpen, onClose, onSave, onDelete, event, slot, classId }: { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; onDelete: () => void; event: TimetableEvent | null; slot: { day: string; time: string } | null; classId: string; }) => {
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            day: slot!.day,
            time: slot!.time,
            classId: classId,
            moduleId: formData.get('moduleId') as string,
            type: formData.get('type') as TimetableEvent['type'],
            teacherId: formData.get('teacherId') as string,
            roomId: formData.get('roomId') as string,
            notes: formData.get('notes') as string,
        };
        onSave(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{event ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle>
                    <DialogDescription>
                        Créneau : {slot?.day} {slot?.time}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="moduleId">Module</Label><Select name="moduleId" defaultValue={event?.moduleId} required><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{modulesData.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label htmlFor="type">Type</Label><Select name="type" defaultValue={event?.type} required><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(eventTypeColors).map(t => <SelectItem key={t} value={t}>{getEventTypeName(t as TimetableEventType)}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label htmlFor="teacherId">Enseignant</Label><Select name="teacherId" defaultValue={event?.teacherId} required><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
                        <div><Label htmlFor="roomId">Salle</Label><Select name="roomId" defaultValue={event?.roomId} required><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{roomsData.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.capacity} pl.)</SelectItem>)}</SelectContent></Select></div>
                    </div>
                     <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" placeholder="Notes supplémentaires..." defaultValue={""} />
                    </div>
                    <DialogFooter>
                        {event && <Button type="button" variant="destructive" onClick={onDelete}>Supprimer</Button>}
                        <div className="flex-grow"></div>
                        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


export default AdminTimetablePage;

    