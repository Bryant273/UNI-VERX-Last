

'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  Calendar as CalendarIcon,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { TimetableEvent, UserRole, TimetableEventType } from '@/lib/data';
import { allEvents, studentData } from '@/lib/static-data';
import EventDetailsModal from '@/components/dashboard/event-details-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Timetable from '@/components/shared/timetable';
import { initialDays, initialTimeSlots, initialBreaks } from '@/lib/hours-data';


export default function TimetablePage() {
  const role: UserRole = 'student';
  
  // This is a simplified mapping. In a real app, this would be more dynamic.
  const userEvents: (TimetableEvent & {day: string})[] = [
    { ...allEvents.student[0], day: 'Lundi', time: '08:30 - 10:00' },
    { ...allEvents.student[1], day: 'Mardi', time: '10:30 - 12:00'},
    { ...allEvents.student[2], day: 'Jeudi', time: '13:30 - 15:00'},
    { ...allEvents.student[3], day: 'Vendredi', time: '08:30 - 10:00'},
    { ...allEvents.student[4], day: 'Lundi', time: '15:30 - 17:00'},
    { ...allEvents.professor[0], day: 'Mercredi', time: '10:30 - 12:00', type: 'cours'},
    { ...allEvents.professor[1], day: 'Samedi', time: '08:30 - 10:00', type: 'activité' },
  ];


  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weekString = `Semaine du ${format(weekStart, 'dd MMMM yyyy', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;

  const handleEventClick = (day: string, time: string, event?: TimetableEvent) => {
    if (!event) return;
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleGeneratePdf = () => {
    setIsPdfModalOpen(true);
    setIsGeneratingPdf(true);

    setTimeout(() => {
      const doc = new jsPDF('landscape');
      
      doc.setFontSize(18);
      doc.text('Emploi du temps', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(weekString, 14, 28);

      const headerX = doc.internal.pageSize.width - 14;
      doc.text(`Classe: ${studentData.class}`, headerX, 20, { align: 'right' });

      // @ts-ignore
      doc.autoTable({
        html: '#timetable-table-for-pdf',
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] }
      });
      
      doc.save('emploi-du-temps.pdf');
      setIsGeneratingPdf(false);
      setIsPdfModalOpen(false);
    }, 500);
  };
  
  return (
    <div className="flex flex-col h-full gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-semibold capitalize">
              {weekString}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              <CalendarIcon className="mr-2" />
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 7))}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
              <ChevronRight />
            </Button>
             <Button onClick={handleGeneratePdf} >
              <FileText className="mr-2" />
              Exporter en PDF
            </Button>
          </div>
        </CardContent>
      </Card>
        
      <Timetable
        weekStart={weekStart}
        days={initialDays}
        timeSlots={initialTimeSlots}
        breaks={initialBreaks}
        events={userEvents}
        onCellClick={handleEventClick}
       />

      {selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}

      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Génération du PDF</DialogTitle>
            <DialogDescription>
              Veuillez patienter pendant la création de votre emploi du temps au format PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
