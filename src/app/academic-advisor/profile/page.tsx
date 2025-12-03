'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, Building } from 'lucide-react';
import { userData } from '@/lib/static-data';
import { getInitials } from '@/lib/messages-data';

const user = userData['academic-advisor'];

export default function AcademicAdvisorProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24 border-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">Responsable Pédagogique</p>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" /> Modifier le profil
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground"/><span>{user.name.toLowerCase().replace(' ', '.').replace('m. ', '')}@uni-verx.edu</span></div>
             <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground"/><span>+33 1 23 45 67 89</span></div>
             <div className="flex items-center gap-3"><Building className="h-4 w-4 text-muted-foreground"/><span>Bureau D-101</span></div>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Profil Responsable Pédagogique</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Les statistiques clés, les rapports de performance et les outils de gestion spécifiques à ce rôle seront affichés ici.</p>
        </CardContent>
      </Card>
    </div>
  );
}
