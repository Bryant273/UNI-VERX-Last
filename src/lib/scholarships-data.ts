
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export type PaymentStatus = 'paid' | 'partial' | 'late';

export interface StudentPayment {
  id: number;
  studentId: string;
  name: string;
  class: string;
  avatar: string;
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  lastPaymentDate: string | null;
}

export const scholarshipsData: StudentPayment[] = [
  {
    id: 1, studentId: "22305001", name: "Alexandre Martin", class: "L3 Informatique",
    avatar: "https://i.pravatar.cc/100?img=1", totalAmount: 1500000, paidAmount: 1500000,
    status: "paid", lastPaymentDate: "2025-04-15"
  },
  {
    id: 2, studentId: "21405002", name: "Sophie Dubois", class: "M1 Informatique",
    avatar: "https://i.pravatar.cc/100?img=2", totalAmount: 2000000, paidAmount: 1000000,
    status: "partial", lastPaymentDate: "2025-02-20"
  },
  {
    id: 3, studentId: "23205003", name: "Thomas Bernard", class: "L2 Informatique",
    avatar: "https://i.pravatar.cc/100?img=3", totalAmount: 1200000, paidAmount: 500000,
    status: "late", lastPaymentDate: "2024-11-10"
  },
  {
    id: 4, studentId: "22305004", name: "Emma Moreau", class: "L3 Informatique",
    avatar: "https://i.pravatar.cc/100?img=4", totalAmount: 1500000, paidAmount: 1500000,
    status: "paid", lastPaymentDate: "2025-01-10"
  },
  {
    id: 5, studentId: "24105005", name: "Lucas Petit", class: "L1 Informatique",
    avatar: "https://i.pravatar.cc/100?img=5", totalAmount: 1000000, paidAmount: 500000,
    status: "partial", lastPaymentDate: "2025-03-01"
  },
  {
    id: 6, studentId: "22305006", name: "Léa Garcia", class: "L3 Informatique",
    avatar: "https://i.pravatar.cc/100?img=6", totalAmount: 1500000, paidAmount: 750000,
    status: "late", lastPaymentDate: "2024-12-15"
  }
];

export const getStatusConfig = (status: PaymentStatus) => {
    const config: { [key in PaymentStatus]: { label: string; icon: LucideIcon; color: string } } = {
        paid: { label: 'Payé', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
        partial: { label: 'Partiel', icon: Clock, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
        late: { label: 'En retard', icon: AlertTriangle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    };
    return config[status];
};
