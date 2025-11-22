

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
  History,
  CreditCard,
  UserCheck,
  UserPlus,
  AlertTriangle,
  CalendarCheck,
  Download,
  FileBarChart,
  Vote,
  FileStack,
  DoorOpen,
  Megaphone,
  FolderOpen,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';
import type { UserRole, NavItem, TimetableEvent } from './data';
import type { DemoUser } from './messages-data';

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
    { href: '/student/payments', label: 'Paiements', icon: CreditCard },
    { href: '/student/courses', label: 'Mes cours', icon: BookOpen },
    { href: '/student/timetable', label: 'Emploi du temps', icon: Calendar },
    { href: '/student/evaluations', label: 'Évaluations', icon: ClipboardList },
    { href: '/student/results', label: 'Résultats', icon: GraduationCap },
    {
      title: 'Collaboratif',
      links: [
        { href: '/student/group-work', label: 'TD de groupe', icon: Users },
        { href: '/student/messages', label: 'Messages', icon: MessageSquare },
      ],
    },
    {
      title: 'Administratif',
      links: [
        { href: '/student/jobs', label: 'Espace Carrière', icon: Briefcase },
        { href: '/student/enterprise', label: 'Accès Entreprise', icon: Building },
        { href: '/student/documents', label: 'Documents', icon: FileText },
      ],
    },
  ],
  professor: [
    { href: '/professor/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/professor/courses', label: 'Mes cours', icon: BookOpen },
    { href: '/professor/timetable', label: 'Planning', icon: Calendar },
    { href: '/professor/evaluations', label: 'Évaluations', icon: ClipboardCheck },
    { href: '/professor/results', label: 'Notes & Résultats', icon: GraduationCap },
    {
      title: 'Pédagogique',
      links: [
        { href: '#', label: 'Mes étudiants', icon: Users },
        { href: '/professor/messages', label: 'Messages', icon: MessageSquare },
        { href: '#', label: 'Ressources', icon: FolderOpen },
      ],
    },
    {
      title: 'Administratif',
      links: [
        { href: '#', label: 'Présences', icon: UserCheck },
        { href: '#', label: 'Rapports', icon: FileText },
        { href: '#', label: 'Paramètres', icon: Settings },
      ],
    },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Gestion des utilisateurs', icon: Users },
    { href: '/admin/courses', label: 'Gestion des cours', icon: BookOpen },
    { href: '/admin/evaluations', label: 'Gestion des évaluations', icon: ClipboardCheck },
    { href: '#', label: 'Statistiques', icon: PieChart },
    { href: '#', label: 'Sécurité', icon: Shield },
  ],
  'academic-advisor': [
    { href: '/academic-advisor/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Étudiants', icon: Users },
    { href: '#', label: 'Enseignants', icon: UserCheck },
    { href: '/academic-advisor/courses', label: 'Cours & Programmes', icon: BookOpen },
    { href: '#', label: 'Planning Global', icon: Calendar },
    {
      title: 'Gestion',
      links: [
        { href: '#', label: 'Validations', icon: Vote },
        { href: '#', label: 'Alertes', icon: AlertTriangle },
        { href: '#', label: 'Salles', icon: DoorOpen },
        { href: '#', label: 'Inscriptions', icon: UserPlus },
        { href: '#', label: 'Scolarité', icon: CreditCard },
        { href: '#', label: 'Bulletins & Résultats', icon: FileStack },
      ],
    },
    {
      title: 'Communication',
      links: [
        { href: '#', label: 'Messagerie', icon: MessageSquare },
        { href: '#', label: 'Annonces', icon: Megaphone },
      ],
    },
     {
      title: 'Rapports',
      links: [
        { href: '#', label: 'Statistiques', icon: PieChart },
        { href: '#', label: 'Rapports', icon: FileBarChart },
        { href: '#', label: 'Exports', icon: Download },
      ],
    },
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
  { href: '/student/settings', label: 'Paramètres', icon: Settings },
  { href: '/', label: 'Déconnexion', icon: LogOut },
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
  email: 'alex.dupont@uni-verx.edu',
  password: 'password123',
  birthDate: '01/01/2002',
  birthPlace: 'Abidjan',
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
    name: 'M. Jean Moreau',
    avatar: 'https://i.pravatar.cc/100?img=25',
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
      course: 'Histoire', 
      location: 'Salle 202', 
      type: 'cours',
      instructor: 'Dr. Indiana Jones',
      presenceStatus: 'pending',
      isPast: true,
    }
  ],
  professor: [
    { 
      id: 3, 
      time: '09:00 - 11:00', 
      course: 'Calcul Avancé', 
      location: 'Amphi A', 
      type: 'cours',
      instructor: 'Dr. Alan Turing',
      presenceStatus: 'na',
    },
    { 
      id: 4, 
      time: '11:00 - 12:00', 
      course: 'Réunion Pédagogique', 
      location: 'Salle des profs', 
      type: 'activité',
      instructor: 'Direction',
      presenceStatus: 'na',
    },
    { 
        id: 8, 
        time: '10:30 - 12:00', 
        course: 'Introduction à la programmation',
        location: 'Salle 101', 
        type: 'cours',
        instructor: 'Dr. Alan Turing',
        presenceStatus: 'na',
    },
    { 
        id: 9, 
        time: '08:30 - 10:00',
        course: 'Club de Robotique',
        location: 'Atelier Tech', 
        type: 'activité',
        instructor: 'Dr. Alan Turing',
        presenceStatus: 'na',
    }
  ],
  admin: [
     { 
      id: 5, 
      time: '10:00 - 11:00', 
      course: 'Conseil d\'administration', 
      location: 'Salle du conseil', 
      type: 'activité',
      instructor: 'Le Recteur',
      presenceStatus: 'na',
    }
  ],
  'academic-advisor': [],
  secretariat: [],
  rectorate: [],
  'erp-provider': [],
};

export const courses = {
  student: [
    { id: 1, title: 'Mathématiques Avancées', code: 'MATH-301', instructor: 'Dr. Alan Turing', thumbnailId: 'course-thumb-1' },
    { id: 2, title: 'Physique Quantique', code: 'PHY-310', instructor: 'Dr. Marie Curie', thumbnailId: 'course-thumb-2' },
    { id: 3, title: 'Histoire du 20ème Siècle', code: 'HIST-205', instructor: 'Dr. Indiana Jones', thumbnailId: 'course-thumb-3' },
  ],
  professor: [
    { id: 1, title: 'Mathématiques Avancées', code: 'MATH-301', students: 45, thumbnailId: 'course-thumb-1' },
    { id: 4, title: 'Théorie de la Littérature', code: 'LIT-401', students: 30, thumbnailId: 'course-thumb-4' },
  ],
  admin: [],
  'academic-advisor': [],
  secretariat: [],
  rectorate: [],
  'erp-provider': [],
};

export const messages = [
  { id: 1, sender: 'Dr. Évelyne Dubois', subject: 'Rappel : Examen de mi-semestre', time: '10:42' },
  { id: 2, sender: 'Administration', subject: 'Annonce importante : Fermeture du campus', time: 'Hier' },
  { id: 3, sender: 'Club de Robotique', subject: 'Prochaine réunion : Projet Mars Rover', time: 'Hier' },
];






