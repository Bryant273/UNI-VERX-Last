
'use client';

import { useState } from 'react';
import { Calendar, Building, Clock } from 'lucide-react';
import { allEvents } from '@/lib/static-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const eventTypeColors = {
  cours: 'bg-blue-500/10 text-blue-800 dark:text-blue-300',
  td: 'bg-orange-500/10 text-orange-800 dark:text-orange-300',
  tp: 'bg-green-500/10 text-green-800 dark:text-green-300',
  examen: 'bg-red-500/10 text-red-800 dark:text-red-300',
  activité: 'bg-purple-500/10 text-purple-800 dark:text-purple-300',
};

const allCurrentEvents = [
    ...allEvents.professor.slice(0, 2).map(e => ({...e, group: 'Professeurs'})),
    ...allEvents.student.slice(0, 3).map(e => ({...e, group: 'Étudiants'})),
];

export default function GlobalEventsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventsCount = allCurrentEvents.length;

  return (
    <>
      <Card 
        className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle>Évènements en cours</CardTitle>
             <Calendar className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{eventsCount}</p>
          <p className="text-orange-100 mt-1">classes/activités en direct</p>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Évènements en cours dans l'université</DialogTitle>
            <DialogDescription>
              Vue en temps réel des activités sur le campus.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Horaire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Cours / Activité</TableHead>
                  <TableHead>Intervenant</TableHead>
                  <TableHead>Salle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCurrentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {event.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={eventTypeColors[event.type] || ''}>
                        {event.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">{event.course}</p>
                      <p className="text-xs text-muted-foreground">{event.group}</p>
                    </TableCell>
                    <TableCell>{event.instructor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {event.location}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
