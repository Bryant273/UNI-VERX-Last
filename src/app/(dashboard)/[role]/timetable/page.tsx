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
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import EventDetailsModal from '@/components/dashboard/event-details-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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


const getEventForSlot = (
  events: (TimetableEvent & { day: string })[],
  day: string,
  time: string
) => {
  return events.find(event => event.day === day && event.time === time);
};

export default function TimetablePage() {
  const params = useParams();
  const role = params.role as UserRole;
  
  // This is a simplified mapping. In a real app, this would be more dynamic.
  const userEvents: (TimetableEvent & {day: string})[] = [
    { ...allEvents.student[0], day: 'Lundi', time: '08:30 - 10:00' },
    { ...allEvents.student[1], day: 'Mardi', time: '10:30 - 12:00'},
    { ...allEvents.student[2], day: 'Jeudi', time: '13:30 - 15:00'},
    { ...allEvents.student[3], day: 'Vendredi', time: '08:30 - 10:00'},
    { ...allEvents.student[4], day: 'Lundi', time: '15:30 - 17:00'},
    { ...allEvents.professor[1], day: 'Mercredi', time: '10:30 - 12:00'},
    { ...allEvents.professor[2], day: 'Samedi', time: '08:30 - 10:00'},
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

    setTimeout(() => {
      const doc = new jsPDF('landscape');
      
      const weekString = 'Semaine du 24 au 30 Juin 2024';

      doc.setFontSize(18);
      doc.text('Emploi du temps', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(weekString, 14, 28);

      const headerX = doc.internal.pageSize.width - 14;
      doc.text(`Classe: ${studentData.class}`, headerX, 20, { align: 'right' });
      doc.text(`Niveau: ${studentData.class.split(' - ')[0]}`, headerX, 28, { align: 'right' });


      const head = [['Horaire', ...DAYS_OF_WEEK]];
      const body: any[] = [];

      TIME_SLOTS.forEach((time, index) => {
        // Add event row
        const row: string[] = [time];
        DAYS_OF_WEEK.forEach(day => {
          const event = getEventForSlot(userEvents, day, time);
          if (event) {
            row.push(`${event.course}\n(${event.type.toUpperCase()})\n${event.instructor || ''}\n${event.location}`);
          } else {
            row.push('');
          }
        });
        body.push(row);

        // Add break rows
        if (index === 0) {
            body.push([{ content: 'RÉCRÉATION', colSpan: 7, styles: { halign: 'center', fillColor: [30, 58, 138], textColor: [255, 255, 255] } }]);
        }
        if (index === 1) {
            body.push([{ content: 'PAUSE', colSpan: 7, styles: { halign: 'center', fillColor: [51, 65, 85], textColor: [255, 255, 255] } }]);
        }
        if (index === 2) {
             body.push([{ content: 'RÉCRÉATION', colSpan: 7, styles: { halign: 'center', fillColor: [30, 58, 138], textColor: [255, 255, 255] } }]);
        }
      });


      // @ts-ignore
      doc.autoTable({
        startY: 35,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] },
        styles: {
          cellPadding: 3,
          valign: 'middle',
          minCellHeight: 15,
        },
        didParseCell: function (data) {
          if (data.section === 'body' && !data.cell.raw.colSpan) { // Check it's not a recreation/pause row
             const event = getEventForSlot(userEvents, DAYS_OF_WEEK[data.column.index - 1], body[data.row.index][0]);
             if (event) {
                const colorMap = {
                    cours: [240, 248, 255],
                    td: [255, 247, 237],
                    tp: [240, 253, 244],
                    examen: [254, 242, 242],
                    activité: [250, 245, 255],
                    devoir: [255, 251, 235],
                };
                // @ts-ignore
                data.cell.styles.fillColor = colorMap[event.type];
             }
          }
        }
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
                  <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">
                    {time}
                  </td>
                  {DAYS_OF_WEEK.map((day) => {
                    const event = getEventForSlot(userEvents, day, time);
                    const colorConfig = event ? eventTypeColors[event.type] : null;
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={cn(
                          'p-0 border align-top transition-colors',
                           event ? 'cursor-pointer' : 'bg-muted/10'
                        )}
                        onClick={() => handleEventClick(event)}
                      >
                        {event && colorConfig ? (
                          <div className={cn(
                            "h-full w-full p-2.5 border-l-4 transition-colors", 
                            colorConfig.border, 
                            colorConfig.bg,
                            'hover:bg-opacity-20',
                            `hover:${colorConfig.bg.replace('/10', '/20')}`
                            )}>
                            <p className={cn("font-bold", colorConfig.text)}>
                              {event.course}
                            </p>
                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{event.type.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {event.instructor}
                            </p>
                            <p className="text-xs italic text-muted-foreground/80 mt-1">
                              {event.location}
                            </p>
                          </div>
                        ) : (
                          <div className="hover:bg-muted/30 h-full w-full">&nbsp;</div>
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
