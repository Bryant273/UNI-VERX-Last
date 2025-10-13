
'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar as CalendarIcon,
  Loader2,
  Eye,
  UserCheck,
  Search,
  CheckCheck,
  X,
  Undo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { TimetableEventType } from '@/lib/data';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const eventTypeColors: Record<TimetableEventType, { border: string; bg: string; text: string }> = {
    cours: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300' },
    td: { border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-300' },
    tp: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-300' },
    examen: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-300' },
    devoir: { border: 'border-yellow-500', bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300' },
    activité: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300' },
};

const initialProfessorEvents = [
    { id: 1, day: "Lundi", time: "08:30 - 10:00", course: "Bases de Données", class: "L3 Informatique", type: "cours" as TimetableEventType, room: "Amphi B", students: 89, attendanceTaken: false, isPast: false },
    { id: 2, day: "Mercredi", time: "08:30 - 10:00", course: "Programmation Python", class: "L2 Informatique", type: "td" as TimetableEventType, room: "Labo 105", students: 32, attendanceTaken: true, isPast: false },
    { id: 3, day: "Vendredi", time: "08:30 - 10:00", course: "Algorithmique", class: "L1 Informatique", type: "cours" as TimetableEventType, room: "Amphi A", students: 65, attendanceTaken: false, isPast: false },
    { id: 4, day: "Mardi", time: "10:30 - 12:00", course: "Bases de Données Avancées", class: "M1 Informatique", type: "td" as TimetableEventType, room: "Labo 203", students: 24, attendanceTaken: false, isPast: false },
    { id: 5, day: "Mercredi", time: "10:30 - 12:00", course: "Programmation Python", class: "L2 Informatique", type: "tp" as TimetableEventType, room: "Labo 106", students: 16, attendanceTaken: false, isPast: false },
    { id: 7, day: "Mercredi", time: "13:30 - 15:00", course: "Algorithmique", class: "L1 Informatique", type: "td" as TimetableEventType, room: "Salle 205", students: 31, attendanceTaken: true, isPast: false },
    { id: 8, day: "Jeudi", time: "13:30 - 15:00", course: "Bases de Données", class: "L3 Informatique", type: "examen" as TimetableEventType, room: "Amphi C", students: 89, attendanceTaken: true, isPast: false },
    { id: 9, day: "Vendredi", time: "15:30 - 17:00", course: "Séminaire Recherche", class: "M2 Informatique", type: "activité" as TimetableEventType, room: "Salle Séminaire 1", students: 12, attendanceTaken: false, isPast: false },
];

const studentsListForAttendance = Array.from({ length: 89 }, (_, i) => ({ id: i, name: `Étudiant ${i + 1}` }));


export default function ProfessorTimetablePage() {
    const [mockProfessorEvents, setMockProfessorEvents] = useState(initialProfessorEvents);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [attendanceList, setAttendanceList] = useState(studentsListForAttendance.map(s => ({...s, present: false})));
    const [searchTerm, setSearchTerm] = useState('');

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekString = `Semaine du ${format(weekStart, 'dd MMMM yyyy', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;

    const getEventForSlot = (day: string, time: string) => {
        return mockProfessorEvents.find(event => event.day === day && event.time === time);
    };

    const filteredStudents = useMemo(() => {
        return attendanceList.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [attendanceList, searchTerm]);

    const presentCount = useMemo(() => attendanceList.filter(s => s.present).length, [attendanceList]);

    const handleEventClick = (event: any | undefined, action?: 'details' | 'attendance') => {
        if (!event) return;
        setSelectedEvent(event);
        if (action === 'attendance' && !event.attendanceTaken && !event.isPast) {
            setAttendanceList(studentsListForAttendance.slice(0, event.students).map(s => ({...s, present: false})));
            setIsAttendanceModalOpen(true);
        } else {
            setIsDetailsModalOpen(true);
        }
    };
    
    const handleValidateAttendance = () => {
        if (!selectedEvent) return;
        setMockProfessorEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === selectedEvent.id ? { ...event, attendanceTaken: true } : event
            )
        );
        setIsAttendanceModalOpen(false);
    };


    const handleGeneratePdf = () => {
        setIsPdfModalOpen(true);
        setIsGeneratingPdf(true);

        setTimeout(() => {
            const doc = new jsPDF('landscape');
            // ... Logic to generate PDF (simplified for brevity)
            doc.text("Emploi du temps - Dr. Claire Dubois", 14, 20);
            doc.text(weekString, 14, 30);
            // @ts-ignore
            doc.autoTable({
                html: '#timetable-table-for-pdf',
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [22, 163, 74] }
            });
            doc.save('planning_professeur.pdf');
            setIsGeneratingPdf(false);
            setIsPdfModalOpen(false);
        }, 1000);
    };

    const toggleStudentAttendance = (id: number) => {
        setAttendanceList(prev => prev.map(s => s.id === id ? {...s, present: !s.present} : s));
    }
    
    const markAll = (present: boolean) => {
        setAttendanceList(prev => prev.map(s => ({...s, present})));
    }

  return (
    <div className="flex flex-col h-full gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold capitalize">{weekString}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}><CalendarIcon className="mr-2 h-4 w-4" />Aujourd'hui</Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 7))}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}><ChevronRight /></Button>
            <Button onClick={handleGeneratePdf}><FileText className="mr-2 h-4 w-4" />Exporter en PDF</Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm flex-1">
        <table className="w-full min-w-[80rem] border-collapse" id="timetable-table-for-pdf">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 border font-semibold text-sm w-36">JOURS</th>
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
                <tr className="h-40">
                  <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">{time}</td>
                  {DAYS_OF_WEEK.map((day) => {
                    const event = getEventForSlot(day, time);
                    const colorConfig = event ? eventTypeColors[event.type] : null;
                    return (
                      <td key={`${day}-${time}`} className={cn('p-0 border align-top transition-colors', event ? 'cursor-pointer group' : 'bg-muted/10')} onClick={() => event && handleEventClick(event, 'details')}>
                        {event && colorConfig ? (
                          <div className={cn("relative h-full w-full p-2.5 border-l-4 flex flex-col", colorConfig.border, colorConfig.bg, 'hover:bg-opacity-20', `hover:${colorConfig.bg.replace('/10', '/20')}`)}>
                             <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 bg-white/20 hover:bg-white/40 disabled:bg-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed" 
                                    onClick={(e) => {e.stopPropagation(); handleEventClick(event, 'attendance');}}
                                    disabled={event.attendanceTaken || event.isPast}
                                >
                                    {event.attendanceTaken ? <CheckCheck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/20 hover:bg-white/40" onClick={(e) => {e.stopPropagation(); handleEventClick(event, 'details');}}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                             </div>
                            <p className={cn("font-bold text-sm", colorConfig.text)}>{event.course}</p>
                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{event.class}</p>
                            <p className="text-xs text-muted-foreground mt-1">{event.type.toUpperCase()}</p>
                            <div className="flex-grow" />
                            <p className="text-xs italic text-muted-foreground/80 mt-2">{event.room}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-1">{event.students} étudiants</p>
                          </div>
                        ) : (<div className="hover:bg-muted/30 h-full w-full">&nbsp;</div>)}
                      </td>
                    );
                  })}
                </tr>
                 {timeIndex === 0 && <tr><td colSpan={DAYS_OF_WEEK.length + 1} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>}
                 {timeIndex === 1 && <tr><td colSpan={DAYS_OF_WEEK.length + 1} className="p-1.5 text-center text-sm font-bold bg-muted/80 border">PAUSE</td></tr>}
                 {timeIndex === 2 && <tr><td colSpan={DAYS_OF_WEEK.length + 1} className="p-1 text-center text-xs font-medium bg-blue-900 text-white border">RÉCRÉATION</td></tr>}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

       {/* Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedEvent?.course}</DialogTitle>
                    <DialogDescription>{selectedEvent?.class} - {selectedEvent?.type.toUpperCase()}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <p><strong>Horaire :</strong> {selectedEvent?.time}</p>
                    <p><strong>Salle :</strong> {selectedEvent?.room}</p>
                    <p><strong>Étudiants :</strong> {selectedEvent?.students}</p>
                    {selectedEvent?.isPast && <p className="text-sm text-red-500">Cet événement est terminé.</p>}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDetailsModalOpen(false)}>Fermer</Button>
                    <Button 
                        onClick={() => { setIsDetailsModalOpen(false); handleEventClick(selectedEvent, 'attendance'); }}
                        disabled={selectedEvent?.attendanceTaken || selectedEvent?.isPast}
                    >
                         {selectedEvent?.attendanceTaken ? <CheckCheck className="mr-2 h-4 w-4"/> : <UserCheck className="mr-2 h-4 w-4"/>}
                         {selectedEvent?.attendanceTaken ? "Appel déjà fait" : "Faire l'appel"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Attendance Modal */}
        <Dialog open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen}>
            <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Appel des étudiants</DialogTitle>
                    <DialogDescription>{selectedEvent?.course} - {selectedEvent?.class}</DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-3 gap-4 text-center">
                    <Card><CardContent className="p-3"><p className="text-2xl font-bold text-green-600">{presentCount}</p><p className="text-xs">Présents</p></CardContent></Card>
                    <Card><CardContent className="p-3"><p className="text-2xl font-bold text-red-600">{attendanceList.length - presentCount}</p><p className="text-xs">Absents</p></CardContent></Card>
                    <Card><CardContent className="p-3"><p className="text-2xl font-bold">{attendanceList.length}</p><p className="text-xs">Total</p></CardContent></Card>
                 </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher un étudiant..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                 <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => markAll(true)}><CheckCheck className="mr-2 h-4 w-4"/>Tous présents</Button>
                    <Button size="sm" variant="outline" onClick={() => markAll(false)}><X className="mr-2 h-4 w-4"/>Tous absents</Button>
                    <Button size="sm" variant="outline" onClick={() => markAll(false)}><Undo className="mr-2 h-4 w-4"/>Réinitialiser</Button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {filteredStudents.map(student => (
                        <div key={student.id} className={cn("flex items-center justify-between p-2 rounded-lg border", student.present ? 'bg-green-500/10' : 'bg-muted/40')}>
                             <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://i.pravatar.cc/40?img=${student.id + 20}`} />
                                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{student.name}</span>
                            </div>
                            <Button variant={student.present ? 'default' : 'outline'} size="sm" onClick={() => toggleStudentAttendance(student.id)}>
                                {student.present ? <><CheckCheck className="mr-2 h-4 w-4"/>Présent</> : 'Marquer présent'}
                            </Button>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAttendanceModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleValidateAttendance}>Valider l'appel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* PDF Generation Modal */}
        <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Génération du PDF</DialogTitle>
                    <DialogDescription>Veuillez patienter pendant la création de votre planning en PDF.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
