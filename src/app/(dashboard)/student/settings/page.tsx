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

const NotificationsSection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Gérez comment et quand vous recevez des notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="email-notifs" className="font-semibold">Notifications par Email</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des résumés et des alertes importantes sur votre email.</p>
                </div>
                <Switch id="email-notifs" defaultChecked />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="push-notifs" className="font-semibold">Notifications Push</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des notifications en temps réel sur vos appareils.</p>
                </div>
                <Switch id="push-notifs" defaultChecked />
            </div>
            <Separator />
            <div className="space-y-4">
                <h4 className="font-semibold">Notifications Détaillées</h4>
                <div className="flex items-center justify-between">
                    <p className="text-sm">Annonces des cours</p>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                    <p className="text-sm">Rappels de devoirs</p>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                    <p className="text-sm">Nouveaux messages</p>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                    <p className="text-sm">Activité de groupe</p>
                    <Switch />
                </div>
            </div>
             <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
            </div>
        </CardContent>
    </Card>
);

const AppearanceSection = () => (
     <Card>
        <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             <div>
                <Label className="font-semibold">Thème</Label>
                <RadioGroup defaultValue="system" className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Sun className="mb-3 h-6 w-6" />
                            Clair
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Moon className="mb-3 h-6 w-6" />
                            Sombre
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Monitor className="mb-3 h-6 w-6" />
                            Système
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
            </div>
        </CardContent>
    </Card>
);

const PrivacySection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Confidentialité</CardTitle>
            <CardDescription>Contrôlez quelles informations sont visibles par les autres.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="profile-visibility" className="font-semibold">Visibilité de votre profil</Label>
                        <p className="text-xs text-muted-foreground">Permettre aux autres étudiants et professeurs de voir votre profil.</p>
                    </div>
                    <Switch id="profile-visibility" defaultChecked />
                </div>
                 <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="show-online" className="font-semibold">Statut en ligne</Label>
                        <p className="text-xs text-muted-foreground">Afficher quand vous êtes actif sur la plateforme.</p>
                    </div>
                    <Switch id="show-online" defaultChecked />
                </div>
                 <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-data" className="font-semibold">Partage de données anonymes</Label>
                        <p className="text-xs text-muted-foreground">Aidez-nous à améliorer la plateforme en partageant des données d'utilisation anonymes.</p>
                    </div>
                    <Switch id="share-data" />
                </div>
            </div>
             <div className="flex justify-between items-center">
                 <Button variant="outline">Télécharger mes données</Button>
                 <Button>Enregistrer les modifications</Button>
            </div>
        </CardContent>
    </Card>
);

const IntegrationsSection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Intégrations</CardTitle>
            <CardDescription>Connectez UNI-VERX à vos applications préférées.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                           <Mail className="h-6 w-6 text-red-600"/>
                        </div>
                        <div>
                            <p className="font-semibold">Google Calendar</p>
                            <p className="text-sm text-muted-foreground">Synchronisez votre emploi du temps.</p>
                        </div>
                    </div>
                    <Switch defaultChecked/>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                           <Briefcase className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <p className="font-semibold">Slack</p>
                            <p className="text-sm text-muted-foreground">Recevez des notifications dans Slack.</p>
                        </div>
                    </div>
                    <Switch />
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                           <User className="h-6 w-6 text-gray-800 dark:text-gray-200"/>
                        </div>
                        <div>
                            <p className="font-semibold">GitHub</p>
                            <p className="text-sm text-muted-foreground">Liez vos dépôts à vos projets.</p>
                        </div>
                    </div>
                    <Switch defaultChecked/>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
);


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'integrations':
        return <IntegrationsSection />;
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
    <div className="grid md:grid-cols-[250px_1fr] gap-8">
      <div>
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
      <div className="space-y-6">
        {renderContent()}
      </div>
    </div>
  );
}
