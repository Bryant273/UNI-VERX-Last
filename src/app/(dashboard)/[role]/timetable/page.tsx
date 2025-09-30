'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TimetableEvent, TimetableEventType, UserRole } from '@/lib/data';
import { allEvents } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import EventDetailsModal from '@/components/dashboard/event-details-modal';

const eventTypeConfig: Record<TimetableEventType, { color: string; label: string }> = {
  cours: { color: 'bg-blue-500 border-blue-600', label: 'Cours' },
  devoir: { color: 'bg-yellow-400 border-yellow-500', label: 'Devoir' },
  examen: { color: 'bg-red-500 border-red-600', label: 'Examen' },
  activité: { color: 'bg-purple-500 border-purple-600', label: 'Activité' },
  td: { color: 'bg-green-500 border-green-600', label: 'TD' },
  tp: { color: 'bg-orange-500 border-orange-600', label: 'TP' },
};

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`); // 7h à 19h

const getEventPosition = (event: TimetableEvent) => {
  const [startTime, endTime] = event.time.split(' - ').map(t => {
    const [hours, minutes] = t.split(':').map(Number);
    return hours + minutes / 60;
  });

  const startHour = 7;
  const top = (startTime - startHour) * 4; // 4rem per hour
  const height = (endTime - startTime) * 4;

  return { top: `${top}rem`, height: `${height}rem` };
};

export default function TimetablePage() {
  const params = useParams();
  const role = params.role as UserRole;
  const userEvents = allEvents[role] || [];

  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: TimetableEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }

  // Pour cette démo, on assigne les événements à des jours fixes
  const eventsByDay: Record<string, TimetableEvent[]> = {
    Lundi: userEvents.filter(e => [1, 9].includes(e.id)),
    Mardi: userEvents.filter(e => e.id === 2),
    Mercredi: [],
    Jeudi: userEvents.filter(e => e.id === 6),
    Vendredi: userEvents.filter(e => e.id === 7),
    Samedi: [],
    Dimanche: [],
  };


  return (
    <div className="flex flex-col h-full gap-6">
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Semaine du 24 au 30 Juin 2024</h2>
                    <Button variant="outline" size="sm">Aujourd'hui</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                     <Button variant="outline" size="icon" className="h-8 w-8">
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
      
        <div className="flex-1 overflow-auto rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr,1fr,1fr] min-w-[80rem]">
                {/* Time column */}
                <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 text-center border-b border-r">
                    <Clock className="h-5 w-5 mx-auto text-muted-foreground"/>
                </div>

                {/* Day headers */}
                {DAYS_OF_WEEK.map((day, index) => (
                    <div key={day} className="col-start-2 row-start-1 p-2 text-center font-semibold border-b">
                        <p>{day}</p>
                        <p className="text-sm font-normal text-muted-foreground">{24 + index}</p>
                    </div>
                ))}

                {/* Time slots */}
                <div className="col-start-1 row-start-2 grid divide-y">
                    {TIME_SLOTS.map(time => (
                        <div key={time} className="h-16 flex items-center justify-center border-r">
                            <span className="text-xs text-muted-foreground">{time}</span>
                        </div>
                    ))}
                </div>

                {/* Event grid */}
                <div className="col-start-2 col-end-9 row-start-2 grid grid-cols-7 relative">
                    {/* Background lines */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="col-span-7 h-16 border-b" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className={`row-start-1 row-span-full h-full ${i < 6 ? 'border-r' : ''}`} style={{ gridColumnStart: i + 1 }} />
                    ))}
                    
                    {/* Events */}
                    {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <div key={day} className="relative" style={{ gridColumnStart: dayIndex + 1 }}>
                            {(eventsByDay[day] || []).map(event => {
                                const { top, height } = getEventPosition(event);
                                const config = eventTypeConfig[event.type];
                                return (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            'absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg text-white cursor-pointer hover:opacity-90 transition-opacity border-l-4',
                                            config.color,
                                            { 'line-through opacity-60': event.isPast }
                                        )}
                                        style={{ top, height }}
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <p className="text-xs font-bold leading-tight">{event.course}</p>
                                        <p className="text-[10px] opacity-90 leading-tight">{event.time}</p>
                                        <Badge variant="secondary" className="mt-1 bg-black/20 text-white text-[9px] h-auto p-0.5 px-1.5 border-0">
                                            {config.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {selectedEvent && (
            <EventDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                event={selectedEvent}
            />
        )}
    </div>
  );
}
