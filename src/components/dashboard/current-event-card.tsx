'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserRole, TimetableEvent, TimetableEventType } from '@/lib/data';
import { getActiveEvent } from '@/lib/data';
import { useEffect, useState } from 'react';

const eventTypeConfig: Record<TimetableEventType, { color: string; label: string }> = {
  cours: { color: 'bg-blue-900', label: 'Cours' },
  devoir: { color: 'bg-orange-500', label: 'Devoir' },
  examen: { color: 'bg-red-600', label: 'Examen' },
  activité: { color: 'bg-green-500', label: 'Activité' },
};

export default function CurrentEventCard({ role }: { role: UserRole }) {
  // Use state to avoid hydration mismatch
  const [event, setEvent] = useState<TimetableEvent | null>(null);

  useEffect(() => {
    setEvent(getActiveEvent(role));
  }, [role]);

  if (!event) {
    return (
      <Card className="aspect-square flex flex-col items-center justify-center bg-muted">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="font-semibold mb-2">Aucun événement pour aujourd'hui</p>
          <p className="text-sm text-muted-foreground">Profitez de votre journée !</p>
        </CardContent>
      </Card>
    );
  }

  const { type, course, time, location } = event;
  const config = eventTypeConfig[type];

  return (
    <Card 
      className={cn(
        "aspect-square flex flex-col justify-between p-6 text-white cursor-pointer hover:scale-105 transition-transform",
        config.color
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold">{config.label}</h3>
        <Badge variant="secondary" className="bg-black/20 text-white border-0">
          En cours
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold">{course}</p>
        <p className="text-base">{time}</p>
        <p className="text-sm opacity-80">{location}</p>
      </div>
      
      <div className="text-center">
        <p className="text-xs opacity-70">Événement selon l'heure & l'emploi du temps</p>
      </div>
    </Card>
  );
}
