

import type { LucideIcon } from 'lucide-react';
import { FileText, Award, Building, Briefcase, GraduationCap, User, Home, ImageIcon, FileQuestion, FileCheck2, FileArchive, BookOpen } from 'lucide-react';

export type DocumentType = 'cv' | 'lettre-motivation' | 'cni' | 'justificatif-domicile' | 'photo-identite' | 'autre-perso' | 'diplome' | 'certificat' | 'attestation' | 'releve-notes' | 'certificat-scolarite' | 'convention-stage' | 'facture' | 'contrat-stage' | 'guide-accueil';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  description: string;
  status: 'uploaded' | 'missing';
  category: 'personal' | 'academic' | 'administrative' | 'professional';
  date?: string; // upload or issue date
}

export const documentConfig: Record<DocumentType, { label: string; icon: LucideIcon; color: string }> = {
    // Personal
    cv: { label: 'CV', icon: User, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' },
    'lettre-motivation': { label: 'Lettre', icon: FileText, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
    cni: { label: 'CNI', icon: User, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
    'justificatif-domicile': { label: 'Domicile', icon: Home, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' },
    'photo-identite': { label: 'Photo', icon: ImageIcon, color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400' },
    'autre-perso': { label: 'Autre', icon: FileQuestion, color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400' },
    // Diplomas
    diplome: { label: 'Diplôme', icon: Award, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    certificat: { label: 'Certificat', icon: Award, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    attestation: { label: 'Attestation', icon: FileCheck2, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400' },
    // University
    'releve-notes': { label: 'Relevé', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
    'certificat-scolarite': { label: 'Scolarité', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400' },
    'convention-stage': { label: 'Convention', icon: Briefcase, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400' },
    facture: { label: 'Facture', icon: FileArchive, color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-400' },
    // Enterprise
    'contrat-stage': { label: 'Contrat', icon: Building, color: 'text-lime-600 bg-lime-100 dark:bg-lime-900/30 dark:text-lime-400' },
    'guide-accueil': { label: 'Guide', icon: BookOpen, color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400' },
};


export const personalDocuments: Document[] = [
  { id: 'perso-1', type: 'cv', name: 'CV_Sarah_Dupont_2025.pdf', description: 'CV pour candidatures de stage. Format PDF privilégié.', status: 'uploaded', category: 'personal', date: '12/05/2025' },
  { id: 'perso-2', type: 'lettre-motivation', name: 'Lettre_Motivation_Generique.docx', description: 'Modèle de lettre de motivation. Format PDF ou DOCX.', status: 'uploaded', category: 'personal', date: '10/05/2025' },
  { id: 'perso-3', type: 'cni', name: 'CNI_Sarah_Dupont.pdf', description: 'Scan de la Carte Nationale d\'Identité (recto/verso).', status: 'uploaded', category: 'personal', date: '01/03/2025' },
  { id: 'perso-4', type: 'justificatif-domicile', name: 'Justificatif_Domicile.pdf', description: 'Facture d\'électricité de moins de 3 mois.', status: 'missing', category: 'personal' },
  { id: 'perso-5', type: 'photo-identite', name: 'Photo_Identite.jpg', description: 'Photo d\'identité officielle. Format image (.jpg, .png).', status: 'missing', category: 'personal' },
];

export const diplomaDocuments: Document[] = [
  { id: 'diplo-1', type: 'diplome', name: 'Baccalaureat_2022.pdf', description: 'Diplôme du Baccalauréat général, Mention Très Bien.', status: 'uploaded', category: 'academic', date: '05/07/2022' },
  { id: 'diplo-2', type: 'certificat', name: 'Certif_Python_Avance.pdf', description: 'Certification "Python for Data Science" de Coursera.', status: 'uploaded', category: 'professional', date: '18/11/2024' },
  { id: 'diplo-3', type: 'attestation', name: 'Attestation_TOEIC_825.pdf', description: 'Attestation de score TOEIC (825 points).', status: 'uploaded', category: 'academic', date: '20/02/2025' },
  { id: 'diplo-4', type: 'diplome', name: 'DEUG_MIAS_2024.pdf', description: 'Diplôme d\'Études Universitaires Générales, MIAS.', status: 'missing', category: 'academic' },
];

export const universityDocuments: Document[] = [
  { id: 'uni-1', type: 'certificat-scolarite', name: 'Certificat_Scolarite_2024-2025.pdf', description: 'Certificat de scolarité pour l\'année en cours, fourni par l\'université.', status: 'uploaded', category: 'administrative', date: '01/09/2024' },
  { id: 'uni-2', type: 'convention-stage', name: 'Convention_Stage_TechSolutions.pdf', description: 'Convention pré-remplie à faire signer par l\'entreprise.', status: 'uploaded', category: 'professional', date: '14/05/2025' },
  { id: 'uni-3', type: 'releve-notes', name: 'Releve_Notes_S1.pdf', description: 'Relevé de notes officiel du Semestre 1.', status: 'uploaded', category: 'academic', date: '28/01/2025' },
  { id: 'uni-4', type: 'facture', name: 'Facture_Frais_Scolarite_2024.pdf', description: 'Facture acquittée des frais de scolarité annuels.', status: 'uploaded', category: 'administrative', date: '15/09/2024' },
];

export const enterpriseDocuments: Document[] = [
    { id: 'ent-1', type: 'contrat-stage', name: 'Contrat_Stage_Signe_TechSolutions.pdf', description: 'Contrat de stage signé, fourni par l\'entreprise.', status: 'uploaded', category: 'professional', date: '20/05/2025' },
    { id: 'ent-2', type: 'guide-accueil', name: 'Guide_Accueil_Stagiaire.pdf', description: 'Guide d\'accueil pour les nouveaux stagiaires.', status: 'uploaded', category: 'professional', date: '01/04/2025' },
];
