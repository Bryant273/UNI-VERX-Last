
'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Plug,
  Upload,
  Sun,
  Moon,
  Monitor,
  BookUser,
  Database,
  Trash2,
  FileCog
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
import { getInitials } from '@/lib/messages-data';
import { studentData } from '@/lib/static-data'; // Using studentData as placeholder for prof
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from '@/components/ui/slider';

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Compte & Sécurité', icon: Shield },
  { id: 'pedagogy', label: 'Pédagogie', icon: BookUser },
  { id: 'data', label: 'Données', icon: Database },
  { id: 'privacy', label: 'Confidentialité', icon: Lock },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
];

const ProfileSection = () => {
    // Placeholder data for professor
    const professorData = {
        name: 'Dr. Claire Dubois',
        email: 'claire.dubois@uni-verx.edu',
        avatar: 'https://i.pravatar.cc/100?img=12',
        firstName: 'Claire',
        lastName: 'Dubois',
        speciality: 'Informatique',
        bio: "Docteur en Informatique, spécialisée en bases de données et systèmes d'information. Passionnée par l'enseignement et la recherche en informatique depuis 12 ans.",
        phone: '+33 1 23 45 67 89',
        office: 'B305',
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Gérez vos informations publiques et de contact.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={professorData.avatar} alt={professorData.name} />
                <AvatarFallback>{getInitials(professorData.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Changer la photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF ou PNG. Taille max. de 800K.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" defaultValue={professorData.firstName} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" defaultValue={professorData.lastName} />
              </div>
            </div>
             
             <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={professorData.email} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" defaultValue={professorData.phone} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="office">Bureau</Label>
                    <Input id="office" defaultValue={professorData.office} />
                </div>
            </div>
            
             <div className="space-y-1">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" placeholder="Parlez un peu de vous..." defaultValue={professorData.bio} />
            </div>
            <div className="flex justify-end">
              <Button>Enregistrer les modifications</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}


const SecuritySection = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                 <CardDescription>Il est recommandé d'utiliser un mot de passe long et unique.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-1">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="flex justify-end">
                    <Button>Mettre à jour le mot de passe</Button>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="2fa" className="font-semibold">Authentification à deux facteurs</Label>
                        <p className="text-xs text-muted-foreground">Renforce la sécurité de votre compte avec une vérification supplémentaire.</p>
                    </div>
                    <Switch id="2fa" />
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Zone de Danger</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Supprimer le compte</p>
                        <p className="text-sm text-muted-foreground">Toutes vos données seront définitivement effacées.</p>
                    </div>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
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
        </div>
    );
};

const NotificationsSection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Gérez comment et quand vous recevez des notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
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
            </div>

            <Separator />

            <div className="space-y-4">
                <h4 className="font-semibold">Types de notifications</h4>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm">Messages et collaborations</p>
                        <p className="text-xs text-muted-foreground">Nouveaux messages, travaux de groupe, etc.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm">Soumissions de devoirs</p>
                        <p className="text-xs text-muted-foreground">Lorsqu'un étudiant rend un devoir.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
            </div>
             <div className="flex justify-end pt-4">
                <Button>Enregistrer les modifications</Button>
            </div>
        </CardContent>
    </Card>
);

const AppearanceSection = () => {
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState('fr');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label className="font-semibold">Thème</Label>
                    <RadioGroup 
                        value={theme} 
                        onValueChange={setTheme}
                        className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="light" id="light" className="peer sr-only" />
                            <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <div className="w-full h-16 mb-3 bg-white rounded-md overflow-hidden shadow-sm border">
                                    <div className="w-full h-3 bg-gray-100"></div>
                                </div>
                                <Sun className="mb-2 h-5 w-5" />
                                Clair
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <div className="w-full h-16 mb-3 bg-gray-900 rounded-md overflow-hidden shadow-sm border border-gray-800">
                                    <div className="w-full h-3 bg-gray-800"></div>
                                </div>
                                <Moon className="mb-2 h-5 w-5" />
                                Sombre
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <div className="w-full h-16 mb-3 bg-gradient-to-r from-white to-gray-900 rounded-md overflow-hidden shadow-sm border border-gray-300 dark:border-gray-700">
                                   <div className="w-full h-3 bg-gray-100 dark:bg-gray-800"></div>
                                </div>
                                <Monitor className="mb-2 h-5 w-5" />
                                Système
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    <Button>Enregistrer les modifications</Button>
                </div>
            </CardContent>
        </Card>
    );
};


