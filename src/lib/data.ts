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
    { href: '/student/courses', label: 'Mes cours', icon: BookOpen },
    { href: '/student/timetable', label: 'Emploi du temps', icon: Calendar },
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

export type TimetableEventType = 'cours' | 'devoir' | 'examen' | 'activité' | 'td' | 'tp';
export type PresenceStatus = 'validated' | 'pending' | 'absent' | 'na';

export interface TimetableEvent {
  id: number;
  time: string;
  course: string;
  location: string;
  type: TimetableEventType;
  instructor?: string;
  fileLink?: string;
  profComment?: string;
  presenceStatus?: PresenceStatus;
  isPast?: boolean;
}

const allEvents: Record<UserRole, TimetableEvent[]> = {
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


// Function to get the current or next event for a user
export const getActiveEvent = (role: UserRole): TimetableEvent | null => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes from midnight

  const userEvents = allEvents[role];

  if (!userEvents || userEvents.length === 0) {
    return null;
  }

  // Find the first event that is currently happening
  const activeEvent = userEvents.find(event => {
    if (event.isPast) return false;
    const [startTime, endTime] = event.time.split(' - ').map(t => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    });
    return currentTime >= startTime && currentTime < endTime;
  });

  if (activeEvent) {
    return activeEvent;
  }
  
  return null; // Return null if no event is currently active
};


export const messages = [
  { id: 1, sender: 'Dr. Évelyne Dubois', subject: 'Résultats de mi-semestre', time: '10:42' },
  { id: 2, sender: 'Administration', subject: 'Avis de coupure de courant sur le campus', time: 'Hier' },
  { id: 3, sender: 'Alex Dupont', subject: 'Question sur le devoir 3', time: 'Il y a 2 jours' },
];

export type DocumentType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip';

export interface CourseDocument {
  id: number;
  date: string;
  module: string;
  documentName: string;
  type: DocumentType;
  uploader: string;
  fileUrl: string;
}

export const courseDocuments: CourseDocument[] = [
  { id: 1, date: '10/05/2025', module: 'Bases de Données', documentName: 'Cours SQL Avancé.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/cours-sql.pdf' },
  { id: 2, date: '05/05/2025', module: 'Algorithmique', documentName: 'TD Algorithmes de graphes.docx', type: 'docx', uploader: 'Prof. Michel Martin', fileUrl: '/documents/td-graphes.docx' },
  { id: 3, date: '02/05/2025', module: 'Programmation', documentName: 'Exemples de code.zip', type: 'zip', uploader: 'Dr. Thomas Laurent', fileUrl: '/documents/exemples-code.zip' },
  { id: 4, date: '28/04/2025', module: 'Développement Web', documentName: 'Introduction JavaScript.pptx', type: 'pptx', uploader: 'Prof. Jean Leroy', fileUrl: '/documents/intro-js.pptx' },
  { id: 5, date: '25/04/2025', module: 'Réseaux', documentName: 'Planning laboratoire réseau.xlsx', type: 'xlsx', uploader: 'Dr. Laurent Rivière', fileUrl: '/documents/planning-reseau.xlsx' },
  { id: 6, date: '22/04/2025', module: 'Bases de Données', documentName: 'Introduction NoSQL.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/intro-nosql.pdf' },
  { id: 7, date: '18/04/2025', module: 'Algorithmique', documentName: 'Complexité algorithmique.pdf', type: 'pdf', uploader: 'Prof. Michel Martin', fileUrl: '/documents/complexite.pdf' },
];
