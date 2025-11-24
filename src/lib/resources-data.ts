
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  File,
  Presentation,
  FileImage,
  Video,
  AudioLines,
  Code,
  Archive,
  Link,
  Folder,
} from 'lucide-react';

export type ResourceType = 'folder' | 'pdf' | 'doc' | 'ppt' | 'img' | 'video' | 'audio' | 'code' | 'archive' | 'link';
export type ResourceCategory = 'course' | 'exercise' | 'exam' | 'correction' | 'reference' | '';

export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  subject: string;
  category: ResourceCategory;
  size: string;
  views: number;
  modified: string;
  shared: boolean;
  downloadable: boolean;
  description?: string;
}

export const resourceConfig: Record<ResourceType, { icon: LucideIcon; color: string }> = {
  folder: { icon: Folder, color: 'text-yellow-500' },
  pdf: { icon: FileText, color: 'text-red-500' },
  doc: { icon: FileText, color: 'text-blue-500' },
  ppt: { icon: Presentation, color: 'text-orange-500' },
  img: { icon: FileImage, color: 'text-green-500' },
  video: { icon: Video, color: 'text-purple-500' },
  audio: { icon: AudioLines, color: 'text-cyan-500' },
  code: { icon: Code, color: 'text-gray-500' },
  archive: { icon: Archive, color: 'text-amber-500' },
  link: { icon: Link, color: 'text-sky-500' },
};

export const allResources: Resource[] = [
    { id: 1, name: "Bases de Données", type: "folder", subject: "bdd", category: "", size: "42 fichiers", views: 0, modified: "15/05/2025", shared: true, downloadable: true },
    { id: 2, name: "Python Avancé", type: "folder", subject: "python", category: "", size: "38 fichiers", views: 0, modified: "12/05/2025", shared: true, downloadable: true },
    { id: 3, name: "Cours SQL - Jointures", type: "pdf", subject: "bdd", category: "course", size: "2.4 MB", views: 247, modified: "10/05/2025", shared: true, downloadable: true, description: "Introduction aux jointures externes et internes" },
    { id: 4, name: "TD - Classes et Objets", type: "doc", subject: "python", category: "exercise", size: "1.8 MB", views: 189, modified: "08/05/2025", shared: true, downloadable: true, description: "Exercices sur la POO en Python" },
    { id: 5, name: "Tutoriel CSS Grid", type: "video", subject: "web", category: "course", size: "24:36", views: 156, modified: "05/05/2025", shared: true, downloadable: true, description: "Layout avancé avec CSS Grid" },
    { id: 6, name: "Algorithmes de tri", type: "link", subject: "algo", category: "reference", size: "Lien externe", views: 203, modified: "03/05/2025", shared: true, downloadable: false, description: "Documentation interactive sur les algorithmes" },
    { id: 7, name: "Examen BDD 2024", type: "ppt", subject: "bdd", category: "exam", size: "3.2 MB", views: 89, modified: "01/05/2025", shared: false, downloadable: true, description: "Sujets d'examen et barème" },
    { id: 8, name: "Correction TP3", type: "code", subject: "python", category: "correction", size: "156 KB", views: 312, modified: "28/04/2025", shared: true, downloadable: true, description: "Solutions détaillées des exercices" },
    { id: 9, name: "Algorithmique", type: "folder", subject: "algo", category: "", size: "25 fichiers", views: 0, modified: "25/04/2025", shared: true, downloadable: true },
    { id: 10, name: "Introduction à Python", type: "pdf", subject: "python", category: "course", size: "5.1 MB", views: 423, modified: "20/04/2025", shared: true, downloadable: true, description: "Bases de la programmation Python" }
];
