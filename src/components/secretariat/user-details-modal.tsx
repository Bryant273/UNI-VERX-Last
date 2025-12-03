
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, MapPin, KeyRound, User, ShieldCheck, History, UserCog } from 'lucide-react';
import { getInitials } from '@/lib/messages-data';
import { UniversityUser, roleConfig, statusConfig } from '@/lib/users-data';
import { cn } from '@/lib/utils';

interface UserDetailsModalProps {
  user: UniversityUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-muted-foreground mt-1" />
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    </div>
);

const ProfileTab: React.FC<{ user: UniversityUser }> = ({ user }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <DetailItem icon={Mail} label="Email" value={user.email} />
        <DetailItem icon={Phone} label="Téléphone" value={user.phone} />
        <div className="md:col-span-2">
            <DetailItem icon={MapPin} label="Adresse" value={user.address} />
        </div>
    </div>
);

const ActivityTab: React.FC<{ user: UniversityUser }> = ({ user }) => (
    <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
        <TableBody>
            {user.activity.map((act, index) => (
                <TableRow key={index}><TableCell>{act.date}</TableCell><TableCell>{act.action}</TableCell></TableRow>
            ))}
        </TableBody>
    </Table>
);

const SecurityTab: React.FC<{ user: UniversityUser }> = ({ user }) => (
    <div className="space-y-4 py-4">
        <DetailItem icon={ShieldCheck} label="Statut du compte" value={statusConfig[user.status].label} />
        <DetailItem icon={History} label="Dernière connexion" value={user.lastLogin} />
        <DetailItem icon={User} label="Date de création" value={user.creationDate} />
        <Button variant="outline"><KeyRound className="mr-2 h-4 w-4"/> Réinitialiser le mot de passe</Button>
    </div>
);

const PermissionsTab: React.FC<{ user: UniversityUser }> = ({ user }) => (
    <div className="py-4">
        <p className="text-sm">Permissions pour le rôle: <span className="font-semibold">{roleConfig[user.role].label}</span></p>
        <p className="text-xs text-muted-foreground mt-2">Ici s'afficheraient les permissions détaillées.</p>
    </div>
);


export default function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const status = statusConfig[user.status];
  const role = roleConfig[user.role];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{user.name}</DialogTitle>
              <DialogDescription asChild>
                 <div className="flex items-center gap-4 mt-1">
                    <span>{role.label}</span>
                  </div>
              </DialogDescription>
                <Badge variant="outline" className={cn("border-0 mt-1", status.color.replace('text-', 'bg-'))}>
                  <status.icon className="mr-1.5 h-3 w-3"/>
                  {status.label}
                </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profil</TabsTrigger>
            <TabsTrigger value="activity"><History className="mr-2 h-4 w-4"/>Activité</TabsTrigger>
            <TabsTrigger value="security"><ShieldCheck className="mr-2 h-4 w-4"/>Sécurité</TabsTrigger>
            <TabsTrigger value="permissions"><UserCog className="mr-2 h-4 w-4"/>Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="profile"><ProfileTab user={user} /></TabsContent>
          <TabsContent value="activity"><ActivityTab user={user} /></TabsContent>
          <TabsContent value="security"><SecurityTab user={user} /></TabsContent>
          <TabsContent value="permissions"><PermissionsTab user={user} /></TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
