'use client';

import Link from 'next/link';
import { UserPlus, CheckCheck, Ticket, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SecretariatQuickActions() {
    const actions = [
        { href: '/secretariat/enrollments', label: 'Gérer les inscriptions', icon: UserPlus },
        { href: '/secretariat/validations', label: 'Traiter les validations', icon: CheckCheck },
        { href: '/secretariat/tickets', label: 'Consulter les tickets', icon: Ticket },
        { href: '/secretariat/users', label: 'Gérer les utilisateurs', icon: Users },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accédez rapidement à vos tâches principales.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Button key={action.href} variant="outline" className="h-24 flex-col gap-2" asChild>
                           <Link href={action.href}>
                             <Icon className="h-6 w-6 text-primary" />
                             <span className="text-center text-xs">{action.label}</span>
                           </Link>
                        </Button>
                    )
                })}
            </CardContent>
        </Card>
    );
}
