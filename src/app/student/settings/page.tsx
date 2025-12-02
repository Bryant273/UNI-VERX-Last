'use client';
import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
  Plug,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProfileSettingsTab from '@/components/settings/profile-settings';
import AccountSettingsTab from '@/components/settings/account-settings';
import NotificationsSettingsTab from '@/components/settings/notifications-settings';
import AppearanceSettingsTab from '@/components/settings/appearance-settings';
import PrivacySettingsTab from '@/components/settings/privacy-settings';
import IntegrationsSettingsTab from '@/components/settings/integrations-settings';


const settingsTabs = [
    { value: 'profile', label: 'Profil', icon: User, component: <ProfileSettingsTab/> },
    { value: 'account', label: 'Compte', icon: Shield, component: <AccountSettingsTab/> },
    { value: 'notifications', label: 'Notifications', icon: Bell, component: <NotificationsSettingsTab/> },
    { value: 'appearance', label: 'Apparence', icon: Palette, component: <AppearanceSettingsTab/> },
    { value: 'privacy', label: 'Confidentialité', icon: Lock, component: <PrivacySettingsTab/> },
    { value: 'integrations', label: 'Intégrations', icon: Plug, component: <IntegrationsSettingsTab/> },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Paramètres</CardTitle>
          <CardDescription>
            Gérez les paramètres de votre profil, de votre compte et de vos préférences.
          </CardDescription>
        </CardHeader>
      </Card>
      
       <Tabs defaultValue="profile" className="w-full lg:grid lg:grid-cols-4 lg:gap-6">
        <TabsList className="flex-col h-auto items-start justify-start p-2 gap-1 bg-transparent hidden lg:flex">
            {settingsTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="w-full justify-start text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
                    <tab.icon className="mr-3 h-5 w-5"/>
                    {tab.label}
                </TabsTrigger>
            ))}
        </TabsList>

        <div className="lg:col-span-3">
             {settingsTabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.component}
                </TabsContent>
            ))}
        </div>
      </Tabs>
    </div>
  );
}
