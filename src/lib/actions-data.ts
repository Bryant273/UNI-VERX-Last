'use client';
import {
  LogIn,
  LogOut,
  User,
  FileDown,
  FileUp,
  FilePen,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export type ActionType =
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'file_upload'
  | 'file_download'
  | 'password_change'
  | 'settings_update';

export interface ActionLog {
  id: string;
  action: ActionType;
  description: string;
  date: Date;
  ip: string;
  location: string;
  isFirstLogin?: boolean;
}

export const statusConfig: Record<
  ActionType,
  { label: string; icon: LucideIcon; color: string }
> = {
  login: {
    label: 'Connexion',
    icon: LogIn,
    color: 'text-green-600',
  },
  logout: {
    label: 'Déconnexion',
    icon: LogOut,
    color: 'text-red-600',
  },
  profile_update: {
    label: 'Mise à jour du profil',
    icon: User,
    color: 'text-blue-600',
  },
  file_upload: {
    label: 'Téléversement de fichier',
    icon: FileUp,
    color: 'text-purple-600',
  },
  file_download: {
    label: 'Téléchargement de fichier',
    icon: FileDown,
    color: 'text-orange-600',
  },
  password_change: {
    label: 'Changement de mot de passe',
    icon: ShieldCheck,
    color: 'text-yellow-600',
  },
  settings_update: {
    label: 'Mise à jour des paramètres',
    icon: FilePen,
    color: 'text-indigo-600',
  },
};

const generateActionData = (): ActionLog[] => {
  const actions: ActionLog[] = [];
  const actionTypes: ActionType[] = [
    'login',
    'profile_update',
    'file_upload',
    'file_download',
    'settings_update',
    'logout',
  ];
  const locations = ['Paris, FR', 'Lyon, FR', 'Marseille, FR', 'Lille, FR'];
  const firstLoginDates = new Set<string>();

  const baseDate = new Date();
  baseDate.setHours(17, 25, 38, 0); // Set a fixed time for deterministic generation

  // Add some actions for today
  for (let i = 0; i < 5; i++) {
    const time = new Date(baseDate);
    time.setHours(baseDate.getHours() - i);
    time.setMinutes(baseDate.getMinutes() - (i * 17));
    time.setSeconds(baseDate.getSeconds() - (i*5));
    
    const type = actionTypes[i % actionTypes.length];
    
    let isFirstLogin = false;
    if (type === 'login' && !firstLoginDates.has(time.toDateString())) {
        isFirstLogin = true;
        firstLoginDates.add(time.toDateString());
    }

    actions.push({
      id: `action-today-${i}`,
      action: type,
      description: `Description de l'action d'aujourd'hui #${i+1}`,
      date: time,
      ip: `82.124.${100 + (i % 155)}.${50 + (i % 205)}`,
      location: locations[i % locations.length],
      isFirstLogin: isFirstLogin,
    });
  }

  for (let i = 0; i < 50; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - Math.floor(i / 5) - 1);
    date.setHours(20 - (i % 12), 59 - (i * 3) % 60, 0, 0);

    const type = actionTypes[i % actionTypes.length];

    let isFirstLogin = false;
    if (type === 'login' && !firstLoginDates.has(date.toDateString())) {
      isFirstLogin = true;
      firstLoginDates.add(date.toDateString());
    }
    
    let description = '';
    switch(type) {
        case 'login': description = "Connexion réussie au compte."; break;
        case 'logout': description = "Déconnexion manuelle du compte."; break;
        case 'profile_update': description = "Informations du profil modifiées."; break;
        case 'file_upload': description = "Téléversement du fichier 'CV_Sarah_Dupont.pdf'."; break;
        case 'file_download': description = "Téléchargement du fichier 'Certificat_Scolarite.pdf'."; break;
        case 'password_change': description = "Le mot de passe a été modifié avec succès."; break;
        case 'settings_update': description = "Les préférences de notifications ont été mises à jour."; break;
    }

    actions.push({
      id: `action-past-${i + 1}`,
      action: type,
      description,
      date: date,
      ip: `82.124.${100 + (i % 155)}.${50 + (i % 205)}`,
      location: locations[i % locations.length],
      isFirstLogin: isFirstLogin,
    });
  }

  // Ensure there is at least one "first login" for today if not already present
  const todayString = baseDate.toDateString();
  if (!firstLoginDates.has(todayString)) {
    const firstLoginToday = actions.find(a => a.action === 'login' && a.date.toDateString() === todayString);
    if (firstLoginToday) {
      firstLoginToday.isFirstLogin = true;
    } else {
        const time = new Date(baseDate);
        time.setHours(8, 30, 0);
        actions.push({
            id: 'first-login-enforced',
            action: 'login',
            description: 'Première connexion de la journée.',
            date: time,
            ip: '82.124.100.50',
            location: 'Paris, FR',
            isFirstLogin: true
        });
    }
  }

  return actions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const actionsData: ActionLog[] = generateActionData();
