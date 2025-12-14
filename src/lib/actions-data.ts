
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
import type { UserRole } from './data';
import { userData } from './static-data';

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
  user: {
    name: string;
    role: UserRole;
    avatar: string;
  }
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
  const userRoles = Object.keys(userData) as UserRole[];
  const firstLoginDates = new Set<string>();
  const baseDate = new Date();

  for (let i = 0; i < 150; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - Math.floor(i / 10));
    date.setHours(20 - (i % 12), 59 - (i * 3) % 60, (59 - i) % 60);

    const type = actionTypes[i % actionTypes.length];
    const userRole = userRoles[i % userRoles.length];
    const user = userData[userRole];

    let isFirstLogin = false;
    if (type === 'login' && !firstLoginDates.has(`${user.name}-${date.toDateString()}`)) {
      isFirstLogin = true;
      firstLoginDates.add(`${user.name}-${date.toDateString()}`);
    }
    
    let description = '';
    switch(type) {
        case 'login': description = "Connexion réussie au compte."; break;
        case 'logout': description = "Déconnexion manuelle du compte."; break;
        case 'profile_update': description = "Informations du profil modifiées."; break;
        case 'file_upload': description = "Téléversement du fichier 'CV_2025.pdf'."; break;
        case 'file_download': description = "Téléchargement du fichier 'Releve_Notes.pdf'."; break;
        case 'password_change': description = "Le mot de passe a été modifié avec succès."; break;
        case 'settings_update': description = "Les préférences de notifications ont été mises à jour."; break;
    }

    actions.push({
      id: `action-log-${i + 1}`,
      user: { name: user.name, role: userRole, avatar: user.avatar },
      action: type,
      description,
      date: date,
      ip: `82.124.${100 + (i % 155)}.${50 + (i % 205)}`,
      location: locations[i % locations.length],
      isFirstLogin: isFirstLogin,
    });
  }

  return actions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const allActionsData: ActionLog[] = generateActionData();
