'use client';

import { Check, ChevronRight, Clock, HelpCircle, X } from "lucide-react";

export type DevoirStatus = 'À faire' | 'Rendu' | 'En retard' | 'Corrigé';
export type QCMStatus = 'À venir' | 'Actif' | 'Terminé' | 'Corrigé';

export interface Attachment {
  name: string;
  url: string;
}

export interface Submission {
  date: string;
  file: string;
  grade?: number;
  comment?: string;
}

export interface Devoir {
  id: string;
  course: string;
  title: string;
  deadline: string;
  status: DevoirStatus;
  instructions: string;
  attachments: Attachment[];
  submission?: Submission;
}

export interface Interrogation {
    id: string;
    course: string;
    time: string;
    location: string;
    teacher: string;
    status: 'À venir' | 'En cours' | 'Terminé';
}

export interface QCMQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface QCM {
  id: string;
  course: string;
  qcmNumber: number;
  status: QCMStatus;
  questions: QCMQuestion[];
  time: string;
  duration: number; // in minutes
  grade?: number;
  date?: string;
}

// Helper to generate 20 questions for a QCM
const generateQuestions = (count: number, topic: string): QCMQuestion[] => {
    return Array.from({ length: count }, (_, i) => ({
        question: `Quelle est la définition de ${topic} ${i + 1} ?`,
        options: [`Option A${i+1}`, `Option B${i+1}`, `Option C${i+1}`, `Option D${i+1}`],
        answer: (i + 1) % 4,
    }));
};


export const qcmData: QCM[] = [
    {
        id: "qcm-bdd-1",
        course: "Bases de Données",
        qcmNumber: 1,
        status: 'Actif',
        time: "10:30",
        duration: 15,
        questions: generateQuestions(20, 'SQL')
    },
    {
        id: "qcm-math-1",
        course: "Mathématiques Discrètes",
        qcmNumber: 1,
        status: 'À venir',
        time: "15:30",
        duration: 15,
        questions: generateQuestions(20, 'Graph')
    },
    {
        id: "qcm-algo-1",
        course: "Algorithmique",
        qcmNumber: 1,
        status: 'Corrigé',
        time: "08:30",
        duration: 15,
        questions: generateQuestions(20, 'Complexity'),
        grade: 16,
        date: "15/05/2025"
    },
    {
        id: "qcm-reseau-1",
        course: "Réseaux",
        qcmNumber: 1,
        status: 'Corrigé',
        time: "14:00",
        duration: 15,
        questions: generateQuestions(20, 'TCP/IP'),
        grade: 14,
        date: "12/05/2025"
    }
];

export const interrogationsData: Interrogation[] = [
    {
        id: 'interro-1',
        course: 'Bases de Données',
        time: '10:30 - 12:00',
        location: 'Amphi A',
        teacher: 'Dr. Claire Dubois',
        status: 'En cours',
    },
    {
        id: 'interro-2',
        course: 'Mathématiques Discrètes',
        time: '15:30 - 17:00',
        location: 'Salle B204',
        teacher: 'Prof. Jean Martin',
        status: 'À venir',
    },
];

export const devoirsData: Devoir[] = [
  {
    id: 'devoir-1',
    course: 'Algorithmique avancée',
    title: 'TP Noté - Algorithmes de graphes',
    deadline: '25/05/2025 - 23:59',
    status: 'À faire',
    instructions: 'Implémentez l\'algorithme de Dijkstra et de A* en Python. Fournissez un rapport d\'analyse comparative des performances sur les jeux de données fournis.',
    attachments: [
      { name: 'sujet_tp_graphes.pdf', url: '#' },
      { name: 'dataset_graphes.zip', url: '#' },
    ],
  },
  {
    id: 'devoir-2',
    course: 'Développement Web',
    title: 'Projet - Site e-commerce',
    deadline: '15/06/2025 - 23:59',
    status: 'À faire',
    instructions: 'Réalisez un site e-commerce simple avec React et Node.js. Le site doit inclure un panier, une page produit et un système d\'authentification simple.',
    attachments: [
        { name: 'cahier_des_charges.pdf', url: '#' }
    ],
  },
  {
    id: 'devoir-3',
    course: 'Programmation Orientée Objet',
    title: 'DM - Design Patterns',
    deadline: '10/05/2025 - 23:59',
    status: 'Corrigé',
    instructions: 'Analysez le code fourni et identifiez les Design Patterns utilisés. Proposez des améliorations en utilisant d\'autres patterns pertinents.',
    attachments: [{ name: 'code_source.zip', url: '#' }],
    submission: {
      date: '09/05/2025',
      file: 'DM_Dupont_Alex.pdf',
      grade: 17,
      comment: 'Excellente analyse. Les propositions d\'amélioration sont très pertinentes.'
    },
  },
  {
    id: 'devoir-4',
    course: 'Réseaux',
    title: 'TP - Configuration de routeurs',
    deadline: '01/05/2025 - 23:59',
    status: 'Rendu',
    instructions: 'Configurez le routage entre les 3 réseaux fournis dans le simulateur Packet Tracer.',
    attachments: [{ name: 'schema_reseau.pkt', url: '#' }],
    submission: {
      date: '01/05/2025',
      file: 'config_routeurs_Dupont.pkt',
    },
  },
    {
    id: 'devoir-5',
    course: 'Sécurité Informatique',
    title: 'Rapport d\'analyse de vulnérabilités',
    deadline: '28/04/2025 - 23:59',
    status: 'En retard',
    instructions: 'Effectuez une analyse de vulnérabilités sur l\'application web fournie et rédigez un rapport détaillé de vos trouvailles.',
    attachments: [{ name: 'webapp_vulnerable.zip', url: '#' }],
  },
];

    