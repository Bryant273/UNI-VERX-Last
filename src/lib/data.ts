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
  type LucideIcon,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export type UserRole = 'student' | 'professor' | 'admin';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navLinks: Record<UserRole, NavLink[]> = {
  student: [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: 'My Courses', icon: BookOpen },
    { href: '#', label: 'Timetable', icon: Calendar },
    { href: '#', label: 'Grades', icon: GraduationCap },
    { href: '#', label: 'Messages', icon: MessageSquare },
    { href: '#', label: 'Documents', icon: FileText },
  ],
  professor: [
    { href: '/professor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: 'My Courses', icon: BookOpen },
    { href: '#', label: 'Students', icon: Users },
    { href: '#', label: 'Grading', icon: ClipboardCheck },
    { href: '#', label: 'Timetable', icon: Calendar },
    { href: '#', label: 'Messages', icon: MessageSquare },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: 'User Management', icon: Users },
    { href: '#', label: 'Course Management', icon: BookOpen },
    { href: '#', label: 'System Analytics', icon: PieChart },
    { href: '#', label: 'Security', icon: Shield },
  ],
};

export const bottomNavLinks: NavLink[] = [
  { href: '#', label: 'Settings', icon: Settings },
  { href: '#', label: 'Logout', icon: LogOut },
];

export const userData = {
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
}

export const messages = [
  { id: 1, sender: 'Dr. Evelyn Reed', subject: 'Mid-term results', time: '10:42 AM' },
  { id: 2, sender: 'University Admin', subject: 'Campus-wide power outage notice', time: 'Yesterday' },
  { id: 3, sender: 'Alex Dupont', subject: 'Question about assignment 3', time: '2 days ago' },
];
