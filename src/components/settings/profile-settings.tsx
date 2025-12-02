'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentData } from '@/lib/static-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';

export default function ProfileSettingsTab() {
    const { toast } = useToast();
    const [avatar, setAvatar] = useState(studentData.avatar);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
                toast({
                    title: "Succès",
                    description: "Photo de profil mise à jour.",
                });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent, message: string) => {
        e.preventDefault();
        toast({
            title: "Succès",
            description: message,
        });
    }

    return (
        <div className="space-y-6">
            <SettingsCard
                title="Informations personnelles"
                footer={
                    <Button onClick={(e) => handleSubmit(e, "Informations personnelles enregistrées.")}>Enregistrer les modifications</Button>
                }
            >
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-28 h-28">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={avatar} />
                                <AvatarFallback>{getInitials(studentData.name)}</AvatarFallback>
                            </Avatar>
                            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90">
                                <Camera className="w-4 h-4" />
                                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="firstName">Prénom</Label><Input id="firstName" defaultValue={studentData.firstName} /></div>
                        <div><Label htmlFor="lastName">Nom</Label><Input id="lastName" defaultValue={studentData.lastName} /></div>
                        <div><Label htmlFor="birthDate">Date de naissance</Label><Input id="birthDate" type="date" defaultValue="2002-01-01" /></div>
                        <div><Label htmlFor="gender">Genre</Label>
                            <Select defaultValue="female">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female">Femme</SelectItem>
                                    <SelectItem value="male">Homme</SelectItem>
                                    <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="email">Email personnel</Label><Input id="email" type="email" defaultValue={studentData.email.replace('uni-verx.edu', 'example.com')} /></div>
                        <div><Label htmlFor="phone">Téléphone</Label><Input id="phone" type="tel" defaultValue="06 12 34 56 78" /></div>
                    </div>
                </form>
            </SettingsCard>

            <SettingsCard
                title="Informations académiques"
                footer={<Button onClick={(e) => handleSubmit(e, "Spécialisation mise à jour.")}>Enregistrer les modifications</Button>}
            >
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Université</Label><Input value="Université de Paris" disabled /></div>
                        <div><Label>Faculté / UFR</Label><Input value={studentData.ufr} disabled /></div>
                        <div><Label>Niveau</Label><Input value={studentData.level} disabled /></div>
                        <div><Label>Numéro étudiant</Label><Input value={studentData.id} disabled /></div>
                    </div>
                     <div><Label htmlFor="specialization">Spécialisation</Label>
                        <Select defaultValue="data-science">
                            <SelectTrigger id="specialization"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web-dev">Développement Web</SelectItem>
                                <SelectItem value="data-science">Science des Données</SelectItem>
                                <SelectItem value="networks">Réseaux et Sécurité</SelectItem>
                                <SelectItem value="ai">Intelligence Artificielle</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </form>
            </SettingsCard>
        </div>
    );
}
