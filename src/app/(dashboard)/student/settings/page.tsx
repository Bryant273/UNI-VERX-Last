'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Plug,
  ChevronRight,
  Upload,
  Mail,
  Smartphone,
  Globe,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials, allUsers } from '@/lib/messages-data';
import { studentData } from '@/lib/static-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Compte & Sécurité', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'privacy', label: 'Confidentialité', icon: Lock },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
];

const ProfileSection = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil Public</CardTitle>
                <CardDescription>Ces informations seront visibles par les autres utilisateurs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={studentData.avatar} alt={studentData.name} />
                        <AvatarFallback>{getInitials(studentData.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button><Upload className="mr-2 h-4 w-4" /> Changer la photo</Button>
                        <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" defaultValue={studentData.firstName} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" defaultValue={studentData.lastName} />
                    </div>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Parlez un peu de vous..." defaultValue="Étudiant passionné par les nouvelles technologies et le développement web. Actuellement en Master 1 Ingénierie Logicielle." />
                </div>
                 <div className="flex justify-end">
                    <Button>Enregistrer les modifications</Button>
                </div>
            </CardContent>
        </Card>
    )
}

const SecuritySection = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Connexion & Sécurité</CardTitle>
                <CardDescription>Gérez vos informations de connexion et la sécurité de votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={studentData.email} disabled />
                    </div>
                </div>
                 <div>
                    <Label>Mot de passe</Label>
                    <div className="mt-1 flex flex-col sm:flex-row gap-2 items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <p className="text-sm">••••••••••••</p>
                        <Button variant="outline">Changer le mot de passe</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Sessions Actives</CardTitle>
                <CardDescription>Voici la liste des appareils connectés à votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">iPhone 14 Pro</p>
                            <p className="text-sm text-muted-foreground">Paris, FR · Actif maintenant</p>
                        </div>
                    </div>
                     <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Actif</Badge>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Chrome sur Windows</p>
                            <p className="text-sm text-muted-foreground">Lyon, FR · Il y a 2 heures</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">Déconnecter</Button>
                </div>
            </CardContent>
        </Card>
        
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Zone de Danger</CardTitle>
                <CardDescription>Actions irréversibles. Soyez prudent.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Supprimer le compte</p>
                        <p className="text-sm text-muted-foreground">Toutes vos données seront définitivement effacées.</p>
                    </div>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Supprimer
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Toutes les données associées à votre compte seront perdues. Pour confirmer, tapez "SUPPRIMER" dans le champ ci-dessous.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="deleteConfirm">Confirmation</Label>
                    <Input id="deleteConfirm" placeholder='SUPPRIMER'/>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                    <Button variant="destructive" disabled>Supprimer définitivement</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
};


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      // ... autres sections ...
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{TABS.find(t => t.id === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Section en cours de construction.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="grid md:grid-cols-12 gap-8">
      <div className="md:col-span-3">
        <Card>
          <CardContent className="p-2">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-9 space-y-6">
        {renderContent()}
      </div>
    </div>
  );
}
