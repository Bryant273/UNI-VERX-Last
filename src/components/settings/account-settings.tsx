'use client';
import { useState } from 'react';
import SettingsCard from './SettingsCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentData } from '@/lib/static-data';
import { Badge } from '@/components/ui/badge';
import { Laptop, Smartphone, Tablet, LogOut } from 'lucide-react';


export default function AccountSettingsTab() {
    const { toast } = useToast();
    const [passwordStrength, setPasswordStrength] = useState({ width: '0%', color: '', text: 'Veuillez saisir un mot de passe' });
    const [isAutoLogoutEnabled, setIsAutoLogoutEnabled] = useState(true);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length === 0) {
            setPasswordStrength({ width: '0%', color: '', text: 'Veuillez saisir un mot de passe' });
        } else if (value.length < 6) {
            setPasswordStrength({ width: '25%', color: 'bg-red-500', text: 'Faible: Trop court' });
        } else if (value.length < 10 && !/[A-Z]/.test(value)) {
            setPasswordStrength({ width: '50%', color: 'bg-yellow-500', text: 'Moyen: Ajoutez des majuscules' });
        } else if (!/[0-9]/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
            setPasswordStrength({ width: '75%', color: 'bg-green-500', text: 'Bon: Ajoutez chiffres & symboles' });
        } else {
            setPasswordStrength({ width: '100%', color: 'bg-green-600', text: 'Fort: Excellent mot de passe' });
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
                title="Informations de connexion"
                footer={
                    <Button onClick={(e) => handleSubmit(e, "Informations de connexion enregistrées.")}>Enregistrer les modifications</Button>
                }
            >
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input id="username" defaultValue={studentData.email.split('@')[0]} />
                    </div>
                    <div>
                        <Label htmlFor="accountEmail">Email institutionnel</Label>
                        <div className="flex items-center gap-3">
                            <Input id="accountEmail" value={studentData.email} disabled />
                            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">Vérifié</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Cet email ne peut pas être modifié.</p>
                    </div>
                </form>
            </SettingsCard>

            <SettingsCard
                title="Mot de passe"
                footer={<Button onClick={(e) => handleSubmit(e, "Mot de passe mis à jour.")}>Mettre à jour le mot de passe</Button>}
            >
                 <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input type="password" id="currentPassword" placeholder="••••••••" />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input type="password" id="newPassword" placeholder="••••••••" onChange={handlePasswordChange} />
                         <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${passwordStrength.color}`} style={{ width: passwordStrength.width }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{passwordStrength.text}</p>
                    </div>
                     <div>
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <Input type="password" id="confirmPassword" placeholder="••••••••" />
                    </div>
                </form>
            </SettingsCard>
            
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
                                    <SelectTrigger className="w-full md:w-auto">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">Après 30 minutes</SelectItem>
                                        <SelectItem value="60">Après 1 heure</SelectItem>
                                        <SelectItem value="120">Après 2 heures</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                     <div className="pt-6">
                        <h4 className="font-medium mb-4">Appareils connectés</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3"><Laptop className="h-6 w-6 text-blue-500"/><p className="text-sm font-medium">MacBook Pro <span className="text-muted-foreground">(Paris, FR)</span></p></div>
                                <p className="text-xs text-primary">Cet appareil</p>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3"><Smartphone className="h-6 w-6 text-green-500"/><p className="text-sm font-medium">iPhone 13 <span className="text-muted-foreground">(Paris, FR)</span></p></div>
                                <Button variant="ghost" size="sm" className="text-destructive h-auto">Déconnecter</Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3"><Tablet className="h-6 w-6 text-purple-500"/><p className="text-sm font-medium">iPad <span className="text-muted-foreground">(Paris, FR)</span></p></div>
                                 <Button variant="ghost" size="sm" className="text-destructive h-auto">Déconnecter</Button>
                            </div>
                        </div>
                         <Button variant="outline" className="w-full mt-4"><LogOut className="mr-2"/>Déconnecter tous les autres appareils</Button>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}
