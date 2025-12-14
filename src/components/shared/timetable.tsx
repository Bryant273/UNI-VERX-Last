'use client';

import React from 'react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { TimetableEventType } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { CheckCheck, Eye, UserCheck } from 'lucide-react';

interface TimetableEvent {
  id: number | string;
  day: string;
  time: string;
  course: string;
  type: TimetableEventType;
  location: string;
  instructor?: string;
  students?: number;
  attendanceTaken?: boolean;
  isPast?: boolean;
  class?: string;
}

interface DaySetting {
  id: string;
  name: string;
  active: boolean;
}

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

interface BreakSetting {
  id: number;
  name: string;
  start: string;
  end: string;
}

interface TimetableProps {
  weekStart: Date;
  days: DaySetting[];
  timeSlots: TimeSlot[];
  breaks: BreakSetting[];
  events: TimetableEvent[];
  onCellClick?: (day: string, time: string, event?: TimetableEvent) => void;
}

const eventTypeColors: Record<TimetableEventType, { border: string; bg: string; text: string }> = {
    cours: { border: 'border-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    td: { border: 'border-green-500', bg: 'bg-green-500/10 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    tp: { border: 'border-orange-500', bg: 'bg-orange-500/10 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    examen: { border: 'border-red-500', bg: 'bg-red-500/10 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    activité: { border: 'border-purple-500', bg: 'bg-purple-500/10 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    devoir: { border: 'border-yellow-500', bg: 'bg-yellow-500/10 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
};


export default function Timetable({ weekStart, days, timeSlots, breaks, events, onCellClick }: TimetableProps) {
  const activeDays = days.filter(d => d.active);
  const sortedTimeSlots = [...timeSlots].sort((a, b) => a.start.localeCompare(b.start));

  const getEventForSlot = (day: string, time: string) => {
    const formattedTime = `${time.split(' - ')[0]}`;
    return events.find(event => event.day === day && event.time.startsWith(formattedTime));
  };
  
  const allSlots = [...sortedTimeSlots, ...breaks].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <table className="w-full min-w-[80rem] border-collapse" id="timetable-table-for-pdf">
        <thead>
          <tr className="bg-muted/50">
            <th className="p-2 border font-semibold text-sm w-36">HORAIRES</th>
            {activeDays.map((day, index) => (
              <th key={day.id} className="p-2 border font-semibold text-sm">
                {day.name.toUpperCase()}
                <span className="block font-normal text-xs text-muted-foreground">{format(addDays(weekStart, index), 'dd/MM')}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allSlots.map((slot) => {
             if ('name' in slot) { // It's a break
                return (
                    <tr key={`break-${slot.id}`}>
                        <td colSpan={activeDays.length + 1} className="p-1.5 text-center text-sm font-bold bg-muted/80 border">
                            {slot.name.toUpperCase()} ({slot.start} - {slot.end})
                        </td>
                    </tr>
                )
             }
             const timeLabel = `${slot.start} - ${slot.end}`;
             return (
                <tr key={slot.id} className="h-40">
                    <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">{timeLabel}</td>
                    {activeDays.map((day) => {
                        const event = getEventForSlot(day.name, timeLabel);
                        const colorConfig = event ? eventTypeColors[event.type] : null;
                        return (
                        <td key={`${day.id}-${slot.id}`} 
                            className={cn('p-0 border align-top transition-colors', event || onCellClick ? 'cursor-pointer group' : 'bg-muted/10')} 
                            onClick={() => onCellClick?.(day.name, timeLabel, event)}>
                            {event && colorConfig ? (
                            <div className={cn("relative h-full w-full p-2.5 border-l-4 flex flex-col", colorConfig.border, colorConfig.bg, onCellClick && 'hover:bg-opacity-20', onCellClick && `hover:${colorConfig.bg.replace('/10', '/20')}`)}>
                               {onCellClick && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 bg-white/20 hover:bg-white/40 disabled:bg-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed" 
                                        onClick={(e) => {e.stopPropagation(); onCellClick(day.name, timeLabel, event);}}
                                    >
                                        {event.attendanceTaken ? <CheckCheck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/20 hover:bg-white/40" onClick={(e) => {e.stopPropagation(); onCellClick(day.name, timeLabel, event);}}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                               )}
                                <p className={cn("font-bold text-sm", colorConfig.text)}>{event.course}</p>
                                <p className="text-xs font-semibold text-muted-foreground mt-0.5">{event.class}</p>
                                <p className="text-xs text-muted-foreground mt-1">{event.type.toUpperCase()}</p>
                                <div className="flex-grow" />
                                <p className="text-xs italic text-muted-foreground/80 mt-2">{event.location}</p>
                                {event.students && <p className="text-xs font-medium text-muted-foreground mt-1">{event.students} étudiants</p>}
                                {event.instructor && <p className="text-xs text-muted-foreground mt-1">{event.instructor}</p>}
                            </div>
                            ) : (
                                <div className={cn("h-full w-full", onCellClick && "hover:bg-muted/30")}>&nbsp;</div>
                            )}
                        </td>
                        );
                    })}
                </tr>
             )
          })}
        </tbody>
      </table>
    </div>
  );
}
