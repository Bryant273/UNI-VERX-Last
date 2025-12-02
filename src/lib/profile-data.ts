
import type { LucideIcon } from 'lucide-react';

export interface Skill {
  name: string;
  level: number;
}

export interface Badge {
  name: string;
  description: string;
  icon: 'Award' | 'Trophy' | 'Star' | 'BrainCircuit' | 'BookOpen';
  color: string;
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
}

export interface ProfileData {
  progression: {
    general: {
      percentage: number;
      semester: string;
    };
    stats: {
      coursesTaken: number;
      attendance: number;
      assignmentsDone: number;
      gpa: number;
    };
    bySubject: Array<{
      name: string;
      progress: number;
    }>;
  };
  skills: {
    technical: Skill[];
    soft: Skill[];
    languages: Skill[];
  };
  projects: Project[];
  badges: {
    unlocked: Badge[];
    locked: Badge[];
  };
}

export const profileData: ProfileData = {
  progression: {
    general: {
      percentage: 76,
      semester: 'Semestre 2 - 2024/2025',
    },
    stats: {
      coursesTaken: 15,
      attendance: 87,
      assignmentsDone: 8,
      gpa: 12.5,
    },
    bySubject: [
      { name: 'Programmation Orientée Objet', progress: 92 },
      { name: 'Bases de Données', progress: 85 },
      { name: 'Algorithmes et Structures de Données', progress: 78 },
      { name: 'Développement Web', progress: 88 },
      { name: 'Réseaux', progress: 65 },
    ],
  },
  skills: {
    technical: [
      { name: 'Java', level: 85 },
      { name: 'Python', level: 92 },
      { name: 'JavaScript', level: 78 },
      { name: 'HTML/CSS', level: 90 },
      { name: 'SQL', level: 88 },
      { name: 'React', level: 65 },
      { name: 'Git', level: 75 },
    ],
    soft: [
      { name: 'Travail en équipe', level: 95 },
      { name: 'Communication', level: 88 },
      { name: 'Gestion de projet', level: 79 },
      { name: 'Résolution de problèmes', level: 90 },
      { name: 'Pensée critique', level: 85 },
    ],
    languages: [
      { name: 'Français (natif)', level: 100 },
      { name: 'Anglais (C1)', level: 90 },
      { name: 'Espagnol (B1)', level: 60 },
    ],
  },
  projects: [
    { name: 'Système de gestion de bibliothèque', description: 'Application Java avec interface Swing et base de données MySQL', tags: ['Java', 'SQL', 'Swing'] },
    { name: 'Site web de e-commerce', description: 'Application web responsive avec panier et système de paiement', tags: ['HTML/CSS', 'JavaScript', 'PHP'] },
  ],
  badges: {
    unlocked: [
      { name: 'Excellence Académique', description: 'Moyenne générale supérieure à 16/20', icon: 'Award', color: 'bg-yellow-500' },
      { name: 'Expert en Programmation', description: 'Note maximale au projet de POO', icon: 'Trophy', color: 'bg-blue-500' },
      { name: 'Maître des Bases de Données', description: '100% de réussite aux exercices SQL', icon: 'Star', color: 'bg-purple-500' },
    ],
    locked: [
      { name: 'Major de Promotion', description: 'Terminer 1er de votre promotion', icon: 'Trophy', color: 'bg-gray-400' },
      { name: 'Expert en IA', description: 'Réaliser un projet d\'IA fonctionnel', icon: 'BrainCircuit', color: 'bg-gray-400' },
      { name: 'Publication Scientifique', description: 'Participer à la rédaction d\'un article de recherche', icon: 'BookOpen', color: 'bg-gray-400' },
    ],
  },
};
