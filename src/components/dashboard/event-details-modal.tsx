
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TimetableEvent, TimetableEventType, PresenceStatus } from '@/lib/data';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, PartyPopper, UserCheck, CheckCheck } from 'lucide-react';
import { Separator } from '../ui/separator';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimetableEvent | null;
}

const eventTypeConfig: Record<TimetableEventType, { color: string; label: string }> = {
  cours: { color: 'bg-blue-500', label: 'Cours' },
  devoir: { color: 'bg-orange-500', label: 'Devoir' },
  examen: { color: 'bg-red-600', label: 'Examen' },
  activité: { color: 'bg-purple-500', label: 'Activité' },
  td: { color: 'bg-orange-500', label: 'Travaux Dirigés' },
  tp: { color: 'bg-orange-500', label: 'Travaux Pratiques' },
};

const presenceStatusConfig: Record<PresenceStatus, { text: string; icon: React.ElementType; color: string }> = {
  validated: { text: "Présence validée par l'enseignant", icon: CheckCircle, color: 'text-green-500' },
  pending: { text: 'Présence pas encore validée par le prof', icon: Clock, color: 'text-yellow-500' },
  absent: { text: 'Absent à l\'évènement', icon: XCircle, color: 'text-red-500' },
  na: { text: 'Non applicable', icon: AlertCircle, color: 'text-gray-500' },
};

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-right">{value}</p>
    </div>
  );
};


export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const router = useRouter();

  const handleGoToTimetable = () => {
    onClose();
    // Assuming professor's timetable is at /professor/timetable
    router.push('/professor/timetable');
  };

  const handleAttendance = () => {
      // Logic to open attendance modal would go here
      // For now, we can just close this one.
      onClose();
      // Potentially, we could use a global state or callback to open the attendance modal from here.
      // For simplicity, we'll assume navigation is the primary action for now.
      router.push('/professor/timetable');
  }

  const renderPresenceStatus = (status: PresenceStatus, isPast?: boolean) => {
      const config = presenceStatusConfig[status];

      if (status === 'na') {
          return null;
      }
      
      if(isPast && status === 'pending') {
          const absentConfig = presenceStatusConfig['absent'];
          return (
             <div className="flex items-center gap-2 mt-4 p-3 bg-red-500/10 rounded-lg">
                <absentConfig.icon className={`h-5 w-5 ${absentConfig.color}`} />
                <p className={`text-sm font-medium ${absentConfig.color}`}>{absentConfig.text}</p>
            </div>
          )
      }

      return (
        <div className={`flex items-center gap-2 mt-4 p-3 bg-${config.color.split('-')[1]}-500/10 rounded-lg`}>
          <config.icon className={`h-5 w-5 ${config.color}`} />
          <p className={`text-sm font-medium ${config.color}`}>{config.text}</p>
        </div>
      );
  }

  const isProfessorView = router.pathname?.includes('/professor/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader>
          {event ? (
            <DialogTitle asChild>
              <div className={`w-full p-4 text-white text-center rounded-t-lg ${eventTypeConfig[event.type].color}`}>
                <h2 className="text-xl font-bold">{eventTypeConfig[event.type].label.toUpperCase()} EN COURS</h2>
              </div>
            </DialogTitle>
          ) : (
             <DialogTitle asChild>
               <div className="w-full p-4 text-white text-center rounded-t-lg bg-gray-400">
                  <h2 className="text-xl font-bold">ÉVÈNEMENT</h2>
               </div>
             </DialogTitle>
          )}
        </DialogHeader>

        <div className="p-6">
          {event ? (
            <>
              <DetailRow label="Matière :" value={event.course} />
              <DetailRow label="Salle :" value={event.location} />
              <DetailRow label="Enseignant :" value={event.instructor} />
              <DetailRow label="Horaire :" value={event.time} />
              
              {event.fileLink && (
                  <div className="flex justify-between items-center py-2">
                    <p className="text-sm text-muted-foreground">Fichier lié :</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={event.fileLink} target="_blank" rel="noopener noreferrer">Télécharger le fichier</a>
                    </Button>
                  </div>
              )}

              {event.profComment && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Commentaire du prof :</p>
                  <p className="text-sm italic bg-muted/50 p-3 rounded-lg">{event.profComment}</p>
                </div>
              )}

              {!isProfessorView && renderPresenceStatus(event.presenceStatus || 'na', event.isPast)}
            </>
          ) : (
            <div className="text-center py-8">
                <PartyPopper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucun évènement en cours</h3>
                <p className="text-sm text-muted-foreground mt-2">Reposez-vous ou préparez vos prochains cours !</p>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className='p-4 pt-2 flex-col sm:flex-row gap-2'>
            {isProfessorView && event && (
                <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={handleAttendance}
                    disabled={event.attendanceTaken || event.isPast}
                >
                    {event.attendanceTaken ? <CheckCheck className="mr-2" /> : <UserCheck className="mr-2" />}
                    {event.attendanceTaken ? "Appel déjà fait" : "Faire l'appel"}
                </Button>
            )}
            <Button 
                className="w-full bg-primary hover:bg-secondary text-white" 
                onClick={handleGoToTimetable}>
                Voir l'emploi du temps
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
