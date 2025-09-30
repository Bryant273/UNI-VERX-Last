'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserRole, TimetableEvent, TimetableEventType } from '@/lib/data';
import { getActiveEvent } from '@/lib/data';
import { useEffect, useState } from 'react';
import { PartyPopper } from 'lucide-react';
import EventDetailsModal from './event-details-modal';

const eventTypeConfig: Record<TimetableEventType, { color: string; label: string }> = {
  cours: { color: 'bg-blue-500', label: 'Cours' },
  devoir: { color: 'bg-orange-500', label: 'Devoir' },
  examen: { color: 'bg-red-600', label: 'Examen' },
  activité: { color: 'bg-purple-500', label: 'Activité' },
  td: { color: 'bg-orange-500', label: 'TD' },
  tp: { color: 'bg-orange-500', label: 'TP' },
};

export default function CurrentEventCard({ role }: { role: UserRole }) {
  const [event, setEvent] = useState<TimetableEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
        setEvent(await getActiveEvent(role));
    }
    fetchEvent();
  }, [role]);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  if (!event) {
    return (
      <>
        <Card 
          className="w-72 h-72 flex flex-col items-center justify-center bg-muted/80 cursor-pointer hover:scale-105 transition-transform shadow-lg"
          onClick={handleCardClick}
        >
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <PartyPopper className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">Aucun évènement en cours</p>
          </CardContent>
        </Card>
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={null}
        />
      </>
    );
  }

  const { type, course, time, location } = event;
  const config = eventTypeConfig[type];

  return (
    <>
      <Card 
        className={cn(
          "w-72 h-72 flex flex-col justify-between p-4 text-white cursor-pointer hover:scale-105 transition-transform shadow-lg",
          config.color
        )}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{config.label}</h3>
          <Badge variant="secondary" className="bg-black/20 text-white border-0 text-xs">
            En cours
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold">{course}</p>
          <p className="text-sm">{time}</p>
          <p className="text-sm opacity-80">{location}</p>
        </div>
      </Card>
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
}
