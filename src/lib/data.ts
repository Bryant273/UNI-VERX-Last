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
    { href: '#', label: 'Évaluations', icon: ClipboardCheck },
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

export const bottomNavLinks: NavLink[] = [
  { href: '#', label: 'Paramètres', icon: Settings },
  { href: '#', label: 'Déconnexion', icon: LogOut },
];

export const studentData = {
  id: 'ETU-2024-12345',
  name: 'Alex Dupont',
  class: 'Master 1 - Ingénierie Logicielle',
  avatar: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
  semesters: {
    'Semestre 1': { average: 14.5, totalStudents: 50, rank: 10 },
    'Semestre 2': { average: 15.2, totalStudents: 48, rank: 5 },
  },
  get overallAverage() {
    const semesterAverages = Object.values(this.semesters).map(s => s.average);
    return semesterAverages.reduce((acc, cur) => acc + cur, 0) / semesterAverages.length;
  },
  get overallRank() {
    // This is a simplified rank calculation
    return Math.round(Object.values(this.semesters).reduce((acc, cur) => acc + cur.rank, 0) / Object.values(this.semesters).length);
  },
  get totalStudents() {
    // Assuming the number of students is roughly the same across semesters
    return this.semesters['Semestre 1']?.totalStudents || 0;
  }
};

export const userData: Record<UserRole, { name: string; avatar: string }> = {
  student: {
    name: studentData.name,
    avatar: studentData.avatar,
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

export type TimetableEventType = 'cours' | 'devoir' | 'examen' | 'activité';

export interface TimetableEvent {
  id: number;
  time: string;
  course: string;
  location: string;
  type: TimetableEventType;
}

const allEvents: Record<UserRole, TimetableEvent[]> = {
  student: [
    { id: 1, time: '09:00 - 11:00', course: 'Advanced Calculus', location: 'Hall A', type: 'cours' },
    { id: 2, time: '13:00 - 15:00', course: 'Quantum Physics', location: 'Lab 3B', type: 'cours' },
    { id: 6, time: '15:00 - 16:00', course: 'Devoir de calcul', location: 'À rendre en ligne', type: 'devoir' },
    { id: 7, time: '16:00 - 18:00', course: 'Club de débat', location: 'Salle commune', type: 'activité' },
  ],
  professor: [
    { id: 1, time: '09:00 - 11:00', course: 'Advanced Calculus', location: 'Hall A', type: 'cours' },
    { id: 3, time: '11:00 - 12:00', course: 'Office Hours', location: 'Office 101', type: 'activité' },
    { id: 8, time: '14:00 - 16:00', course: 'Examen de mi-semestre', location: 'Amphi B', type: 'examen' },
  ],
  admin: [
    { id: 4, time: '10:00 - 11:00', course: 'Faculty Meeting', location: 'Conference Room 1', type: 'activité' },
    { id: 5, time: '14:00 - 15:00', course: 'Budget Review', location: 'Admin Building', type: 'activité' },
  ],
  'academic-advisor': [],
  secretariat: [],
  rectorate: [],
  'erp-provider': [],
};


// Function to get the current or next event for a user
export const getActiveEvent = (role: UserRole): TimetableEvent | null => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes from midnight

  const userEvents = allEvents[role];

  if (!userEvents || userEvents.length === 0) {
    return null;
  }

  // Find the first event that is currently happening or is in the future today
  const activeEvent = userEvents.find(event => {
    const [startTime, endTime] = event.time.split(' - ').map(t => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    });
    return currentTime >= startTime && currentTime < endTime;
  });

  // If there's an active event, return it
  if (activeEvent) {
    return activeEvent;
  }

  // Otherwise, find the next upcoming event today
  const upcomingEvent = userEvents
    .filter(event => {
      const [startTime] = event.time.split(' - ').map(t => {
        const [hours, minutes] = t.split(':').map(Number);
        return hours * 60 + minutes;
      });
      return startTime > currentTime;
    })
    .sort((a, b) => {
      const aStartTime = a.time.split(' - ')[0].split(':').map(Number);
      const bStartTime = b.time.split(' - ')[0].split(':').map(Number);
      return (aStartTime[0] * 60 + aStartTime[1]) - (bStartTime[0] * 60 + bStartTime[1]);
    })[0];

  // Return the upcoming event or the first event of the day if nothing else is found
  return upcomingEvent || userEvents[0];
};


export const messages = [
  { id: 1, sender: 'Dr. Evelyn Reed', subject: 'Mid-term results', time: '10:42 AM' },
  { id: 2, sender: 'University Admin', subject: 'Campus-wide power outage notice', time: 'Yesterday' },
  { id: 3, sender: 'Alex Dupont', subject: 'Question about assignment 3', time: '2 days ago' },
];
