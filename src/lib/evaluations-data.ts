'use client';

import type { LucideIcon } from 'lucide-react';
import { Check, ChevronRight, Clock, HelpCircle, X, ListChecks, FileClock, CheckCircle, AlertCircle, BookCheck } from "lucide-react";

// --- Types pour les étudiants ---

export type DevoirStatus = 'À faire' | 'En attente' | 'Rendu' | 'En retard' | 'Corrigé';

export interface Devoir {
  id: string;
  course: string;
  title: string;
  deadline: string;
  status: DevoirStatus;
  instructions: string;
  attachments: { name: string; url: string }[];
  submission?: {
    date: string;
    file: string;
    grade?: number;
    comment?: string;
  };
}

export const devoirsData: Devoir[] = [
    { 
        id: 'dev-1', 
        course: 'Bases de Données', 
        title: 'TP - Requêtes SQL avancées', 
        deadline: '25/05/2025', 
        status: 'Rendu',
        instructions: "Veuillez réaliser les exercices du document joint et soumettre vos requêtes SQL dans un unique fichier .sql.",
        attachments: [{ name: "sujet_tp_sql.pdf", url: "#" }],
        submission: { date: "24/05/2025", file: "tp_sql_dupont.sql" }
    },
    { 
        id: 'dev-2', 
        course: 'Programmation Python', 
        title: 'Projet - API REST', 
        deadline: '10/06/2025', 
        status: 'À faire',
        instructions: "Développer une API REST simple avec Flask pour gérer une liste de tâches. Les spécifications détaillées sont dans le PDF.",
        attachments: [{ name: "specs_api_rest.pdf", url: "#" }]
    },
    { 
        id: 'dev-3', 
        course: 'Algorithmique', 
        title: 'DM - Complexité', 
        deadline: '01/05/2025', 
        status: 'Corrigé',
        instructions: "Analyser la complexité des algorithmes de tri vus en cours.",
        attachments: [],
        submission: { date: "30/04/2025", file: "dm_complexite_dupont.pdf", grade: 17, comment: "Excellent travail d'analyse." }
    },
];

export interface QCM {
  id: string;
  course: string;
  qcmNumber: number;
  date: string;
  time: string; // HH:MM
  duration: number; // in minutes
  status: 'Actif' | 'Corrigé' | 'À venir';
  questions: {
    question: string;
    options: string[];
    answer: number; // index of correct answer
  }[];
  grade?: number;
  userAnswers?: Record<number, number>;
}

export const qcmData: QCM[] = [
  {
    id: 'qcm-1',
    course: 'Bases de Données',
    qcmNumber: 1,
    date: '15/04/2025',
    time: '14:00',
    duration: 15,
    status: 'Corrigé',
    questions: Array.from({ length: 20 }, (_, i) => ({
      question: `Question sur SQL ${i + 1}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: i % 4,
    })),
    grade: 16,
    userAnswers: { 0: 0, 1: 2, 2: 2, 3: 3, 4:0, 5:1, 6:2, 7:3, 8:0, 9:1, 10:2, 11:3, 12:0, 13:1, 14:2, 15:3, 16:0, 17:1, 18:2, 19:3 }
  },
  {
    id: 'qcm-2',
    course: 'Programmation Python',
    qcmNumber: 2,
    date: '22/04/2025',
    time: '10:30',
    duration: 20,
    status: 'Corrigé',
    questions: Array.from({ length: 20 }, (_, i) => ({
      question: `Question de Python ${i + 1}`,
      options: ['Rep 1', 'Rep 2', 'Rep 3', 'Rep 4'],
      answer: (i + 1) % 4,
    })),
    grade: 12,
    userAnswers: { 0: 1, 1: 2, 2: 3, 3: 0, 4:1, 5:2, 6:3, 7:0, 8:1, 9:2, 10:3, 11:0, 12:1, 13:2, 14:3, 15:0, 16:1, 17:2, 18:3, 19:0 }
  },
   {
    id: 'qcm-3',
    course: 'Algorithmique',
    qcmNumber: 1,
    date: '28/05/2025',
    time: '08:30',
    duration: 15,
    status: 'Actif',
    questions: Array.from({ length: 20 }, (_, i) => ({
      question: `Quelle est la complexité de cet algo ${i + 1} ?`,
      options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
      answer: i % 4,
    })),
  }
];


// --- Types pour les professeurs ---

export type EvaluationStatusProf = 'draft' | 'published' | 'grading' | 'completed' | 'archived';

export const qcmStatusConfig: Record<EvaluationStatusProf, { label: string; icon: LucideIcon; color: string }> = {
  draft: { label: 'Brouillon', icon: FileClock, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  published: { label: 'Publié', icon: Clock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  grading: { label: 'En correction', icon: ListChecks, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  completed: { label: 'Terminé', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  archived: { label: 'Archivé', icon: CheckCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
};

export interface QCMProf {
  id: string;
  title: string;
  course: string;
  date: string;
  status: EvaluationStatusProf;
  participants: number;
  totalStudents: number;
}

export const qcmList: QCMProf[] = [
  { id: 'qcm1', title: 'QCM de mi-semestre', course: 'Bases de Données', date: '15/04/2025', status: 'completed', participants: 85, totalStudents: 89 },
  { id: 'qcm2', title: 'QCM Chapitres 1 & 2', course: 'Programmation Python', date: '22/04/2025', status: 'completed', participants: 65, totalStudents: 67 },
  { id: 'qcm3', title: 'QCM final', course: 'Algorithmique', date: '28/05/2025', status: 'grading', participants: 112, totalStudents: 120 },
  { id: 'qcm4', title: 'QCM de révision', course: 'Bases de Données', date: '30/05/2025', status: 'draft', participants: 0, totalStudents: 89 },
];

export const devoirStatusConfig: Record<EvaluationStatusProf, { label: string; icon: LucideIcon; color: string }> = {
  draft: { label: 'Brouillon', icon: FileClock, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  published: { label: 'Publié', icon: Clock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  grading: { label: 'En correction', icon: ListChecks, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  completed: { label: 'Corrigé', icon: BookCheck, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  archived: { label: 'Archivé', icon: CheckCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
};

export interface DevoirProf {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: EvaluationStatusProf;
  submissions: number;
  totalStudents: number;
}

export const devoirsList: DevoirProf[] = [
    { id: 'dev1', title: 'TP - Requêtes SQL avancées', course: 'Bases de Données', deadline: '25/05/2025', status: 'grading', submissions: 80, totalStudents: 89 },
    { id: 'dev2', title: 'Projet - API REST', course: 'Programmation Python', deadline: '10/06/2025', status: 'published', submissions: 12, totalStudents: 67 },
    { id: 'dev3', title: 'DM - Complexité', course: 'Algorithmique', deadline: '01/05/2025', status: 'completed', submissions: 115, totalStudents: 120 },
];

export interface GroupWork {
    id: string;
    title: string;
    course: string;
    deadline: string;
    groupsCount: number;
}

export const groupWorksList: GroupWork[] = [
    { id: 'grp1', title: 'Projet de fin de semestre', course: 'Développement Web', deadline: '30/06/2025', groupsCount: 12 },
    { id: 'grp2', title: 'Analyse d\'un système existant', course: 'Génie Logiciel', deadline: '20/06/2025', groupsCount: 10 },
];
