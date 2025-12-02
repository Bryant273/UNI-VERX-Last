'use client';
import { Switch } from "@/components/ui/switch";
import SettingsCard from "./SettingsCard";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const connectedApps = [
    { name: 'Google', description: 'Google Calendar, Drive', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', connected: true },
    { name: 'Microsoft', description: 'Office 365, OneDrive', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg', connected: true },
    { name: 'GitHub', description: 'Projets de code, collaborations', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', connected: true },
    { name: 'LinkedIn', description: 'Profil professionnel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg', connected: false },
]

export default function IntegrationsSettingsTab() {
    return (
        <div className="space-y-6">
            <SettingsCard title="Applications connectées">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {connectedApps.map(app => (
                        <div key={app.name} className="p-4 rounded-lg border hover:border-primary hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image src={app.logo} alt={app.name} width={32} height={32} />
                                    <div>
                                        <h5 className="font-medium text-sm">{app.name}</h5>
                                        <p className="text-xs text-muted-foreground">{app.description}</p>
                                    </div>
                                </div>
                                {app.connected ? 
                                    <Switch defaultChecked={app.connected} /> :
                                    <Button variant="outline" size="sm">Connecter</Button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full"><Plus className="mr-2"/>Ajouter une application</Button>
            </SettingsCard>
            <SettingsCard title="Synchronisation">
                 <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0">
                        <div>
                            <h4 className="font-medium">Synchroniser avec Google Calendar</h4>
                            <p className="text-sm text-muted-foreground">Ajoute votre emploi du temps à Google Calendar.</p>
                        </div>
                        <Switch id="sync-gcal" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between pt-6">
                        <div>
                            <h4 className="font-medium">Synchroniser avec Microsoft Outlook</h4>
                            <p className="text-sm text-muted-foreground">Ajoute votre emploi du temps à Outlook Calendar.</p>
                        </div>
                        <Switch id="sync-outlook" />
                    </div>
                     <div className="flex items-center justify-between pt-6">
                        <div>
                            <h4 className="font-medium">Synchroniser les documents</h4>
                            <p className="text-sm text-muted-foreground">Sauvegarde vos documents sur Google Drive ou OneDrive.</p>
                        </div>
                        <Switch id="sync-docs" defaultChecked />
                    </div>
                </div>
            </SettingsCard>
        </div>
    )
}
