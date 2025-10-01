

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  MessageSquare,
  FileText,
  Settings,
  Users,
  ClipboardCheck,
  Shield,
  PieChart,
  LogOut,
  Building,
  Briefcase,
  FileCog,
  BookUser,
  type LucideIcon,
  ClipboardList,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';
import type { UserRole, NavItem, TimetableEvent, TimetableEventType, PresenceStatus } from './data';

export const VALID_ROLES: UserRole[] = [
  'student', 
  'professor', 
  'academic-advisor', 
  'secretariat', 
  'rectorate',
  'admin',
  'erp-provider'
];

export const userRolesForLogin: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Étudiant' },
    { value: 'professor', label: 'Professeur' },
    { value: 'academic-advisor', label: 'Responsable Pédagogique' },
    { value: 'secretariat', label: 'Secrétariat' },
    { value: 'rectorate', label: 'Rectorat' },
    { value: 'admin', label: 'Admin-Université' },
    { value: 'erp-provider', label: 'Fournisseur ERP' },
];

export const navLinks: Record<UserRole, NavItem[]> = {
  student: [
    { href: '/student/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/student/courses', label: 'Mes cours', icon: BookOpen },
    { href: '/student/timetable', label: 'Emploi du temps', icon: Calendar },
    { href: '/student/evaluations', label: 'Évaluations', icon: ClipboardList },
    { href: '/student/results', label: 'Résultats', icon: GraduationCap },
    {
      title: 'Collaboratif',
      links: [
        { href: '#', label: 'TD de groupe', icon: Users },
        { href: '#', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      title: 'Administratif',
      links: [
        { href: '#', label: 'Offres d\'emploi', icon: Briefcase },
        { href: '#', label: 'Accès Entreprise', icon: Building },
        { href: '#', label: 'Documents', icon: FileText },
      ],
    },
  ],
  professor: [
    { href: '/professor/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/professor/courses', label: 'Mes cours', icon: BookOpen },
    { href: '#', label: 'Étudiants', icon: Users },
    { href: '#', label: 'Évaluations', icon: ClipboardCheck },
    { href: '/professor/timetable', label: 'Emploi du temps', icon: Calendar },
    { href: '#', label: 'Messages', icon: MessageSquare },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Gestion des utilisateurs', icon: Users },
    { href: '/admin/courses', label: 'Gestion des cours', icon: BookOpen },
    { href: '#', label: 'Statistiques', icon: PieChart },
    { href: '#', label: 'Sécurité', icon: Shield },
  ],
  'academic-advisor': [
    { href: '/academic-advisor/dashboard', label: 'Responsable Pédagogique', icon: LayoutDashboard },
    { href: '#', label: 'Programmes', icon: BookOpen },
    { href: '#', label: 'Suivi Étudiants', icon: Users },
  ],
  secretariat: [
    { href: '/secretariat/dashboard', label: 'Secrétariat', icon: LayoutDashboard },
    { href: '#', label: 'Inscriptions', icon: ClipboardCheck },
    { href: '#', label: 'Gestion Documents', icon: FileCog },
  ],
  rectorate: [
      { href: '/rectorate/dashboard', label: 'Rectorat', icon: LayoutDashboard },
      { href: '#', label: 'Statistiques Globales', icon: PieChart },
      { href: '#', label: 'Administration', icon: Building },
  ],
  'erp-provider': [
      { href: '/erp-provider/dashboard', label: 'Fournisseur ERP', icon: LayoutDashboard },
      { href: '#', label: 'Intégrations', icon: Briefcase },
      { href: '#', label: 'Maintenance', icon: Settings },
  ]
};

export const bottomNavLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '#', label: 'Paramètres', icon: Settings },
  { href: '#', label: 'Déconnexion', icon: LogOut },
];

const semestersData = {
    'Semestre 1': { average: 14.5, totalStudents: 50, rank: 10 },
    'Semestre 2': { average: 15.2, totalStudents: 48, rank: 5 },
};
const semesterAverages = Object.values(semestersData).map(s => s.average);
const overallAverage = semesterAverages.reduce((acc, cur) => acc + cur, 0) / semesterAverages.length;
const overallRank = Math.round(Object.values(semestersData).reduce((acc, cur) => acc + cur.rank, 0) / Object.values(semestersData).length);
const totalStudents = semestersData['Semestre 1']?.totalStudents || 0;


export const studentData = {
  id: 'ETU-2024-12345',
  name: 'Alex Dupont',
  firstName: 'Alex',
  lastName: 'Dupont',
  birthDate: '01/01/2002',
  birthPlace: 'Paris',
  gender: 'Masculin',
  academicYear: '2024-2025',
  level: 'Master 1',
  ufr: 'Sciences et Technologies',
  speciality: 'Ingénierie Logicielle',
  class: 'Master 1 - Ingénierie Logicielle',
  avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
  semesters: semestersData,
  overallAverage: overallAverage,
  overallRank: overallRank,
  totalStudents: totalStudents,
};

