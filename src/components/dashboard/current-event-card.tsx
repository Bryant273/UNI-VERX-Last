'use client';

import { cn } from '@/lib/utils';
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
      <Card className="w-24 h-24 flex flex-col items-center justify-center bg-muted">
        <CardContent className="flex flex-col items-center justify-center p-2 text-center">
          <p className="text-xs font-semibold mb-1">Rien de prévu</p>
          <p className="text-xs text-muted-foreground">Bonne journée !</p>
        </CardContent>
      </Card>
    );
  }

  const { type, course, time, location } = event;
  const config = eventTypeConfig[type];

  return (
    <Card 
      className={cn(
        "w-36 h-36 flex flex-col justify-between p-3 text-white cursor-pointer hover:scale-105 transition-transform",
        config.color
      )}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-bold">{config.label}</h3>
        <Badge variant="secondary" className="bg-black/20 text-white border-0 text-xs">
          En cours
        </Badge>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold">{course}</p>
        <p className="text-[10px]">{time}</p>
        <p className="text-[10px] opacity-80">{location}</p>
      </div>
    </Card>
  );
}
