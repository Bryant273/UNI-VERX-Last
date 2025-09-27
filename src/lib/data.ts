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
  FolderKanban,
  File,
  type LucideIcon,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export type UserRole = 
  | 'student' 
  | 'professor' 
  | 'academic-advisor' 
  | 'secretariat' 
  | 'rectorate'
  | 'admin'
  | 'erp-provider';

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

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export const navLinks: Record<UserRole, NavItem[]> = {
  student: [
    { href: '/student/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Mes cours', icon: BookOpen },
    { href: '#', label: 'Emploi du temps', icon: Calendar },
    { href: '#', label: 'Résultats', icon: GraduationCap },
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
    { href: '#', label: 'Mes cours', icon: BookOpen },
    { href: '#', label: 'Étudiants', icon: Users },
    { href: '#', label: 'Évaluations', icon: ClipboardCheck },
    { href: '#', label: 'Emploi du temps', icon: Calendar },
    { href: '#', label: 'Messages', icon: MessageSquare },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Gestion des utilisateurs', icon: Users },
    { href: '#', label: 'Gestion des cours', icon: BookOpen },
    { href: '#', label: 'Statistiques', icon: PieChart },
    { href: '#', label: 'Sécurité', icon: Shield },
  ],
  'academic-advisor': [
    { href: '/academic-advisor/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Programmes', icon: BookOpen },
    { href: '#', label: 'Suivi Étudiants', icon: Users },
  ],
  secretariat: [
    { href: '/secretariat/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '#', label: 'Inscriptions', icon: ClipboardCheck },
    { href: '#', label: 'Gestion Documents', icon: FileCog },
  ],
  rectorate: [
      { href: '/rectorate/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '#', label: 'Statistiques Globales', icon: PieChart },
      { href: '#', label: 'Administration', icon: Building },
  ],
  'erp-provider': [
      { href: '/erp-provider/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '#', label: 'Intégrations', icon: Briefcase },
      { href: '#', label: 'Maintenance', icon: Settings },
  ]
};

export const bottomNavLinks: NavLink[] = [
  { href: '#', label: 'Paramètres', icon: Settings },
  { href: '#', label: 'Déconnexion', icon: LogOut },
];

export const userData: Record<UserRole, { name: string; avatar: string }> = {
  student: {
    name: 'Alex Dupont',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
  },
  professor: {
    name: 'Dr. Evelyn Reed',
    avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-2')?.imageUrl || '',
  },
  admin: {
    name: 'Samuel Carter',
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
    { id: 1, title: 'Advanced Calculus', code: 'MATH301', instructor: 'Dr. Alan Turing', thumbnailId: 'course-thumb-1' },
    { id: 2, title: 'Quantum Physics', code: 'PHY305', instructor: 'Dr. Marie Curie', thumbnailId: 'course-thumb-2' },
    { id: 3, title: 'World History: 20th Century', code: 'HIST210', instructor: 'Dr. Indiana Jones', thumbnailId: 'course-thumb-3' },
  ],
  professor: [
    { id: 1, title: 'Advanced Calculus', code: 'MATH301', students: 45, thumbnailId: 'course-thumb-1' },
    { id: 4, title: 'Literary Theory', code: 'LIT402', students: 30, thumbnailId: 'course-thumb-4' },
  ],
};

export const timetableEvents = {
  student: [
    { id: 1, time: '09:00 - 11:00', course: 'Advanced Calculus', location: 'Hall A' },
    { id: 2, time: '13:00 - 15:00', course: 'Quantum Physics', location: 'Lab 3B' },
  ],
  professor: [
    { id: 1, time: '09:00 - 11:00', course: 'Advanced Calculus', location: 'Hall A' },
    { id: 3, time: '11:00 - 12:00', course: 'Office Hours', location: 'Office 101' },
  ],
  admin: [
    { id: 4, time: '10:00 - 11:00', course: 'Faculty Meeting', location: 'Conference Room 1' },
    { id: 5, time: '14:00 - 15:00', course: 'Budget Review', location: 'Admin Building' },
  ],
  'academic-advisor': [],
  secretariat: [],
  rectorate: [],
  'erp-provider': [],
}

export const messages = [
  { id: 1, sender: 'Dr. Evelyn Reed', subject: 'Mid-term results', time: '10:42 AM' },
  { id: 2, sender: 'University Admin', subject: 'Campus-wide power outage notice', time: 'Yesterday' },
  { id: 3, sender: 'Alex Dupont', subject: 'Question about assignment 3', time: '2 days ago' },
];
