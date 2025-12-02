'use client';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { User, Shield, Bell, Palette, Lock, Plug, Camera, Sun, Moon, Monitor, Minus, Plus, Laptop, Smartphone, Tablet, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { userData } from '@/lib/static-data';
import { getInitials } from '@/lib/messages-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const user = userData.rectorate;

const SettingsCard = ({ title, description, children, footer, className }: { title: string; description?: string; children: React.ReactNode; className?: string; footer?: React.ReactNode; }) => (
    <Card className={className}>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <div className="p-6 pt-0 text-right">{footer}</div>}
    </Card>
);

const ProfileSettingsTab = () => {
    const { toast } = useToast();
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.name);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
                toast({ title: "Succès", description: "Photo de profil mise à jour." });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        toast({ title: "Succès", description: message });
    }

    return (
        <div className="space-y-6">
            <SettingsCard
                title="Informations personnelles"
                footer={<Button onClick={(e) => handleSubmit(e, "Informations personnelles enregistrées.")}>Enregistrer les modifications</Button>}
            >
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-28 h-28">
                            <Avatar className="w-full h-full"><AvatarImage src={avatar} /><AvatarFallback>{getInitials(name)}</AvatarFallback></Avatar>
                            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90">
                                <Camera className="w-4 h-4" />
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="name">Nom complet</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
                        <div><Label htmlFor="email">Email professionnel</Label><Input id="email" type="email" defaultValue={`${name.toLowerCase().replace(' ', '.')}@uni-verx.edu`} /></div>
                        <div><Label htmlFor="phone">Téléphone</Label><Input id="phone" type="tel" defaultValue="06 12 34 56 78" /></div>
                         <div><Label>Rôle</Label><Input value="Rectorat" disabled /></div>
                    </div>
                </form>
            </SettingsCard>
        </div>
    );
}

const AccountSettingsTab = () => {
    const { toast } = useToast();
    const [isAutoLogoutEnabled, setIsAutoLogoutEnabled] = useState(true);
    
    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        toast({ title: "Succès", description: message });
    }

    return (
        <div className="space-y-6">
            <SettingsCard title="Sécurité du compte">
                <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0">
                        <div>
                            <h4 className="font-medium">Authentification à deux facteurs</h4>
                            <p className="text-sm text-muted-foreground">Renforcez la sécurité de votre compte.</p>
                        </div>
                        <Switch id="twoFactorAuth" />
                    </div>
                    <div className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Déconnexion automatique</h4>
                                <p className="text-sm text-muted-foreground">Après une période d'inactivité.</p>
                            </div>
                            <Switch id="autoLogout" checked={isAutoLogoutEnabled} onCheckedChange={setIsAutoLogoutEnabled} />
                        </div>
                        {isAutoLogoutEnabled && (
                            <div className="ml-6 mt-4">
                                <Select defaultValue="60">
                                    <SelectTrigger className="w-full md:w-auto"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="30">Après 30 minutes</SelectItem><SelectItem value="60">Après 1 heure</SelectItem><SelectItem value="120">Après 2 heures</SelectItem></SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                     <div className="pt-6">
                        <h4 className="font-medium mb-4">Appareils connectés</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div className="flex items-center gap-3"><Laptop className="h-6 w-6 text-blue-500"/><p className="text-sm font-medium">MacBook Pro <span className="text-muted-foreground">(Paris, FR)</span></p></div><p className="text-xs text-primary">Cet appareil</p></div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div className="flex items-center gap-3"><Smartphone className="h-6 w-6 text-green-500"/><p className="text-sm font-medium">iPhone 13 <span className="text-muted-foreground">(Paris, FR)</span></p></div><Button variant="ghost" size="sm" className="text-destructive h-auto">Déconnecter</Button></div>
                        </div>
                         <Button variant="outline" className="w-full mt-4"><LogOut className="mr-2"/>Déconnecter tous les autres appareils</Button>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}

const NotificationsSettingsTab = () => (
    <SettingsCard title="Préférences de notifications">
        <div className="space-y-6 divide-y divide-border">
            <div className="flex items-center justify-between pt-6 first:pt-0">
                <div><h4 className="font-medium">Notifications par email</h4><p className="text-sm text-muted-foreground">Recevoir des notifications par email.</p></div>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between pt-6">
                <div><h4 className="font-medium">Notifications dans l'application</h4><p className="text-sm text-muted-foreground">Afficher les notifications dans l'application.</p></div>
                <Switch id="app-notifications" defaultChecked />
            </div>
        </div>
    </SettingsCard>
);

const AppearanceSettingsTab = () => {
    const { theme, setTheme } = useTheme();
    const [fontSize, setFontSize] = useState(100);
    const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
        setFontSize(prev => {
            const newSize = direction === 'increase' ? Math.min(150, prev + 10) : Math.max(80, prev - 10);
            if (document.documentElement) document.documentElement.style.fontSize = `${newSize}%`;
            return newSize;
        });
    }
    const ThemeOption = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
        <div className="relative">
            <input type="radio" name="theme" id={`theme-${id}`} value={id} className="hidden peer" checked={theme === id} onChange={() => setTheme(id)} />
            <label htmlFor={`theme-${id}`} className="block p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary">
                <div className="flex justify-center items-center h-20 bg-muted rounded-md mb-3">{icon}</div>
                <p className="text-sm font-medium text-center">{label}</p>
            </label>
        </div>
    );

    return (
        <div className="space-y-6">
            <SettingsCard title="Thème"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><ThemeOption id="light" label="Clair" icon={<Sun/>} /><ThemeOption id="dark" label="Sombre" icon={<Moon/>} /><ThemeOption id="system" label="Système" icon={<Monitor/>} /></div></SettingsCard>
            <SettingsCard title="Accessibilité">
                <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0"><div><h4 className="font-medium">Animations réduites</h4><p className="text-sm text-muted-foreground">Désactive les animations de l'interface.</p></div><Switch id="reduced-motion" /></div>
                    <div className="flex items-center justify-between pt-6"><div><h4 className="font-medium">Taille de la police</h4><p className="text-sm text-muted-foreground">Ajuste la taille du texte.</p></div><div className="flex items-center gap-3"><Button variant="outline" size="icon" onClick={() => handleFontSizeChange('decrease')}><Minus/></Button><span className="font-semibold tabular-nums w-12 text-center">{fontSize}%</span><Button variant="outline" size="icon" onClick={() => handleFontSizeChange('increase')}><Plus/></Button></div></div>
                </div>
            </SettingsCard>
        </div>
    );
}

