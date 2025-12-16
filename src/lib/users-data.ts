'use client';
import type { LucideIcon } from 'lucide-react';
import { UserCheck, UserX, Clock, Archive } from 'lucide-react';

export type UserStatus = 'active' | 'suspended' | 'archived';

export interface UniversityUser {
    id: number;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    address: string;
    role: 'student' | 'professor' | 'academic-advisor' | 'secretariat' | 'rectorate' | 'admin' | 'erp-provider';
    status: UserStatus;
    lastLogin: string;
    creationDate: string;
    activity: { date: string; action: string; }[];
}

export const usersData: UniversityUser[] = [
    { id: 1, name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', email: 'sarah.dupont@uni-verx.edu', phone: '0612345678', address: '12 rue de la Paix, 75001 Paris', role: 'student', status: 'active', lastLogin: 'Aujourd\'hui 14:30', creationDate: '01/09/2023', activity: [{date: '2025-05-28', action: 'Connexion'}] },
    { id: 2, name: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', email: 'claire.dubois@uni-verx.edu', phone: '0612345679', address: '34 Av. des Champs-Élysées, 75008 Paris', role: 'professor', status: 'active', lastLogin: 'Aujourd\'hui 11:15', creationDate: '01/09/2018', activity: [{date: '2025-05-28', action: 'Dépôt de cours'}] },
    { id: 3, name: 'M. Jean Moreau', avatar: 'https://i.pravatar.cc/100?img=25', email: 'jean.moreau@uni-verx.edu', phone: '0612345680', address: '56 Bd Saint-Germain, 75005 Paris', role: 'academic-advisor', status: 'active', lastLogin: 'Hier 17:00', creationDate: '01/09/2020', activity: [{date: '2025-05-27', action: 'Validation de notes'}] },
    { id: 4, name: 'Lucas Bernard', avatar: 'https://i.pravatar.cc/100?img=15', email: 'lucas.bernard@uni-verx.edu', phone: '0612345681', address: '78 Rue de Rivoli, 75004 Paris', role: 'secretariat', status: 'active', lastLogin: 'Aujourd\'hui 15:00', creationDate: '01/09/2022', activity: [{date: '2025-05-28', action: 'Création utilisateur'}] },
    { id: 5, name: 'Samuel Morin', avatar: 'https://i.pravatar.cc/100?img=68', email: 'samuel.morin@uni-verx.edu', phone: '0612345682', address: '99 Rue du Faubourg Saint-Honoré, 75008 Paris', role: 'admin', status: 'active', lastLogin: 'Aujourd\'hui 15:10', creationDate: '01/09/2015', activity: [{date: '2025-05-28', action: 'Maintenance système'}] },
    { id: 6, name: 'Isabelle Moreau', avatar: 'https://i.pravatar.cc/100?img=33', email: 'isabelle.moreau@uni-verx.edu', phone: '0612345683', address: '1 Place du Panthéon, 75005 Paris', role: 'rectorate', status: 'active', lastLogin: 'Il y a 2 jours', creationDate: '01/09/2019', activity: [{date: '2025-05-26', action: 'Publication annonce'}] },
    { id: 7, name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', email: 'thomas.mercier@uni-verx.edu', phone: '0612345684', address: '22 Rue de la Verrerie, 75004 Paris', role: 'student', status: 'suspended', lastLogin: 'Il y a 1 semaine', creationDate: '01/09/2023', activity: [{date: '2025-05-21', action: 'Connexion échouée'}] },
    { id: 8, name: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', email: 'prof.martin@uni-verx.edu', phone: '0612345685', address: '45 Rue des Écoles, 75005 Paris', role: 'professor', status: 'archived', lastLogin: 'Il y a 6 mois', creationDate: '01/09/2010', activity: [{date: '2024-11-28', action: 'Déconnexion'}] },
];

const firstNames = ["Léa", "Manon", "Chloé", "Louis", "Gabriel", "Jules", "Hugo", "Alice", "Rose", "Louise", "Adam", "Arthur", "Raphaël"];
const lastNames = ["Garcia", "Rodriguez", "Gomez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gonzalez", "Martin", "Bernard", "Dubois"];

for (let i = 9; i <= 35; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const name = `${firstName} ${lastName}`;
    
    const average = parseFloat((8 + (i * 13) % 12 + ((i * 7) % 100) / 100).toFixed(2));
    const attendance = 70 + (i * 17) % 31;
    
    let status: UserStatus = 'active';
    if (i % 5 === 0) status = 'suspended';
    if (i % 10 === 0) status = 'archived';

    const roles: UniversityUser['role'][] = ['student', 'professor', 'student'];
    const randomClass = roles[i % roles.length];

    usersData.push({
        id: i,
        name: name,
        avatar: `https://i.pravatar.cc/100?img=${30+i}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@uni-verx.edu`,
        phone: `06${String(Math.floor(Math.random()*100000000)).padStart(8,'0')}`,
        address: `${i} rue de l'Exemple, 75000 Paris`,
        role: randomClass,
        status: status,
        lastLogin: `Il y a ${1 + (i % 5)} jours`,
        creationDate: `01/09/202${i%5}`,
        activity: [{date: `2025-05-${28 - (i%7)}`, action: 'Connexion'}]
    });
}

export const roleConfig: Record<UniversityUser['role'], { label: string; description: string; permissions: string[] }> = {
    student: { 
        label: 'Étudiant', 
        description: 'Accès aux cours, notes, emploi du temps et services étudiants.',
        permissions: ['read:own_courses', 'read:own_grades', 'submit:assignments']
    },
    professor: { 
        label: 'Professeur', 
        description: 'Gestion des cours, saisie des notes, communication avec les étudiants.',
        permissions: ['manage:courses', 'manage:grades', 'read:student_profiles']
    },
    'academic-advisor': { 
        label: 'Resp. Pédagogique', 
        description: 'Supervision des programmes, suivi des étudiants et validation des maquettes.',
        permissions: ['validate:programs', 'read:all_student_data', 'manage:teachers']
    },
    secretariat: { 
        label: 'Secrétariat', 
        description: 'Gestion administrative des dossiers, inscriptions et documents officiels.',
        permissions: ['manage:student_files', 'manage:enrollments', 'generate:documents']
    },
    rectorate: { 
        label: 'Rectorat', 
        description: 'Pilotage stratégique, supervision globale, gestion budgétaire.',
        permissions: ['read:all_data', 'manage:budgets', 'manage:departments']
    },
    admin: { 
        label: 'Admin Université', 
        description: 'Contrôle total sur la plateforme, gestion des utilisateurs et permissions.',
        permissions: ['manage:all']
    },
    'erp-provider': { 
        label: 'Fournisseur ERP', 
        description: 'Maintenance technique, supervision du système et intégrations.',
        permissions: ['system:maintenance', 'system:monitoring']
    },
};

export const statusConfig: Record<UserStatus, { label: string; icon: LucideIcon; color: string; }> = {
    active: { label: 'Actif', icon: UserCheck, color: 'text-green-600' },
    suspended: { label: 'Suspendu', icon: Clock, color: 'text-orange-600' },
    archived: { label: 'Archivé', icon: Archive, color: 'text-gray-600' },
};