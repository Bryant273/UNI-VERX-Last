
import type { LucideIcon } from 'lucide-react';
import { BadgeHelp, BookUser, Wrench } from 'lucide-react';
import { CheckCircle, Clock, XCircle, Archive } from 'lucide-react';
import { userData } from './static-data';

export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketDepartment = 'scolarite' | 'technique' | 'pedagogique';

export interface TicketMessage {
  author: string;
  date: string;
  content: string;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  department: TicketDepartment;
  date: string;
  lastUpdate: string;
  status: TicketStatus;
  author: string;
  messages: TicketMessage[];
}

export const ticketsData: Ticket[] = [
  {
    id: 'T-8563',
    subject: 'Problème d\'accès au cours de BDD',
    department: 'technique',
    date: '18/05/2025',
    lastUpdate: '2025-05-18T10:00:00Z',
    status: 'open',
    author: userData.student.name,
    messages: [
      {
        author: userData.student.name,
        date: '2025-05-18T10:00:00Z',
        content: 'Bonjour, je n\'arrive pas à accéder aux documents du cours de Bases de Données du Prof. Dubois. La page reste blanche.',
      },
    ],
  },
  {
    id: 'T-8562',
    subject: 'Demande de relevé de notes',
    department: 'scolarite',
    date: '17/05/2025',
    lastUpdate: '2025-05-18T14:30:00Z',
    status: 'pending',
    author: userData.student.name,
    messages: [
      {
        author: userData.student.name,
        date: '2025-05-17T11:00:00Z',
        content: 'Bonjour, j\'aurais besoin d\'un relevé de notes officiel pour le semestre 1 de l\'année 2024-2025.',
      },
      {
        author: 'Service Scolarité',
        date: '2025-05-18T14:30:00Z',
        content: 'Bonjour, votre demande est en cours de traitement. Le document sera disponible sur votre espace personnel d\'ici 48h.',
      },
    ],
  },
  {
    id: 'T-7451',
    subject: 'Question sur la notation du TP de Python',
    department: 'pedagogique',
    date: '12/04/2025',
    lastUpdate: '2025-04-15T09:00:00Z',
    status: 'closed',
    author: userData.professor.name,
    messages: [
      {
        author: userData.professor.name,
        date: '2025-04-12T16:00:00Z',
        content: 'Bonjour, pourriez-vous clarifier le barème appliqué pour le dernier TP de Python ? Plusieurs étudiants ont des questions.',
      },
      {
        author: 'Support Pédagogique',
        date: '2025-04-14T10:00:00Z',
        content: 'Bonjour Dr. Dubois, le barème est le suivant : 10 points pour la fonctionnalité, 5 points pour la qualité du code, 5 points pour les commentaires. Nous allons envoyer une annonce aux étudiants.',
      },
       {
        author: userData.professor.name,
        date: '2025-04-15T09:00:00Z',
        content: 'Parfait, merci beaucoup.',
      },
    ],
  },
  {
    id: 'T-7399',
    subject: 'Problème de projecteur salle B205',
    department: 'technique',
    date: '10/04/2025',
    lastUpdate: '2025-04-11T12:00:00Z',
    status: 'closed',
    author: userData.professor.name,
    messages: [
      {
        author: userData.professor.name,
        date: '2025-04-10T08:30:00Z',
        content: 'Le projecteur de la salle B205 ne s\'allume plus. J\'ai un cours à 10h. Merci de votre intervention.',
      },
      {
        author: 'Support Technique',
        date: '2025-04-11T12:00:00Z',
        content: 'Bonjour, notre technicien est intervenu. Le projecteur est de nouveau fonctionnel. Toutes nos excuses pour la gêne occasionnée.',
      },
    ],
  },
];

export const ticketStatusConfig: Record<TicketStatus, { label: string; icon: LucideIcon; color: string; }> = {
  open: { label: 'Ouvert', icon: BadgeHelp, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
  closed: { label: 'Fermé', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
};

export const ticketDepartmentConfig: Record<TicketDepartment, { label: string; icon: LucideIcon; color: string; }> = {
  scolarite: { label: 'Scolarité', icon: BookUser, color: 'text-purple-600' },
  technique: { label: 'Technique', icon: Wrench, color: 'text-orange-600' },
  pedagogique: { label: 'Pédagogique', icon: BadgeHelp, color: 'text-blue-600' },
};
