'use client';

import SettingsCard from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const notificationTypes = [
    { id: 'course', title: 'Cours et enseignements', description: 'Nouveaux cours, modifications d\'horaires, etc.' },
    { id: 'exam', title: 'Évaluations et examens', description: 'Nouvelles évaluations, résultats, etc.' },
    { id: 'message', title: 'Messages et collaborations', description: 'Nouveaux messages, travaux de groupe, etc.' },
    { id: 'job', title: 'Stages et emplois', description: 'Nouvelles offres, candidatures, etc.' },
    { id: 'admin', title: 'Administration et documents', description: 'Documents administratifs, informations générales, etc.' },
]

export default function NotificationsSettingsTab() {
  return (
    <div className="space-y-6">
        <SettingsCard title="Canaux de notification">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Notifications par email</h4>
                        <p className="text-sm text-muted-foreground">Recevoir des notifications par email.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium">Notifications dans l'application</h4>
                        <p className="text-sm text-muted-foreground">Afficher les notifications dans l'application.</p>
                    </div>
                    <Switch id="app-notifications" defaultChecked />
                </div>
            </div>
        </SettingsCard>
        <SettingsCard title="Types de notifications">
             <div className="space-y-6 divide-y divide-border">
                {notificationTypes.map((type, index) => (
                    <div key={type.id} className={`flex items-center justify-between ${index > 0 ? 'pt-6' : ''}`}>
                        <div>
                            <h4 className="font-medium">{type.title}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        <Switch id={`${type.id}-notifications`} defaultChecked />
                    </div>
                ))}
            </div>
        </SettingsCard>
        <SettingsCard title="Fréquence des notifications">
            <div>
                <Label htmlFor="email-frequency">Emails récapitulatifs</Label>
                 <Select defaultValue="daily">
                    <SelectTrigger id="email-frequency" className="w-full md:w-auto mt-2">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="instant">Instantané (pour chaque événement)</SelectItem>
                        <SelectItem value="daily">Quotidien (résumé une fois par jour)</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire (résumé une fois par semaine)</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </SettingsCard>
    </div>
  );
}
