
'use client';
import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Briefcase, FileCheck2, FileText, CheckCheck } from 'lucide-react';

export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    isCustomized: boolean;
    lastModified?: string;
}

export const templatesData: DocumentTemplate[] = [
    {
        id: 'tpl_cert_scol',
        name: 'Certificat de Scolarité',
        description: 'Atteste de l\'inscription d\'un étudiant pour une année donnée.',
        icon: GraduationCap,
        isCustomized: true,
        lastModified: '15/01/2025'
    },
    {
        id: 'tpl_releve_notes',
        name: 'Relevé de Notes',
        description: 'Détaille les notes obtenues par un étudiant pour un semestre ou une année.',
        icon: FileText,
        isCustomized: false,
    },
    {
        id: 'tpl_attestation_reussite',
        name: 'Attestation de Réussite',
        description: 'Confirme la validation de l\'année ou du diplôme par un étudiant.',
        icon: CheckCheck,
        isCustomized: false,
    },
    {
        id: 'tpl_convention_stage',
        name: 'Convention de Stage',
        description: 'Cadre légal et pédagogique pour les stages en entreprise.',
        icon: Briefcase,
        isCustomized: true,
        lastModified: '02/02/2025'
    },
    {
        id: 'tpl_attestation_presence',
        name: 'Attestation de Présence',
        description: 'Document prouvant la présence à un cours, examen ou évènement.',
        icon: FileCheck2,
        isCustomized: false,
    },
];
