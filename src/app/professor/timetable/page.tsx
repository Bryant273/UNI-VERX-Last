

'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TimetableEventType } from '@/lib/data';
import Timetable from '@/components/shared/timetable';
import { initialDays, initialTimeSlots, initialBreaks } from '@/lib/hours-data';


const initialProfessorEvents = [
    { id: 1, day: "Lundi", time: "08:30 - 10:00", course: "Bases de Données", class: "L3 Informatique", type: "cours" as TimetableEventType, location: "Amphi B", students: 89, attendanceTaken: false, isPast: false },
    { id: 2, day: "Mercredi", time: "08:30 - 10:00", course: "Programmation Python", class: "L2 Informatique", type: "td" as TimetableEventType, location: "Labo 105", students: 32, attendanceTaken: true, isPast: false },
    { id: 3, day: "Vendredi", time: "08:30 - 10:00", course: "Algorithmique", class: "L1 Informatique", type: "cours" as TimetableEventType, location: "Amphi A", students: 65, attendanceTaken: false, isPast: false },
    { id: 4, day: "Mardi", time: "10:30 - 12:00", course: "Bases de Données Avancées", class: "M1 Informatique", type: "td" as TimetableEventType, location: "Labo 203", students: 24, attendanceTaken: false, isPast: false },
    { id: 5, day: "Mercredi", time: "10:30 - 12:00", course: "Programmation Python", class: "L2 Informatique", type: "tp" as TimetableEventType, location: "Labo 106", students: 16, attendanceTaken: false, isPast: false },
    { id: 7, day: "Mercredi", time: "13:30 - 15:00", course: "Algorithmique", class: "L1 Informatique", type: "td" as TimetableEventType, location: "Salle 205", students: 31, attendanceTaken: true, isPast: false },
    { id: 8, day: "Jeudi", time: "13:30 - 15:00", course: "Bases de Données", class: "L3 Informatique", type: "examen" as TimetableEventType, location: "Amphi C", students: 89, attendanceTaken: true, isPast: false },
    { id: 9, day: "Vendredi", time: "15:30 - 17:00", course: "Séminaire Recherche", class: "M2 Informatique", type: "activité" as TimetableEventType, location: "Salle Séminaire 1", students: 12, attendanceTaken: false, isPast: false },
];

const studentsListForAttendance = Array.from({ length: 89 }, (_, i) => ({ id: i, name: `Étudiant ${i + 1}` }));


export default function ProfessorTimetablePage() {
    const [mockProfessorEvents, setMockProfessorEvents] = useState(initialProfessorEvents);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekString = `Semaine du ${format(weekStart, 'dd MMMM yyyy', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;

    const handleEventClick = (day: string, time: string, event: any) => {
        // Logic to open details or attendance modal would go here
        console.log('Clicked on', event);
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

      <Timetable 
        weekStart={weekStart}
        days={initialDays}
        timeSlots={initialTimeSlots}
        breaks={initialBreaks}
        events={mockProfessorEvents}
        onCellClick={handleEventClick}
      />
     
      {/* Modals for details and attendance would be here */}

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