const PrivacySection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Confidentialité</CardTitle>
            <CardDescription>Contrôlez la visibilité de vos informations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <h4 className="font-semibold">Visibilité du profil</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="profile-visibility-students" className="font-semibold">Profil visible par les étudiants</Label>
                        <p className="text-xs text-muted-foreground">Permettre aux étudiants de voir votre profil (photo, nom, email).</p>
                    </div>
                    <Switch id="profile-visibility-students" defaultChecked />
                </div>
            </div>
             <div className="space-y-4">
                <h4 className="font-semibold">Partage des données</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-stats" className="font-semibold">Statistiques d'utilisation</Label>
                        <p className="text-xs text-muted-foreground">Partager des données anonymes pour améliorer le service.</p>
                    </div>
                    <Switch id="share-stats" defaultChecked />
                </div>
            </div>
             <div className="flex justify-between items-center pt-4">
                 <Button variant="outline">Télécharger mes données</Button>
                 <Button>Enregistrer les préférences</Button>
            </div>
        </CardContent>
    </Card>
);

const IntegrationsSection = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>Connectez UNI-VERX à vos applications préférées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="sync-google" className="font-semibold">Synchronisation avec Google Calendar</Label>
                        <p className="text-xs text-muted-foreground">Synchroniser votre emploi du temps avec Google Calendar.</p>
                    </div>
                    <Switch id="sync-google" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="sync-docs" className="font-semibold">Synchronisation des documents</Label>
                        <p className="text-xs text-muted-foreground">Synchroniser vos documents avec Google Drive ou OneDrive.</p>
                    </div>
                    <Switch id="sync-docs" defaultChecked />
                </div>
                <div className="flex justify-end pt-4">
                    <Button>Enregistrer les paramètres</Button>
                </div>
            </CardContent>
        </Card>
    );
};

const PedagogySection = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Préférences d'évaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="grading-system">Système de notation par défaut</Label>
                    <Select defaultValue="20">
                        <SelectTrigger id="grading-system"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="20">Sur 20</SelectItem>
                            <SelectItem value="100">Sur 100</SelectItem>
                            <SelectItem value="letter">Lettres (A, B, C...)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="rounding">Arrondir les notes finales au demi-point supérieur</Label>
                    <Switch id="rounding" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="anonymize">Anonymiser les soumissions par défaut</Label>
                    <Switch id="anonymize" />
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Gestion des cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label>Seuil d'alerte pour absence</Label>
                     <div className="flex items-center gap-4">
                         <Slider defaultValue={[20]} max={50} step={5} />
                         <span className="text-sm font-medium">20%</span>
                     </div>
                     <p className="text-xs text-muted-foreground mt-1">Recevoir une alerte si le taux d'absence d'un étudiant dépasse ce seuil.</p>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="auto-attendance">Activer l'appel automatique 5min après le début du cours</Label>
                    <Switch id="auto-attendance" />
                </div>
            </CardContent>
        </Card>
         <div className="flex justify-end">
            <Button>Enregistrer les préférences pédagogiques</Button>
        </div>
    </div>
);

const DataSection = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Sauvegarde des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup">Sauvegarde automatique quotidienne</Label>
                    <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Dernière sauvegarde : Aujourd'hui à 02:00</p>
                        <p className="text-xs text-muted-foreground">Taille : 15.8 MB</p>
                    </div>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                </div>
                 <Button className="w-full" variant="outline">Lancer une sauvegarde manuelle</Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Exportation des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="export-format">Format d'export par défaut</Label>
                    <Select defaultValue="pdf">
                        <SelectTrigger id="export-format"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button className="w-full">
                    <FileCog className="mr-2"/>
                    Télécharger une archive de toutes mes données
                </Button>
            </CardContent>
        </Card>
    </div>
);


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'security':
        return <SecuritySection />;
      case 'pedagogy':
        return <PedagogySection />;
      case 'data':
        return <DataSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'integrations':
        return <IntegrationsSection />;
      default:
        return (
             <Card>
                <CardHeader>
                    <CardTitle>{TABS.find(t => t.id === activeTab)?.label || 'Paramètres'}</CardTitle>
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
          <CardHeader>
            <CardTitle>Paramètres</CardTitle>
          </CardHeader>
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

