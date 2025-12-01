
import type { LucideIcon } from 'lucide-react';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  isLeader?: boolean;
}

export interface Message {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: Member;
}

export interface Submission {
  fileName: string;
  fileSize: string;
  date: string;
}

export interface GroupWork {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: 'en cours' | 'terminé';
  progress: number;
  members: Member[];
  messages: Message[];
  sharedFiles: SharedFile[];
  submission?: Submission;
}

const members: Member[] = [
    { id: 'user-1', name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', isLeader: true },
    { id: 'user-2', name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', isLeader: false },
    { id: 'user-3', name: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', isLeader: false },
    { id: 'user-4', name: 'Lucas Petit', avatar: 'https://i.pravatar.cc/100?img=11', isLeader: false },
];

export const groupWorkData: GroupWork = {
  id: 'td-01',
  title: 'Projet de fin de semestre : Application Web Full-Stack',
  course: 'Développement Web Avancé',
  deadline: '15 juin 2025',
  status: 'en cours',
  progress: 65,
  members,
  messages: [
    { id: 'msg-1', author: members[1], content: 'Salut l\'équipe ! J\'ai commencé à travailler sur le backend. La base de données est prête.', timestamp: '14:30' },
    { id: 'msg-2', author: members[2], content: 'Super Thomas ! De mon côté, je prépare les maquettes sur Figma pour l\'interface utilisateur.', timestamp: '14:35' },
    { id: 'msg-3', author: members[0], content: 'Excellent travail ! J\'ai mis le cahier des charges dans les fichiers partagés. N\'hésitez pas si vous avez des questions.', timestamp: '14:40' },
    { id: 'msg-4', author: members[3], content: 'OK, je vais jeter un œil au cahier des charges et commencer à préparer les tests.', timestamp: '15:00' },
  ],
  sharedFiles: [
    { id: 'file-1', name: 'cahier-des-charges.pdf', size: '1.2 MB', uploadedBy: members[0] },
    { id: 'file-2', name: 'schema-db.png', size: '345 KB', uploadedBy: members[1] },
    { id: 'file-3', name: 'maquettes-v1.fig', size: '5.8 MB', uploadedBy: members[2] },
  ],
};
