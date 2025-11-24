
import type { LucideIcon } from 'lucide-react';
import { FileText, Download, Eye, Trash2, CheckCircle, Clock } from 'lucide-react';

export type ReportType = 'attendance' | 'grades' | 'progress' | 'activities' | 'custom' | 'comparative';
export type ReportStatus = 'available' | 'processing';

export interface Report {
    id: string;
    type: ReportType;
    title: string;
    description: string;
    period: string;
    generatedAt: string;
    size: string;
    status: ReportStatus;
}

export const reportsData: Report[] = [
    {
        id: 'rep-001',
        type: 'attendance',
        title: 'Rapport de présences',
        description: 'BDD L3 - Toutes les classes',
        period: 'Mars 2025',
        generatedAt: 'Il y a 2 heures',
        size: '2.3 Mo',
        status: 'available',
    },
    {
        id: 'rep-002',
        type: 'grades',
        title: 'Rapport de notes',
        description: 'Examen BDD - L3 Informatique',
        period: 'Session Mars',
        generatedAt: 'Aujourd\'hui',
        size: '1.8 Mo',
        status: 'available',
    },
    {
        id: 'rep-003',
        type: 'progress',
        title: 'Rapport de progression',
        description: 'Semestre 2 - Tous cours',
        period: 'Févr-Mars 2025',
        generatedAt: 'Hier',
        size: '3.1 Mo',
        status: 'processing',
    },
    {
        id: 'rep-004',
        type: 'activities',
        title: 'Rapport d\'activités',
        description: 'Semaine 10 - Activités pédagogiques',
        period: '4-8 Mars',
        generatedAt: 'Il y a 1 jour',
        size: '1.2 Mo',
        status: 'available',
    },
    {
        id: 'rep-005',
        type: 'custom',
        title: 'Rapport personnalisé',
        description: 'Performance Python L2 vs BDD L3',
        period: 'Semestre 2',
        generatedAt: 'Il y a 2 jours',
        size: '2.7 Mo',
        status: 'available',
    }
];

export const statusConfig: { [key in ReportStatus]: { text: string; icon: LucideIcon; color: string; } } = {
    available: { text: 'Disponible', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
    processing: { text: 'En traitement', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' }
};
