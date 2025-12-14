
'use client';

import Link from 'next/link';
import { BarChart3, Building, FileText, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RectorateQuickActions() {
    const actions = [
        { href: '/rectorate/budgets', label: 'Suivi Budgétaire', icon: BarChart3 },
        { href: '/rectorate/departments', label: 'Gestion des Départements', icon: Building },
        { href: '/rectorate/contracts', label: 'Consulter les Contrats', icon: FileText },
        { href: '/rectorate/stats', label: 'Voir les Statistiques', icon: PieChart },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Accès Stratégiques</CardTitle>
                <CardDescription>Outils de pilotage de l'université.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Button key={action.href} variant="outline" className="h-24 flex-col gap-2 p-2" asChild>
                           <Link href={action.href}>
                             <Icon className="h-6 w-6 text-primary" />
                             <span className="text-center text-xs font-semibold">{action.label}</span>
                           </Link>
                        </Button>
                    )
                })}
            </CardContent>
        </Card>
    );
}
