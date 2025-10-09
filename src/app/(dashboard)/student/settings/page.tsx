
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
  ChevronRight,
  Upload,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Briefcase,
  BookUser,
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
import { studentData } from '@/lib/static-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


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
                <AvatarImage src={studentData.avatar} alt={studentData.name} />
                <AvatarFallback>{getInitials(studentData.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Changer la photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  Cliquez sur l'icône pour changer votre photo
                </p>
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input id="birthDate" type="text" defaultValue={studentData.birthDate} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gender">Genre</Label>
                <Select defaultValue={studentData.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculin">Homme</SelectItem>
                    <SelectItem value="Féminin">Femme</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="personalEmail">Email personnel</Label>
                    <Input id="personalEmail" type="email" defaultValue={studentData.email} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" defaultValue="06 12 34 56 78" />
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" defaultValue="123 Rue de l'Université" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue="Paris" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" defaultValue="75005" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="country">Pays</Label>
                    <Select defaultValue="France">
                         <SelectTrigger>
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Belgium">Belgique</SelectItem>
                            <SelectItem value="Switzerland">Suisse</SelectItem>
                        </SelectContent>
                    </Select>
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

        <Card>
            <CardHeader>
                <CardTitle>Informations académiques</CardTitle>
                <CardDescription>Ces informations sont gérées par l'administration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label htmlFor="university">Université</Label>
                        <Input id="university" defaultValue="Université de Paris" disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="faculty">Faculté / UFR</Label>
                        <Input id="faculty" defaultValue={studentData.ufr} disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="degree">Diplôme</Label>
                        <Input id="degree" defaultValue="Master" disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="level">Niveau / Année</Label>
                        <Input id="level" defaultValue={studentData.level} disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="studentId">Numéro étudiant</Label>
                        <Input id="studentId" defaultValue={studentData.id} disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="academicYear">Année académique</Label>
                        <Input id="academicYear" defaultValue={studentData.academicYear} disabled />
                         <p className="text-xs text-muted-foreground">Ce champ ne peut pas être modifié</p>
                    </div>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="specialization">Spécialisation</Label>
                     <Select defaultValue={studentData.speciality}>
                        <SelectTrigger id="specialization">
                            <SelectValue placeholder="Choisir une spécialisation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Ingénierie Logicielle">Ingénierie Logicielle</SelectItem>
                            <SelectItem value="Science des Données">Science des Données</SelectItem>
                            <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                            <SelectItem value="Réseaux et Systèmes">Réseaux et Systèmes</SelectItem>
                            <SelectItem value="Intelligence Artificielle">Intelligence Artificielle</SelectItem>
                        </SelectContent>
                    </Select>
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
                <CardTitle>Informations de connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-1">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input id="username" defaultValue="sarah.dupont" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="email">Email institutionnel</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email" type="email" defaultValue={studentData.email} disabled />
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Vérifié</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Cet email est géré par votre institution et ne peut pas être modifié</p>
                </div>
                <div className="flex justify-end">
                    <Button>Enregistrer les modifications</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-1">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" placeholder="••••••••" />
                    <p className="text-xs text-muted-foreground">Veuillez saisir un mot de passe</p>
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
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="auto-logout" className="font-semibold">Déconnexion automatique</Label>
                        <p className="text-xs text-muted-foreground">Déconnexion automatique après une période d'inactivité.</p>
                    </div>
                    <Switch id="auto-logout" defaultChecked />
                </div>
                 <div className="ml-6">
                    <Select defaultValue="60">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Durée d'inactivité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">Après 30 minutes</SelectItem>
                            <SelectItem value="60">Après 1 heure</SelectItem>
                            <SelectItem value="120">Après 2 heures</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Appareils connectés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Chrome sur MacBook Pro</p>
                            <p className="text-sm text-muted-foreground">Paris, FR • Actif maintenant</p>
                        </div>
                    </div>
                     <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Cet appareil</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">iPhone 13</p>
                            <p className="text-sm text-muted-foreground">Paris, FR · Dernière connexion: Hier</p>
                        </div>
                    </div>
                     <Button variant="ghost" size="sm">Déconnecter</Button>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">iPad</p>
                            <p className="text-sm text-muted-foreground">Paris, FR • 18/03/2025</p>
                        </div>
                    </div>
                     <Button variant="ghost" size="sm">Déconnecter</Button>
                </div>
                <div className="pt-4 flex justify-center">
                    <Button variant="outline">Déconnecter tous les autres appareils</Button>
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
                        <p className="text-sm">Cours et enseignements</p>
                        <p className="text-xs text-muted-foreground">Nouveaux cours, modifications d'horaires, etc.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm">Évaluations et examens</p>
                         <p className="text-xs text-muted-foreground">Nouvelles évaluations, résultats, etc.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm">Messages et collaborations</p>
                        <p className="text-xs text-muted-foreground">Nouveaux messages, travaux de groupe, etc.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm">Stages et emplois</p>
                        <p className="text-xs text-muted-foreground">Nouvelles offres, candidatures, etc.</p>
                    </div>
                    <Switch />
                </div>
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm">Administration et documents</p>
                        <p className="text-xs text-muted-foreground">Documents administratifs, informations générales, etc.</p>
                    </div>
                    <Switch />
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                 <Label htmlFor="emailFrequency">Fréquence des notifications</Label>
                 <Select defaultValue="daily">
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Emails récapitulatifs" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="instant">Instantané</SelectItem>
                        <SelectItem value="daily">Quotidien (résumé une fois par jour)</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                </Select>
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
                            <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <div className="w-full h-16 mb-3 bg-white rounded-md overflow-hidden shadow-sm border">
                                    <div className="w-full h-3 bg-gray-100"></div>
                                </div>
                                <Sun className="mb-2 h-5 w-5" />
                                Clair
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                            <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <div className="w-full h-16 mb-3 bg-gray-900 rounded-md overflow-hidden shadow-sm border border-gray-800">
                                    <div className="w-full h-3 bg-gray-800"></div>
                                </div>
                                <Moon className="mb-2 h-5 w-5" />
                                Sombre
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="system" id="system" className="peer sr-only" />
                            <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
};


const PrivacySection = () => (
    <Card>
        <CardHeader>
            <CardTitle>Confidentialité</CardTitle>
            <CardDescription>Contrôlez quelles informations sont visibles par les autres.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="space-y-4">
                <h4 className="font-semibold">Visibilité du profil</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="profile-visibility-students" className="font-semibold">Profil visible par les autres étudiants</Label>
                        <p className="text-xs text-muted-foreground">Permettre aux autres étudiants de voir votre profil.</p>
                    </div>
                    <Switch id="profile-visibility-students" defaultChecked />
                </div>
                 <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="profile-visibility-companies" className="font-semibold">Profil visible par les entreprises</Label>
                        <p className="text-xs text-muted-foreground">Permettre aux entreprises partenaires de voir votre profil.</p>
                    </div>
                    <Switch id="profile-visibility-companies" defaultChecked />
                </div>
            </div>

            <Separator />
            
             <div className="space-y-4">
                <h4 className="font-semibold">Informations partagées</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-email" className="font-semibold">Email de contact</Label>
                        <p className="text-xs text-muted-foreground">Partager votre email avec les autres utilisateurs.</p>
                    </div>
                    <Switch id="share-email" defaultChecked />
                </div>
                 <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-phone" className="font-semibold">Numéro de téléphone</Label>
                        <p className="text-xs text-muted-foreground">Partager votre numéro de téléphone.</p>
                    </div>
                    <Switch id="share-phone" />
                </div>
                 <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-results" className="font-semibold">Résultats académiques</Label>
                        <p className="text-xs text-muted-foreground">Partager vos résultats avec les entreprises.</p>
                    </div>
                    <Switch id="share-results" defaultChecked />
                </div>
            </div>

             <Separator />

             <div className="space-y-4">
                <h4 className="font-semibold">Partage des données</h4>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-stats" className="font-semibold">Statistiques d'utilisation</Label>
                        <p className="text-xs text-muted-foreground">Partager des données anonymes pour améliorer le service.</p>
                    </div>
                    <Switch id="share-stats" defaultChecked />
                </div>
                <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="share-cookies" className="font-semibold">Cookies et traceurs</Label>
                        <p className="text-xs text-muted-foreground">Accepter les cookies non essentiels.</p>
                    </div>
                    <Switch id="share-cookies" />
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
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const openModal = (title: string) => {
        setModalTitle(title);
        setIsConfigureModalOpen(true);
    };

    const integrations = [
        { name: 'Google', description: 'Google Calendar, Drive', icon: Mail, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', connected: true },
        { name: 'Microsoft', description: 'Office 365, OneDrive', icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', connected: true },
        { name: 'GitHub', description: 'Projets code, collaborations', icon: BookUser, color: 'text-gray-800 dark:text-gray-200', bgColor: 'bg-gray-200 dark:bg-gray-700', connected: true },
        { name: 'LinkedIn', description: 'Profil professionnel', icon: Briefcase, color: 'text-sky-600', bgColor: 'bg-sky-100 dark:bg-sky-900/30', connected: false }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>Connectez UNI-VERX à vos applications préférées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-4">Applications connectées</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {integrations.map((app) => (
                            <Card key={app.name}>
                                <CardContent className="p-4 flex flex-col justify-between h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-lg ${app.bgColor}`}>
                                                <app.icon className={`h-5 w-5 ${app.color}`}/>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{app.name}</p>
                                                <p className="text-xs text-muted-foreground">{app.description}</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked={app.connected}/>
                                    </div>
                                    <Button variant="ghost" size="sm" className="w-full" onClick={() => openModal(app.name)}>
                                        {app.connected ? 'Configurer' : 'Connecter'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-4">Synchronisation</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor="sync-google" className="font-semibold">Synchronisation avec Google Calendar</Label>
                                <p className="text-xs text-muted-foreground">Synchroniser votre emploi du temps avec Google Calendar.</p>
                            </div>
                            <Switch id="sync-google" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor="sync-outlook" className="font-semibold">Synchronisation avec Microsoft Outlook</Label>
                                <p className="text-xs text-muted-foreground">Synchroniser votre emploi du temps avec Outlook.</p>
                            </div>
                            <Switch id="sync-outlook" />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <Label htmlFor="sync-docs" className="font-semibold">Synchronisation des documents</Label>
                                <p className="text-xs text-muted-foreground">Synchroniser vos documents avec Google Drive ou OneDrive.</p>
                            </div>
                            <Switch id="sync-docs" defaultChecked />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button>Enregistrer les paramètres</Button>
                </div>
            </CardContent>

             <Dialog open={isConfigureModalOpen} onOpenChange={setIsConfigureModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurer l'intégration : {modalTitle}</DialogTitle>
                        <DialogDescription>
                            Gérez les autorisations et les paramètres pour {modalTitle}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Les options de configuration pour l'intégration {modalTitle} apparaîtraient ici.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsConfigureModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setIsConfigureModalOpen(false)}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
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