export const userData: Record<UserRole, { name: string; avatar: string }> = {
  student: {
    name: studentData.name,
    avatar: studentData.avatar,
  },
  professor: {
    name: 'Dr. Évelyne Dubois',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-2')?.imageUrl || '',
  },
  admin: {
    name: 'Samuel Morin',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-3')?.imageUrl || '',
  },
  'academic-advisor': {
    name: 'Hélène Olivier',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-2')?.imageUrl || '',
  },
  secretariat: {
    name: 'Lucas Bernard',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
  },
  rectorate: {
    name: 'Isabelle Moreau',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-3')?.imageUrl || '',
  },
  'erp-provider': {
    name: 'Fournisseur ERP',
    avatar: '',
  },
};

export const courses = {
  student: [
    { id: 1, title: 'Calcul Avancé', code: 'MATH301', instructor: 'Dr. Alan Turing', thumbnailId: 'course-thumb-1' },
    { id: 2, title: 'Physique Quantique', code: 'PHY305', instructor: 'Dr. Marie Curie', thumbnailId: 'course-thumb-2' },
    { id: 3, title: 'Histoire du 20ème Siècle', code: 'HIST210', instructor: 'Dr. Indiana Jones', thumbnailId: 'course-thumb-3' },
  ],
  professor: [
    { id: 1, title: 'Calcul Avancé', code: 'MATH301', students: 45, thumbnailId: 'course-thumb-1' },
    { id: 4, title: 'Théorie Littéraire', code: 'LIT402', students: 30, thumbnailId: 'course-thumb-4' },
  ],
};


export const allEvents: Record<UserRole, TimetableEvent[]> = {
  student: [
    { 
      id: 1, 
      time: '09:00 - 11:00', 
      course: 'Calcul Avancé', 
      location: 'Amphi A', 
      type: 'cours',
      instructor: 'Dr. Alan Turing',
      fileLink: '/files/calculus-notes.pdf',
      profComment: 'Excellent travail sur les derniers exercices. Continuez comme ça !',
      presenceStatus: 'validated',
      isPast: false,
    },
    { 
      id: 2, 
      time: '13:00 - 15:00', 
      course: 'Physique Quantique', 
      location: 'Labo 3B', 
      type: 'tp',
      instructor: 'Dr. Marie Curie',
      presenceStatus: 'pending',
      isPast: false,
    },
    { 
      id: 6, 
      time: '15:00 - 16:00', 
      course: 'Devoir de calcul', 
      location: 'À rendre en ligne', 
      type: 'devoir',
      fileLink: '/files/devoir-calcul.pdf',
      profComment: 'Date limite ce soir à 23h59.',
      presenceStatus: 'na',
    },
    { 
      id: 7, 
      time: '16:00 - 18:00', 
      course: 'Club de débat', 
      location: 'Salle commune', 
      type: 'activité',
      presenceStatus: 'na',
    },
     { 
      id: 9, 
      time: '08:00 - 10:00', 
      course: 'Histoire Ancienne', 
      location: 'Amphi C', 
      type: 'cours',
      instructor: 'Dr. Indiana Jones',
      presenceStatus: 'absent',
      isPast: true,
    },
  ],
  professor: [
    { id: 1, time: '09:00 - 11:00', course: 'Calcul Avancé', location: 'Amphi A', type: 'cours' },
    { id: 3, time: '11:00 - 12:00', course: 'Heures de bureau', location: 'Bureau 101', type: 'activité' },
    { id: 8, time: '14:00 - 16:00', course: 'Examen de mi-semestre', location: 'Amphi B', type: 'examen' },
  ],
  admin: [
    { id: 4, time: '10:00 - 11:00', course: 'Réunion du corps professoral', location: 'Salle de conférence 1', type: 'activité' },
    { id: 5, time: '14:00 - 15:00', course: 'Revue budgétaire', location: 'Bâtiment administratif', type: 'activité' },
  ],
  'academic-advisor': [],
  secretariat: [],
  rectorate: [],
  'erp-provider': [],
};

export const messages = [
  { id: 1, sender: 'Dr. Évelyne Dubois', subject: 'Résultats de mi-semestre', time: '10:42' },
  { id: 2, sender: 'Administration', subject: 'Avis de coupure de courant sur le campus', time: 'Hier' },
  { id: 3, sender: 'Alex Dupont', subject: 'Question sur le devoir 3', time: 'Il y a 2 jours' },
];
