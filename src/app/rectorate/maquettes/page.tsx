
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Columns } from 'lucide-react';

export default function MaquettesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Columns /> Gestion des Maquettes</CardTitle>
          <CardDescription>
            Visualisez et validez les maquettes de programme pour toutes les filières et tous les niveaux.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Cette page permettra de visualiser, modifier et approuver les maquettes pédagogiques complètes, en assurant la cohérence des crédits ECTS, des prérequis et des parcours de formation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
