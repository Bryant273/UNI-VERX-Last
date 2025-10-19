'use client';

import Link from 'next/link';
import { Edit, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourseModal } from '@/hooks/use-course-modal';

export default function QuickActionsCard() {
    const { onOpen } = useCourseModal();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accédez rapidement à vos tâches principales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button className="w-full justify-start" size="lg" asChild>
                    <Link href="/professor/evaluations">
                        <Edit className="mr-3" />
                        Corriger les copies (23 en attente)
                    </Link>
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline" onClick={() => onOpen()}>
                    <Upload className="mr-3" />
                    Publier un nouveau cours
                </Button>
            </CardContent>
        </Card>
    );
}
