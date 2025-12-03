'use client';

import type { LucideIcon } from 'lucide-react';
import { Check, ChevronRight, Clock, HelpCircle, X, ListChecks, FileClock, CheckCircle } from "lucide-react";

// --- Types Généraux ---
export type EvaluationStatus = 'draft' | 'active' | 'grading' | 'completed' | 'archived';

// --- QCM (Quiz) ---
export interface QCMQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
export interface QCM {
  id: string;
  title: string;
  course: string;
  date: string;
  status: EvaluationStatus;
  participants: number;
  totalStudents: number;
  questionBankSize: number;
  questionsPerStudent: number;
}

export const qcmStatusConfig: Record<EvaluationStatus, { label: string; icon: LucideIcon; color: string }> = {
  draft: { label: 'Brouillon', icon: FileClock, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  active: { label: 'Actif', icon: Clock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  grading: { label: 'En correction', icon: ListChecks, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  completed: { label: 'Terminé', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  archived: { label: 'Archivé', icon: CheckCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
};

export const qcmList: QCM[] = [
  { id: 'qcm1', title: 'QCM de mi-semestre', course: 'Bases de Données', date: '15/04/2025', status: 'completed', participants: 85, totalStudents: 89, questionBankSize: 50, questionsPerStudent: 20 },
  { id: 'qcm2', title: 'QCM Chapitres 1 & 2', course: 'Programmation Python', date: '22/04/2025', status: 'completed', participants: 65, totalStudents: 67, questionBankSize: 50, questionsPerStudent: 20 },
  { id: 'qcm3', title: 'QCM final', course: 'Algorithmique', date: 'En cours', status: 'active', participants: 112, totalStudents: 120, questionBankSize: 50, questionsPerStudent: 20 },
  { id: 'qcm4', title: 'QCM de révision', course: 'Bases de Données', date: 'Prévu le 30/05', status: 'draft', participants: 0, totalStudents: 89, questionBankSize: 50, questionsPerStudent: 20 },
];

// --- Devoirs ---
export type DevoirStatus = 'draft' | 'published' | 'grading' | 'completed';
export interface Devoir {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: DevoirStatus;
  submissions: number;
  totalStudents: number;
}

export const devoirStatusConfig: Record<DevoirStatus, { label: string; icon: LucideIcon; color: string }> = {
  draft: { label: 'Brouillon', icon: FileClock, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
  published: { label: 'Publié', icon: Clock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  grading: { label: 'En correction', icon: ListChecks, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  completed: { label: 'Corrigé', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
};

export const devoirsList: Devoir[] = [
    { id: 'dev1', title: 'TP - Requêtes SQL avancées', course: 'Bases de Données', deadline: '25/05/2025', status: 'grading', submissions: 80, totalStudents: 89 },
    { id: 'dev2', title: 'Projet - API REST', course: 'Programmation Python', deadline: '10/06/2025', status: 'published', submissions: 12, totalStudents: 67 },
    { id: 'dev3', title: 'DM - Complexité', course: 'Algorithmique', deadline: '01/05/2025', status: 'completed', submissions: 115, totalStudents: 120 },
];

// --- Travaux de Groupe ---
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
