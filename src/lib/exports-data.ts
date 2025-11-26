
import { Users, GraduationCap, BookOpen, Clock, File, Download, FileBarChart, PieChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ExportTemplate {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface ExportHistoryItem {
    id: string;
    date: string;
    time: string;
    filename: string;
    format: 'CSV' | 'PDF' | 'JSON';
    size: string;
    requester: string;
}

export interface DataSource {
    label: string;
    icon: LucideIcon;
    fields: Array<{id: string; label: string; default: boolean}>;
    filters: Array<{id: string; label: string; placeholder: string; options: Array<{value: string; label: string}>}>;
}

export const dataSources: Record<string, DataSource> = {
    students: {
        label: 'Étudiants',
        icon: Users,
        fields: [
            { id: 'studentId', label: 'Matricule', default: true },
            { id: 'lastName', label: 'Nom', default: true },
            { id: 'firstName', label: 'Prénom', default: true },
            { id: 'email', label: 'Email', default: true },
            { id: 'phone', label: 'Téléphone', default: false },
            { id: 'class', label: 'Classe', default: true },
            { id: 'average', label: 'Moyenne Générale', default: false },
            { id: 'attendance', label: 'Taux de présence', default: false },
        ],
        filters: [
            { id: 'class', label: 'Filtrer par classe', placeholder: 'Toutes les classes', options: [
                { value: 'l1', label: 'L1' },
                { value: 'l2', label: 'L2' },
                { value: 'l3', label: 'L3' },
            ]},
             { id: 'status', label: 'Filtrer par statut', placeholder: 'Tous les statuts', options: [
                { value: 'admis', label: 'Admis' },
                { value: 'ajourne', label: 'Ajourné' },
            ]},
        ]
    },
    grades: {
        label: 'Notes',
        icon: GraduationCap,
        fields: [
            { id: 'studentName', label: 'Nom Étudiant', default: true },
            { id: 'courseName', label: 'Matière', default: true },
            { id: 'examName', label: 'Évaluation', default: true },
            { id: 'grade', label: 'Note', default: true },
            { id: 'coefficient', label: 'Coefficient', default: false },
        ],
        filters: [
            { id: 'semester', label: 'Filtrer par semestre', placeholder: 'Tous les semestres', options: [
                 { value: 's1', label: 'Semestre 1' },
                 { value: 's2', label: 'Semestre 2' },
            ]}
        ]
    },
    courses: {
        label: 'Cours',
        icon: BookOpen,
        fields: [
            { id: 'courseId', label: 'Code matière', default: true },
            { id: 'courseName', label: 'Nom matière', default: true },
            { id: 'teacher', label: 'Enseignant', default: true },
            { id: 'credits', label: 'Crédits ECTS', default: true },
        ],
        filters: []
    },
    attendance: {
        label: 'Présences',
        icon: Clock,
        fields: [
            { id: 'studentName', label: 'Nom Étudiant', default: true },
            { id: 'courseName', label: 'Matière', default: true },
            { id: 'date', label: 'Date', default: true },
            { id: 'status', label: 'Statut', default: true },
            { id: 'justification', label: 'Justificatif', default: false },
        ],
        filters: []
    }
};

export const exportTemplates: ExportTemplate[] = [
    {
        id: 'tpl-1',
        title: 'Liste des étudiants par classe',
        description: 'Nom, prénom, email et classe de tous les étudiants.',
        icon: Users
    },
    {
        id: 'tpl-2',
        title: 'Liste d\'émargement',
        description: 'Génère une feuille de présence vierge pour une classe.',
        icon: FileCheck2
    },
    {
        id: 'tpl-3',
        title: 'Export complet des notes',
        description: 'Toutes les notes de tous les étudiants pour le semestre.',
        icon: GraduationCap
    },
    {
        id: 'tpl-4',
        title: 'Catalogue des cours',
        description: 'Exporte la liste de toutes les matières et leurs enseignants.',
        icon: BookOpen
    }
];

export const exportHistory: ExportHistoryItem[] = [
    { id: 'hist-1', date: '20/05/2025', time: '14:30', filename: 'export_etudiants_l3_info_2025-05-20.csv', format: 'CSV', size: '2.3MB', requester: 'M. Jean Moreau' },
    { id: 'hist-2', date: '19/05/2025', time: '11:15', filename: 'report_notes_s1_2024_2025.pdf', format: 'PDF', size: '5.1MB', requester: 'Dr. Claire Dubois' },
    { id: 'hist-3', date: '18/05/2025', time: '09:00', filename: 'full_student_database.json', format: 'JSON', size: '12.8MB', requester: 'Admin Système' },
    { id: 'hist-4', date: '15/05/2025', time: '16:45', filename: 'export_presences_avril_2025.csv', format: 'CSV', size: '1.9MB', requester: 'M. Jean Moreau' },
    { id: 'hist-5', date: '12/05/2025', time: '10:00', filename: 'catalogue_cours_2025.pdf', format: 'PDF', size: '800KB', requester: 'Secrétariat' },
];
