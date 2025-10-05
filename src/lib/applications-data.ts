
import { CheckCircle, Clock, Eye, Mail, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ApplicationStatus = 'sent' | 'viewed' | 'interview' | 'accepted' | 'rejected';

export interface Application {
    id: string;
    company: string;
    jobTitle: string;
    date: string;
    status: ApplicationStatus;
}

export const statusConfig: Record<ApplicationStatus, { text: string, icon: LucideIcon, color: string }> = {
    sent: { text: 'Candidature envoyée', icon: Mail, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    viewed: { text: 'Candidature consultée', icon: Eye, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    interview: { text: 'Entretien planifié', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    accepted: { text: 'Offre acceptée', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    rejected: { text: 'Candidature refusée', icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
};

export const applications: Application[] = [
  {
    id: 'app-1',
    company: 'TechSolutions',
    jobTitle: 'Développeur Frontend',
    date: '12/05/2025',
    status: 'interview',
  },
  {
    id: 'app-2',
    company: 'CloudNine',
    jobTitle: 'Ingénieur DevOps',
    date: '10/05/2025',
    status: 'viewed',
  },
  {
    id: 'app-3',
    company: 'WebCraft',
    jobTitle: 'Développeur Full Stack',
    date: '08/05/2025',
    status: 'sent',
  },
    {
    id: 'app-4',
    company: 'DataViz',
    jobTitle: 'Data Scientist Junior',
    date: '05/05/2025',
    status: 'rejected',
  },
];
