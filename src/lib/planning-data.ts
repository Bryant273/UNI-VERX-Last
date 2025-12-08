import type { LucideIcon } from 'lucide-react';
import { Projector, Users, Mic, Tv, Wind, FlaskConical, Monitor, BookOpen, Clock, CheckCircle } from 'lucide-react';
import type { TimetableEventType } from './data';

export interface Room {
    id: string;
    name: string;
    capacity: number;
    equipment: Array<{ name: string; icon: LucideIcon }>;
}

export interface Teacher {
    id: string;
    name: string;
}

export interface Module {
    id: string;
    name: string;
}

export interface UniversityClass {
    id: string;
    name: string;
    studentCount: number;
}

export interface TimetableEvent {
    id: string;
    day: string; // Lundi, Mardi, etc.
    time: string; // "08:30 - 10:00", etc.
    moduleId: string;
    type: TimetableEventType;
    teacherId: string;
    roomId: string;
    classId: string;
}

export const roomsData: Room[] = [
    { id: 'amphi-a', name: 'Amphi A', capacity: 150, equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Micro', icon: Mic}] },
    { id: 'amphi-b', name: 'Amphi B', capacity: 120, equipment: [{name: 'Projecteur', icon: Projector}] },
    { id: 'salle-101', name: 'Salle 101', capacity: 40, equipment: [{name: 'TV', icon: Tv}] },
    { id: 'salle-102', name: 'Salle 102', capacity: 40, equipment: [{name: 'Projecteur', icon: Projector}] },
    { id: 'salle-201', name: 'Salle 201', capacity: 30, equipment: [] },
    { id: 'salle-202', name: 'Salle 202', capacity: 30, equipment: [] },
    { id: 'labo-info-1', name: 'Labo Info 1', capacity: 25, equipment: [{name: 'PC', icon: Monitor}] },
    { id: 'labo-info-2', name: 'Labo Info 2', capacity: 25, equipment: [{name: 'PC', icon: Monitor}] },
    { id: 'labo-chimie', name: 'Labo Chimie', capacity: 20, equipment: [{name: 'Hotte', icon: Wind}, {name: 'Paillasse', icon: FlaskConical}] },
];

export const teachersData: Teacher[] = [
    { id: 'prof-dubois', name: 'Prof. Dubois' },
    { id: 'prof-laurent', name: 'Prof. Laurent' },
    { id: 'prof-girard', name: 'Prof. Girard' },
    { id: 'prof-bernard', name: 'Prof. Bernard' },
    { id: 'prof-richard', name: 'Prof. Richard' },
    { id: 'prof-leroy', name: 'Prof. Leroy' },
];

export const modulesData: Module[] = [
    { id: 'math-discrete', name: 'Mathématiques Discrètes' },
    { id: 'algo-avancee', name: 'Algorithmique Avancée' },
    { id: 'prog-oo', name: 'Programmation Orientée Objet' },
    { id: 'bdd', name: 'Bases de Données' },
    { id: 'dev-web', name: 'Développement Web' },
    { id: 'ia', name: 'Intelligence Artificielle' },
    { id: 'reseaux', name: 'Réseaux' },
];

export const classesData: UniversityClass[] = [
    { id: 'l1-info', name: 'L1 Informatique', studentCount: 120 },
    { id: 'l2-info', name: 'L2 Informatique', studentCount: 110 },
    { id: 'l3-info', name: 'L3 Informatique', studentCount: 89 },
    { id: 'm1-info', name: 'M1 Informatique', studentCount: 50 },
    { id: 'l3-math', name: 'L3 Mathématiques', studentCount: 75 },
];

export const initialEvents: TimetableEvent[] = [
    { id: 'event-1', day: 'Lundi', time: '08:30 - 10:00', moduleId: 'math-discrete', type: 'cours', teacherId: 'prof-dubois', roomId: 'amphi-a', classId: 'l3-info' },
    { id: 'event-2', day: 'Mercredi', time: '08:30 - 10:00', moduleId: 'prog-oo', type: 'cours', teacherId: 'prof-laurent', roomId: 'amphi-b', classId: 'l3-info' },
    { id: 'event-3', day: 'Mardi', time: '10:30 - 12:00', moduleId: 'ia', type: 'td', teacherId: 'prof-richard', roomId: 'salle-202', classId: 'l3-info' },
    { id: 'event-4', day: 'Jeudi', time: '15:30 - 17:00', moduleId: 'reseaux', type: 'examen', teacherId: 'prof-leroy', roomId: 'salle-101', classId: 'l3-info' },
    { id: 'event-5', day: 'Vendredi', time: '10:30 - 12:00', moduleId: 'dev-web', type: 'tp', teacherId: 'prof-girard', roomId: 'labo-info-1', classId: 'l3-info' },
];

export const getEventTypeName = (type: TimetableEventType) => {
    const names: Record<TimetableEventType, string> = {
        cours: 'Cours',
        td: 'TD',
        tp: 'TP',
        examen: 'Examen',
        devoir: 'Devoir',
        activité: 'Activité',
    };
    return names[type] || 'Évènement';
};

export const eventTypeColors: Record<TimetableEventType, { border: string; bg: string; text: string }> = {
    cours: { border: 'border-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    td: { border: 'border-green-500', bg: 'bg-green-500/10 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    tp: { border: 'border-orange-500', bg: 'bg-orange-500/10 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
    examen: { border: 'border-red-500', bg: 'bg-red-500/10 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
    activité: { border: 'border-purple-500', bg: 'bg-purple-500/10 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    devoir: { border: 'border-yellow-500', bg: 'bg-yellow-500/10 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
};