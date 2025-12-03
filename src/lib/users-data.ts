'use client';
import type { LucideIcon } from 'lucide-react';
import { UserCheck, UserX, Clock, Archive } from 'lucide-react';

export type UserStatus = 'active' | 'suspended' | 'archived';

export interface UniversityUser {
    id: number;
    name: string;
    avatar: string;
    email: string;
    role: 'student' | 'professor' | 'academic-advisor' | 'secretariat' | 'rectorate' | 'admin' | 'erp-provider';
    status: UserStatus;
    lastLogin: string;
    creationDate: string;
}

export const usersData: UniversityUser[] = [
    { id: 1, name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', email: 'sarah.dupont@uni-verx.edu', role: 'student', status: 'active', lastLogin: 'Aujourd\'hui 14:30', creationDate: '01/09/2023' },
    { id: 2, name: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', email: 'claire.dubois@uni-verx.edu', role: 'professor', status: 'active', lastLogin: 'Aujourd\'hui 11:15', creationDate: '01/09/2018' },
    { id: 3, name: 'M. Jean Moreau', avatar: 'https://i.pravatar.cc/100?img=25', email: 'jean.moreau@uni-verx.edu', role: 'academic-advisor', status: 'active', lastLogin: 'Hier 17:00', creationDate: '01/09/2020' },
    { id: 4, name: 'Lucas Bernard', avatar: 'https://i.pravatar.cc/100?img=15', email: 'lucas.bernard@uni-verx.edu', role: 'secretariat', status: 'active', lastLogin: 'Aujourd\'hui 15:00', creationDate: '01/09/2022' },
    { id: 5, name: 'Samuel Morin', avatar: 'https://i.pravatar.cc/100?img=68', email: 'samuel.morin@uni-verx.edu', role: 'admin', status: 'active', lastLogin: 'Aujourd\'hui 15:10', creationDate: '01/09/2015' },
    { id: 6, name: 'Isabelle Moreau', avatar: 'https://i.pravatar.cc/100?img=33', email: 'isabelle.moreau@uni-verx.edu', role: 'rectorate', status: 'active', lastLogin: 'Il y a 2 jours', creationDate: '01/09/2019' },
    { id: 7, name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', email: 'thomas.mercier@uni-verx.edu', role: 'student', status: 'suspended', lastLogin: 'Il y a 1 semaine', creationDate: '01/09/2023' },
    { id: 8, name: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', email: 'prof.martin@uni-verx.edu', role: 'professor', status: 'archived', lastLogin: 'Il y a 6 mois', creationDate: '01/09/2010' },
];

// Add more users for pagination
for (let i = 9; i <= 35; i++) {
    const roles: UniversityUser['role'][] = ['student', 'professor', 'student'];
    const statuses: UserStatus[] = ['active', 'active', 'suspended', 'active'];
    usersData.push({
        id: i,
        name: `Utilisateur ${i}`,
        avatar: `https://i.pravatar.cc/100?img=${30+i}`,
        email: `user.${i}@uni-verx.edu`,
        role: roles[i % roles.length],
        status: statuses[i % statuses.length],
        lastLogin: `Il y a ${i % 7} jours`,
        creationDate: `01/09/202${i%5}`
    });
}


export const roleConfig: Record<UniversityUser['role'], { label: string; }> = {
    student: { label: 'Étudiant' },
    professor: { label: 'Professeur' },
    'academic-advisor': { label: 'Resp. Pédagogique' },
    secretariat: { label: 'Secrétariat' },
    rectorate: { label: 'Rectorat' },
    admin: { label: 'Admin Université' },
    'erp-provider': { label: 'Fournisseur ERP' },
};

export const statusConfig: Record<UserStatus, { label: string; icon: LucideIcon; color: string; }> = {
    active: { label: 'Actif', icon: UserCheck, color: 'text-green-600' },
    suspended: { label: 'Suspendu', icon: Clock, color: 'text-orange-600' },
    archived: { label: 'Archivé', icon: Archive, color: 'text-gray-600' },
};
