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
  date: string;
  time: string;
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
  let lastDate = '';

  for (let i = 0; i < 50; i++) {
    const date = new Date(2025, 4, 28 - Math.floor(i / 5));
    const formattedDate = date.toLocaleDateString('fr-FR');
    const time = `${String(20 - (i % 12)).padStart(2, '0')}:${String(
      59 - (i * 3) % 60
    ).padStart(2, '0')}`;
    const type = actionTypes[i % actionTypes.length];

    let isFirstLogin = false;
    if (type === 'login' && formattedDate !== lastDate) {
      isFirstLogin = true;
      lastDate = formattedDate;
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
      id: `action-${i + 1}`,
      action: type,
      description,
      date: formattedDate,
      time: time,
      ip: `82.124.${100 + (i % 155)}.${50 + (i % 205)}`,
      location: locations[i % locations.length],
      isFirstLogin: isFirstLogin,
    });
  }

  // Ensure there's at least one first login for today for demonstration
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('fr-FR');
  if (!actions.some(a => a.date === todayFormatted && a.isFirstLogin)) {
    actions.unshift({
      id: `action-0`,
      action: 'login',
      description: 'Première connexion de la journée.',
      date: todayFormatted,
      time: '08:32',
      ip: `82.124.100.50`,
      location: 'Paris, FR',
      isFirstLogin: true,
    });
  }


  return actions;
};

export const actionsData: ActionLog[] = generateActionData();
