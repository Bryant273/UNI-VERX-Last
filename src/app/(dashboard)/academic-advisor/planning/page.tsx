'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Calendar as CalendarIcon,
  Filter,
  Search,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TimetableEventType } from '@/lib/data';
import { allEvents } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';


const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const TIME_SLOTS = [
  '08:30 - 10:00',
  '10:30 - 12:00',
  '13:30 - 15:00',
  '15:30 - 17:00',
];

const eventTypeColors: Record<TimetableEventType, { border: string; bg: string; text: string }> = {
  cours: { border: 'border-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
  td: { border: 'border-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300' },
  tp: { border: 'border-green-500', bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
  examen: { border: 'border-red-500', bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
  devoir: { border: 'border-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
  activité: { border: 'border-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
};

const allEventsWithDay = [
    ...allEvents.student.map(e => ({...e, day: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi', 'Lundi'][(e.id-1)%5]})),
    ...allEvents.professor.map(e => ({...e, day: ['Mercredi', 'Samedi'][(e.id-1)%2]})),
].filter((v,i,a)=>a.findIndex(t=>(t.course === v.course && t.time === v.time))===i);


export default function GlobalTimetablePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekString = `Semaine du ${format(weekStart, 'dd MMMM yyyy', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`;
  
  const getEventForSlot = (day: string, time: string) => {
    return allEventsWithDay.find(event => event.day === day && event.time === time);
  };

  return (
    <div className="flex flex-col h-full gap-6 animate-fadeIn">
       <Card>
            <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Planning Global</CardTitle>
                        <CardDescription>Vue d'ensemble de l'occupation des salles et des cours pour toute l'université.</CardDescription>
                    </div>
                     <div className="flex flex-wrap items-center gap-3">
                        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                            <CalendarIcon className="mr-2 h-4 w-4" /> Aujourd'hui
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 7))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Créer un événement
                        </Button>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un cours, prof, salle..." className="pl-10" />
                    </div>
                    <Select><SelectTrigger className="w-full"><SelectValue placeholder="Filtrer par niveau"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les niveaux</SelectItem></SelectContent></Select>
                    <Select><SelectTrigger className="w-full"><SelectValue placeholder="Filtrer par filière"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les filières</SelectItem></SelectContent></Select>
                    <Select><SelectTrigger className="w-full"><SelectValue placeholder="Filtrer par bâtiment"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les bâtiments</SelectItem></SelectContent></Select>
                </div>
            </CardContent>
        </Card>
      
      <div className="overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-sm">
        <table className="w-full min-w-[80rem] border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 border font-semibold text-sm w-36">HORAIRES</th>
              {DAYS_OF_WEEK.map((day, index) => (
                <th key={day} className="p-2 border font-semibold text-sm">
                  {day.toUpperCase()}
                  <span className="block font-normal text-xs text-muted-foreground">
                    {format(addDays(weekStart, index), 'dd/MM')}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time, timeIndex) => (
              <React.Fragment key={time}>
                <tr className='h-32'>
                  <td className="p-2 border font-medium text-sm text-center bg-muted/30 w-36">
                    {time}
                  </td>
                  {DAYS_OF_WEEK.map((day) => {
                    const event = getEventForSlot(day, time);
                    const colorConfig = event ? eventTypeColors[event.type] : null;
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={cn('p-0 border align-top transition-colors', event ? 'cursor-pointer' : 'bg-muted/10')}
                      >
                        {event && colorConfig ? (
                          <div className={cn(
                            "h-full w-full p-2 border-l-4 flex flex-col", 
                            colorConfig.border, 
                            colorConfig.bg,
                            'hover:bg-opacity-20',
                            `hover:${colorConfig.bg.replace('/10', '/20')}`
                            )}>
                            <p className={cn("font-bold text-sm", colorConfig.text)}>
                              {event.course}
                            </p>
                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{event.type.toUpperCase()}</p>
                            <div className="flex-grow" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {event.instructor}
                            </p>
                            <p className="text-xs italic text-muted-foreground/80 mt-1 font-medium">
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
