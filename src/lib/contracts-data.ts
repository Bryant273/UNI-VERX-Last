import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Clock, XCircle, Building, User, FileText } from 'lucide-react';

export type ContractStatus = 'active' | 'expired' | 'pending' | 'terminated';
export type ContractorType = 'employee' | 'subcontractor' | 'consultant';
export type ContractType = 'CDI' | 'CDD' | 'prestation' | 'stage';

export interface Contract {
    id: string;
    contractorName: string;
    contractorType: ContractorType;
    contractType: ContractType;
    roleOrService: string;
    startDate: string;
    endDate: string | null;
    status: ContractStatus;
    amount: number | null;
    currency: 'FCFA' | 'EUR' | 'USD';
    documentUrl: string;
}

export const statusConfig: Record<ContractStatus, { label: string; icon: LucideIcon; color: string; }> = {
    active: { label: 'Actif', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    expired: { label: 'Expiré', icon: XCircle, color: 'text-gray-600 bg-gray-100' },
    pending: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    terminated: { label: 'Résilié', icon: XCircle, color: 'text-red-600 bg-red-100' },
};

export const contractorTypeConfig: Record<ContractorType, { label: string; icon: LucideIcon; }> = {
    employee: { label: 'Employé', icon: User },
    subcontractor: { label: 'Sous-traitant', icon: Building },
    consultant: { label: 'Consultant', icon: Briefcase },
};

export const initialContracts: Contract[] = [
    {
        id: 'CTR-001',
        contractorName: 'Dr. Claire Dubois',
        contractorType: 'employee',
        contractType: 'CDI',
        roleOrService: 'Professeur Chercheur',
        startDate: '2018-09-01',
        endDate: null,
        status: 'active',
        amount: 3500000,
        currency: 'FCFA',
        documentUrl: '#',
    },
    {
        id: 'CTR-002',
        contractorName: 'Clean-Services SARL',
        contractorType: 'subcontractor',
        contractType: 'prestation',
        roleOrService: 'Nettoyage des locaux',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        amount: 15000000,
        currency: 'FCFA',
        documentUrl: '#',
    },
    {
        id: 'CTR-003',
        contractorName: 'M. Jean Martin',
        contractorType: 'employee',
        contractType: 'CDD',
        roleOrService: 'Assistant de recherche',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        status: 'active',
        amount: 850000,
        currency: 'FCFA',
        documentUrl: '#',
    },
    {
        id: 'CTR-004',
        contractorName: 'Web-Innov',
        contractorType: 'subcontractor',
        contractType: 'prestation',
        roleOrService: 'Maintenance du site web',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'expired',
        amount: 8000000,
        currency: 'FCFA',
        documentUrl: '#',
    },
    {
        id: 'CTR-005',
        contractorName: 'Sophie Bernard',
        contractorType: 'consultant',
        contractType: 'prestation',
        roleOrService: 'Audit RGPD',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        status: 'pending',
        amount: 4500,
        currency: 'EUR',
        documentUrl: '#',
    },
];
