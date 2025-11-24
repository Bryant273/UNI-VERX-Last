'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Trash2,
  Calendar as CalendarIcon,
  Plus,
  BarChart,
  Users,
  Clock,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const eventTypeColors: { [key: string]: string } = {
  cours: 'bg-blue-500',
  td: 'bg-green-500',
  tp: 'bg-orange-500',
  exam: 'bg-red-500',
  projet: 'bg-purple-500',
};

const initialTimetableData: { [key: string]: any } = {
    "lundi_08:30-10:00": { module: "Mathématiques Discrètes", type: "cours", professor: "Prof. Dubois", room: "Amphi A" },
    "mercredi_08:30-10:00": { module: "Programmation Orientée Objet", type: "cours", professor: "Prof. Laurent", room: "Amphi B" },
    "vendredi_08:30-10:00": { module: "Développement Web", type: "cours", professor: "Prof. Girard", room: "Amphi C" },
    "mardi_10:30-12:00": { module: "Intelligence Artificielle", type: "td", professor: "Prof. Richard", room: "Salle 303" },
    "mercredi_10:30-12:00": { module: "Réseaux", type: "cours", professor: "Prof. Leroy", room: "Amphi A" },
    "vendredi_10:30-12:00": { module: "Machines Virtuelles", type: "tp", professor: "Prof. Blanc", room: "Labo 203" },
    "mercredi_13:30-15:00": { module: "Systèmes d'Exploitation", type: "cours", professor: "Prof. Petit", room: "Amphi B" },
    "jeudi_13:30-15:00": { module: "Architecture des Ordinateurs", type: "td", professor: "Prof. Leclerc", room: "Salle 302" },
    "lundi_15:30-17:00": { module: "Big Data", type: "cours", professor: "Prof. Robert", room: "Amphi A" },
    "mercredi_15:30-17:00": { module: "Interfaces Homme-Machine", type: "cours", professor: "Prof. Morel", room: "Amphi C" },
    "jeudi_15:30-17:00": { module: "Réseaux Avancés", type: "exam", professor: "Prof. Leroy", room: "Salle 301" },
    "vendredi_15:30-17:00": { module: "Anglais Technique", type: "td", professor: "Prof. Williams", room: "Salle 107" },
    "samedi_15:30-17:00": { module: "Projet Tutoré", type: "projet", professor: "Prof. Martin", room: "Salle 101" },
};

const CourseCell = ({ event, onOpenModal }: { event: any, onOpenModal: () => void }) => (
    <div className={cn("course-cell h-full p-2.5 has-course cursor-pointer group relative transition-all hover:shadow-lg hover:scale-105", `border-l-4 border-${eventTypeColors[event.type]?.replace('bg-','')}`)}>
        <p className="font-bold text-sm">{event.module}</p>
        <Badge className={cn("text-xs mt-1 border-0", eventTypeColors[event.type])}>{event.type}</Badge>
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            <p>{event.professor}</p>
            <p>{event.room}</p>
        </div>
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onOpenModal(); }} >
                <Plus />
            </Button>
        </div>
    </div>
);

const EmptyCell = ({ onOpenModal }: { onOpenModal: () => void }) => (
    <div className="course-cell empty h-full flex items-center justify-center cursor-pointer group" onClick={onOpenModal}>
        <Button variant="ghost" size="icon" className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="text-muted-foreground" />
        </Button>
    </div>
);


export default function GlobalPlanningPage() {
    const [timetable, setTimetable] = useState(initialTimetableData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCell, setCurrentCell] = useState<{ day: string, time: string } | null>(null);

    const handleOpenModal = (day: string, time: string) => {
        setCurrentCell({ day, time });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic to update timetable state would go here
        setIsModalOpen(false);
    };
    
    const weeklyHours = Object.keys(timetable).length * 1.5;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Programmation Globale des Cours</CardTitle>
                    <CardDescription>Planifiez l'emploi du temps de toutes les classes de l'université.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="w-full md:w-auto">
                                <Label htmlFor="classFilter">Classe/Niveau</Label>
                                <Select defaultValue="l3-info">
                                    <SelectTrigger id="classFilter"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="l3-info">L3 Informatique</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="w-full md:w-auto">
                                <Label htmlFor="weekFilter">Semaine</Label>
                                <Input type="week" id="weekFilter" defaultValue="2025-W20" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end">
                            <Button variant="outline"><Save className="mr-2" />Enregistrer</Button>
                            <Button variant="outline"><Copy className="mr-2" />Copier la semaine</Button>
                            <Button variant="destructive"><Trash2 className="mr-2" />Vider</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>L3 Informatique</CardTitle>
                        <CardDescription>Semaine du 12/05/2025 au 18/05/2025 • 89 étudiants</CardDescription>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Volume horaire</p>
                            <p className="text-lg font-bold text-primary">{weeklyHours}h / 30h max</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
                <table className="w-full min-w-[80rem] border-collapse">
                    <thead>
                        <tr className="bg-muted/50">
                            <th className="p-2 border font-semibold text-sm w-36">HORAIRES</th>
                            {DAYS_OF_WEEK.map((day) => (
                                <th key={day} className="p-2 border font-semibold text-sm">
                                    {day.toUpperCase()}
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
                                        const key = `${day.toLowerCase()}_${time}`;
                                        const event = timetable[key];
                                        return (
                                            <td key={key} className="p-0 border align-top">
                                                {event ? 
                                                    <CourseCell event={event} onOpenModal={() => handleOpenModal(day, time)} /> : 
                                                    <EmptyCell onOpenModal={() => handleOpenModal(day, time)} />
                                                }
                                            </td>
                                        );
                                    })}
                                </tr>
                                {timeIndex === 0 && (
                                  <tr><td colSpan={7} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>
                                )}
                                 {timeIndex === 1 && (
                                  <tr><td colSpan={7} className="p-1.5 text-center text-sm font-bold bg-muted/80 border">PAUSE DÉJEUNER</td></tr>
                                )}
                                 {timeIndex === 2 && (
                                  <tr><td colSpan={7} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{currentCell ? "Ajouter/Modifier un cours" : "Détails du cours"}</DialogTitle>
                        <DialogDescription>
                            Jour: {currentCell?.day} | Horaire: {currentCell?.time}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                        {/* Form fields from reference HTML */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label>Module/Matière</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="bdd">Bases de Données</SelectItem></SelectContent></Select></div>
                            <div><Label>Type de cours</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="cours">Cours Magistral</SelectItem></SelectContent></Select></div>
                            <div><Label>Enseignant</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="prof-dubois">Prof. Dubois</SelectItem></SelectContent></Select></div>
                            <div><Label>Salle</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="amphi-a">Amphi A</SelectItem></SelectContent></Select></div>
                            <div className="md:col-span-2"><Label>Notes (optionnel)</Label><Textarea /></div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
