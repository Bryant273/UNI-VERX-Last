
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  UserCheck,
  UserPlus,
  AlertTriangle,
  CreditCard,
  Vote,
  FileStack,
  DoorOpen,
  Megaphone,
  PieChart,
  FileBarChart,
  Download,
  CheckCheck,
} from 'lucide-react';
import type { NavItem } from './data';

export const advisorNavLinks: NavItem[] = [
    { href: '/academic-advisor/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/academic-advisor/students', label: 'Étudiants', icon: Users },
    { href: '/academic-advisor/teachers', label: 'Enseignants', icon: UserCheck },
    { href: '/academic-advisor/courses', label: 'Cours & Programmes', icon: BookOpen },
    { href: '/academic-advisor/planning', label: 'Planning Global', icon: Calendar },
    {
      title: 'Gestion',
      links: [
        { href: '/academic-advisor/validations', label: 'Validations', icon: CheckCheck },
        { href: '/academic-advisor/alerts', label: 'Alertes', icon: AlertTriangle },
        { href: '/academic-advisor/rooms', label: 'Salles', icon: DoorOpen },
        { href: '/academic-advisor/enrollments', label: 'Inscriptions', icon: UserPlus },
        { href: '/academic-advisor/scholarships', label: 'Scolarité', icon: CreditCard },
        { href: '/academic-advisor/results', label: 'Bulletins & Résultats', icon: FileStack },
      ],
    },
    {
      title: 'Communication',
      links: [
        { href: '/academic-advisor/messaging', label: 'Messagerie', icon: MessageSquare },
        { href: '/academic-advisor/announcements', label: 'Annonces', icon: Megaphone },
      ],
    },
     {
      title: 'Rapports',
      links: [
        { href: '/academic-advisor/stats', label: 'Statistiques', icon: PieChart },
        { href: '/academic-advisor/reports', label: 'Rapports', icon: FileBarChart },
        { href: '/academic-advisor/exports', label: 'Exports', icon: Download },
      ],
    },
];

export const advisorStats = {
    successRate: 89,
    studentsInDifficulty: 43,
    activeTeachers: 124,
    programs: 27,
};

export const alerts = [
    { id: 1, student: 'Lucas Dupont', level: 'L1', reason: 'Taux d\'absence élevé (35%)', severity: 'high' },
    { id: 2, student: 'Juliette Martin', level: 'M2', reason: 'Chute de moyenne de 4 points', severity: 'high' },
    { id: 3, course: 'Physique Quantique II', level: 'M1', reason: 'En attente de validation', severity: 'medium' },
    { id: 4, student: 'Thomas Leroy', level: 'L3', reason: 'Absence non justifiée à un examen', severity: 'medium' },
];

export const quickAccessLinks = [
    { href: '/academic-advisor/courses', label: 'Gérer les programmes', icon: BookOpen },
    { href: '/academic-advisor/results', label: 'Valider les bulletins', icon: Vote },
    { href: '/academic-advisor/planning', label: 'Voir le planning général', icon: Calendar },
    { href: '/academic-advisor/students', label: 'Consulter un dossier étudiant', icon: Users },
];

export const performanceChartData = [
  { name: '<10', value: 43, fill: 'hsl(var(--destructive))' },
  { name: '10-12', value: 128, fill: 'hsl(var(--chart-4))' },
  { name: '12-14', value: 345, fill: 'hsl(var(--chart-2))' },
  { name: '14-16', value: 256, fill: 'hsl(var(--primary))' },
  { name: '>16', value: 98, fill: 'hsl(var(--chart-1))' },
];

export const enrollmentChartData = [
  { month: "Jan '24", L1: 120, L2: 90, L3: 80, M1: 60, M2: 50 },
  { month: "Fév '24", L1: 125, L2: 95, L3: 82, M1: 63, M2: 51 },
  { month: "Mar '24", L1: 130, L2: 100, L3: 85, M1: 65, M2: 52 },
  { month: "Avr '24", L1: 135, L2: 105, L3: 88, M1: 68, M2: 53 },
  { month: "Mai '24", L1: 140, L2: 110, L3: 90, M1: 70, M2: 55 },
];

export const enrollmentChartConfig = {
  L1: { label: 'L1', color: 'hsl(var(--chart-1))' },
  L2: { label: 'L2', color: 'hsl(var(--chart-2))' },
  L3: { label: 'L3', color: 'hsl(var(--chart-3))' },
  M1: { label: 'M1', color: 'hsl(var(--chart-4))' },
  M2: { label: 'M2', color: 'hsl(var(--chart-5))' },
};
