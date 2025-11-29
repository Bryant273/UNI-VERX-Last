
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

export type PaymentStatus = 'paid' | 'pending' | 'late';

export interface PaymentHistoryItem {
  id: string;
  description: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: PaymentStatus;
  receiptUrl?: string;
}

interface StudentPaymentHistory {
  studentId: string;
  academicYear: string;
  summary: {
    total: number;
    paid: number;
    remaining: number;
  };
  installments: PaymentHistoryItem[];
}

export const studentPaymentHistory: StudentPaymentHistory = {
  studentId: "ETU-2024-12345",
  academicYear: "2024-2025",
  summary: {
    total: 1500000,
    paid: 750000,
    remaining: 750000,
  },
  installments: [
    {
      id: 'ins-1',
      description: "Frais d'inscription",
      dueDate: '30/09/2024',
      paidDate: '15/09/2024',
      amount: 250000,
      status: 'paid',
      receiptUrl: '#',
    },
    {
      id: 'ins-2',
      description: "1ère Tranche - Scolarité",
      dueDate: '31/10/2024',
      paidDate: '28/10/2024',
      amount: 500000,
      status: 'paid',
      receiptUrl: '#',
    },
    {
      id: 'ins-3',
      description: "2ème Tranche - Scolarité",
      dueDate: '31/01/2025',
      paidDate: null,
      amount: 500000,
      status: 'pending',
    },
    {
      id: 'ins-4',
      description: "Solde - Scolarité",
      dueDate: '31/03/2025',
      paidDate: null,
      amount: 250000,
      status: 'pending',
    },
  ],
};


export const getStatusConfig = (status: PaymentStatus) => {
    const config: { [key in PaymentStatus]: { label: string; icon: LucideIcon; color: string } } = {
        paid: { label: 'Payé', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
        pending: { label: 'À payer', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
        late: { label: 'En retard', icon: AlertTriangle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    };
    return config[status];
};
