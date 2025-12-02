'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Minus, Plus } from 'lucide-react';
import SettingsCard from './SettingsCard';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AppearanceSettingsTab() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(100);

  const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
    setFontSize(prev => {
        const newSize = direction === 'increase' ? Math.min(150, prev + 10) : Math.max(80, prev - 10);
        document.documentElement.style.fontSize = `${newSize}%`;
        return newSize;
    })
  }

  return (
    <div className="space-y-6">
        <SettingsCard title="Thème">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ThemeOption id="light" label="Clair" icon={<Sun/>} currentTheme={theme} setTheme={setTheme} />
                <ThemeOption id="dark" label="Sombre" icon={<Moon/>} currentTheme={theme} setTheme={setTheme} />
                <ThemeOption id="system" label="Système" icon={<Monitor/>} currentTheme={theme} setTheme={setTheme} />
            </div>
        </SettingsCard>

        <SettingsCard title="Langue">
             <Select defaultValue="fr">
                <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                </SelectContent>
            </Select>
        </SettingsCard>
        
        <SettingsCard title="Accessibilité">
            <div className="space-y-6 divide-y divide-border">
                <div className="flex items-center justify-between pt-6 first:pt-0">
                    <div>
                        <h4 className="font-medium">Animations réduites</h4>
                        <p className="text-sm text-muted-foreground">Désactive les animations de l'interface.</p>
                    </div>
                    <Switch id="reduced-motion" />
                </div>
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h4 className="font-medium">Contraste élevé</h4>
                        <p className="text-sm text-muted-foreground">Augmente le contraste pour une meilleure lisibilité.</p>
                    </div>
                    <Switch id="high-contrast" />
                </div>
                 <div className="flex items-center justify-between pt-6">
                    <div>
                        <h4 className="font-medium">Taille de la police</h4>
                        <p className="text-sm text-muted-foreground">Ajuste la taille du texte dans l'application.</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={() => handleFontSizeChange('decrease')}><Minus/></Button>
                        <span className="font-semibold tabular-nums w-12 text-center">{fontSize}%</span>
                        <Button variant="outline" size="icon" onClick={() => handleFontSizeChange('increase')}><Plus/></Button>
                    </div>
                </div>
            </div>
        </SettingsCard>
    </div>
  );
}

const ThemeOption = ({ id, label, icon, currentTheme, setTheme }: any) => (
    <div className="relative">
        <input type="radio" name="theme" id={`theme-${id}`} value={id} className="hidden peer" checked={currentTheme === id} onChange={() => setTheme(id)} />
        <label htmlFor={`theme-${id}`} className="block p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary">
            <div className="flex justify-center items-center h-20 bg-muted rounded-md mb-3">
                {icon}
            </div>
            <p className="text-sm font-medium text-center">{label}</p>
        </label>
    </div>
);
