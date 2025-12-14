
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart3 /> Budgétisation</CardTitle>
          <CardDescription>
            Planifiez et suivez les budgets alloués aux différents départements et projets de l'université.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Cette page offrira des outils de planification budgétaire, de suivi des dépenses en temps réel par rapport aux prévisions, et de génération de rapports financiers consolidés pour le rectorat.</p>
        </CardContent>
      </Card>
    </div>
  );
}
