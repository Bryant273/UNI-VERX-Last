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
import { allEvents } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import EventDetailsModal from '@/components/dashboard/event-details-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const eventTypeColors: Record<TimetableEventType, string> = {
  cours: 'bg-blue-100 dark:bg-blue-900/30',
  td: 'bg-orange-100 dark:bg-orange-900/30',
  tp: 'bg-green-100 dark:bg-green-900/30',
  examen: 'bg-red-100 dark:bg-red-900/30',
  devoir: 'bg-yellow-100 dark:bg-yellow-900/30',
  activité: 'bg-purple-100 dark:bg-purple-900/30',
};


const getEventForSlot = (
  events: (TimetableEvent & { day: string })[],
  day: string,
  time: string
) => {
  // A simple heuristic to match events to slots. A real app would need a more robust logic.
  // This finds the first event of the day that falls into the slot.
  return events.find(event => {
      if (event.day !== day) return false;
      
      const [eventStartStr] = event.time.split(' - ');
      const [slotStartStr] = time.split(' - ');

      // Simple string comparison works here because the format is HH:mm
      return eventStartStr === slotStartStr;
  });
};

export default function TimetablePage() {
  const params = useParams();
  const role = params.role as UserRole;
  // This is a simplified mapping. In a real app, this would be more dynamic.
  const userEvents: (TimetableEvent & {day: string})[] = [
    { ...allEvents[role][0], day: 'Lundi' }, 
    { ...allEvents.student[1], day: 'Mardi' }, 
    { ...allEvents.student[2], day: 'Jeudi' }, 
    { ...allEvents.student[3], day: 'Vendredi' }, 
    { ...allEvents.student[4], day: 'Lundi' }, 
  ];


  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleEventClick = (event: TimetableEvent | undefined) => {
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
    const timetableContent = document.getElementById('timetableContent');

    if (timetableContent) {
      // Short delay to allow modal to render
      setTimeout(() => {
        html2canvas(timetableContent, { scale: 2, backgroundColor: null }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = imgWidth / imgHeight;
          let newImgWidth = pdfWidth - 20; // with margin
          let newImgHeight = newImgWidth / ratio;
          
          if (newImgHeight > pdfHeight - 40) {
            newImgHeight = pdfHeight - 40;
            newImgWidth = newImgHeight * ratio;
          }

          const x = (pdfWidth - newImgWidth) / 2;
          const y = 20;

          pdf.setFontSize(18);
          pdf.text('Emploi du temps', pdfWidth / 2, 15, { align: 'center' });

          pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
          pdf.save('emploi-du-temps.pdf');
          setIsGeneratingPdf(false);
          setIsPdfModalOpen(false);
        });
      }, 500);
    }
  };
  
  const timeSlotsToRender = [
    '08:30 - 10:00',
    '10:30 - 12:00',
    '13:30 - 15:00',
    '15:30 - 17:00',
  ]

  return (
    <div className="flex flex-col h-full gap-6">
      <Card>
        <CardContent className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-semibold">
              Semaine du 24 au 30 Juin 2024
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">
              <CalendarIcon className="mr-2" />
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon">
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight />
            </Button>
             <Button onClick={handleGeneratePdf} >
              <FileText className="mr-2" />
              Exporter en PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        <table id="timetableContent" className="w-full min-w-[80rem] border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 border font-semibold text-sm w-28">JOURS</th>
              {DAYS_OF_WEEK.map((day, index) => (
                <th key={day} className="p-2 border font-semibold text-sm">
                  {day.toUpperCase()}
                  <span className="block font-normal text-xs text-muted-foreground">
                    {24 + index}/06
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time, timeIndex) => (
              <React.Fragment key={time}>
                <tr className='h-28'>
                  <td className="p-2 border font-medium text-sm text-center bg-muted/30">
                    {time}
                  </td>
                  {DAYS_OF_WEEK.map((day) => {
                    const event = getEventForSlot(userEvents, day, time);
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={cn(
                          'p-2 border align-top cursor-pointer hover:bg-muted/20 transition-colors',
                           event ? eventTypeColors[event.type] : ''
                        )}
                        onClick={() => handleEventClick(event)}
                      >
                        {event && (
                          <div>
                            <p className="font-bold text-primary text-sm">
                              {event.course}
                            </p>
                             <p className="text-xs text-muted-foreground font-medium">{event.type.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.instructor}
                            </p>
                            <p className="text-xs italic text-muted-foreground/80 mt-1">
                              {event.location}
                            </p>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {timeIndex === 0 && (
                  <tr>
                    <td
                      colSpan={DAYS_OF_WEEK.length + 1}
                      className="p-1 text-center text-xs font-medium bg-blue-900 text-white border"
                    >
                      RÉCRÉATION
                    </td>
                  </tr>
                )}
                 {timeIndex === 1 && (
                  <tr>
                    <td
                      colSpan={DAYS_OF_WEEK.length + 1}
                      className="p-1.5 text-center text-sm font-bold bg-muted/80 border"
                    >
                      PAUSE
                    </td>
                  </tr>
                )}
                 {timeIndex === 2 && (
                  <tr>
                    <td
                      colSpan={DAYS_OF_WEEK.length + 1}
                       className="p-1 text-center text-xs font-medium bg-blue-900 text-white border"
                    >
                      RÉCRÉATION
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

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