const PrivacySettingsTab = () => {
    const { toast } = useToast();
    const [deleteInput, setDeleteInput] = useState('');
    const handleDownloadData = () => toast({ title: "Exportation en cours...", description: "Vos données sont en cours de préparation." });

    return (
        <div className="space-y-6">
            <SettingsCard title="Visibilité du profil">
                <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0"><div><h4 className="font-medium">Visible par les autres utilisateurs</h4><p className="text-sm text-muted-foreground">Permet aux autres de voir votre profil.</p></div><Switch id="profile-visible-students" defaultChecked /></div>
                </div>
            </SettingsCard>
            <SettingsCard title="Gestion des données">
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div><h4 className="font-medium">Exporter vos données</h4><p className="text-sm text-muted-foreground">Téléchargez une archive de vos données.</p></div>
                        <Button variant="outline" onClick={handleDownloadData}>Télécharger</Button>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5 cursor-pointer">
                                <div><h4 className="font-medium text-destructive">Supprimer votre compte</h4><p className="text-sm text-destructive/80">Cette action est définitive.</p></div>
                                <Button variant="destructive">Supprimer</Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Êtes-vous absolument sûr ?</DialogTitle><DialogDescription>Cette action est irréversible. Pour confirmer, tapez "SUPPRIMER".</DialogDescription></DialogHeader>
                            <div className="py-4"><Label htmlFor="delete-confirm">Confirmation</Label><Input id="delete-confirm" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder='SUPPRIMER'/></div>
                            <DialogFooter><DialogClose asChild><Button variant="ghost">Annuler</Button></DialogClose><Button variant="destructive" disabled={deleteInput !== 'SUPPRIMER'}>Je comprends, supprimer mon compte</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                 </div>
            </SettingsCard>
        </div>
    )
}

const IntegrationsSettingsTab = () => (
    <SettingsCard title="Applications connectées">
        <div className="space-y-6 divide-y divide-border">
            <div className="flex items-center justify-between pt-6 first:pt-0"><div><h4 className="font-medium">Synchroniser avec Google Calendar</h4><p className="text-sm text-muted-foreground">Ajoute votre emploi du temps à Google Calendar.</p></div><Switch id="sync-gcal" defaultChecked /></div>
            <div className="flex items-center justify-between pt-6"><div><h4 className="font-medium">Synchroniser avec Microsoft Outlook</h4><p className="text-sm text-muted-foreground">Ajoute votre emploi du temps à Outlook Calendar.</p></div><Switch id="sync-outlook" /></div>
        </div>
    </SettingsCard>
);

const settingsTabs = [
    { value: 'profile', label: 'Profil', icon: User, component: <ProfileSettingsTab/> },
    { value: 'account', label: 'Compte', icon: Shield, component: <AccountSettingsTab/> },
    { value: 'notifications', label: 'Notifications', icon: Bell, component: <NotificationsSettingsTab/> },
    { value: 'appearance', label: 'Apparence', icon: Palette, component: <AppearanceSettingsTab/> },
    { value: 'privacy', label: 'Confidentialité', icon: Lock, component: <PrivacySettingsTab/> },
    { value: 'integrations', label: 'Intégrations', icon: Plug, component: <IntegrationsSettingsTab/> },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Paramètres</CardTitle>
          <CardDescription>Gérez les paramètres de votre profil, compte et préférences.</CardDescription>
        </CardHeader>
      </Card>
      
       <Tabs defaultValue="profile" className="w-full lg:grid lg:grid-cols-4 lg:gap-6" orientation="vertical">
        <TabsList className="flex-col h-auto items-start justify-start p-1 gap-1 bg-transparent rounded-lg border w-full">
            {settingsTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="w-full justify-start text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold px-3 py-2">
                    <tab.icon className="mr-3 h-5 w-5"/>
                    {tab.label}
                </TabsTrigger>
            ))}
        </TabsList>

        <div className="lg:col-span-3 mt-6 lg:mt-0">
             {settingsTabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                    {tab.component}
                </TabsContent>
            ))}
        </div>
      </Tabs>
    </div>
  );
}
