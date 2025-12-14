
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hourglass } from 'lucide-react';

export default function HoursPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Hourglass /> Suivi des Heures d'Enseignement</CardTitle>
          <CardDescription>
            Supervisez le volume horaire des enseignants, validez les heures supplémentaires et assurez l'équité de la charge de travail.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Cette interface offrira une vue d'ensemble des services d'enseignement, permettant de suivre les heures planifiées versus les heures réalisées, de gérer les demandes d'heures complémentaires et de générer des rapports pour la direction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
