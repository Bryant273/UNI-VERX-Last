
export type PaymentStatus = 'paid' | 'pending';

export interface ProfessorPayment {
  id: string;
  date: string; // ISO 8601 format: 'YYYY-MM-DD'
  description: string;
  amount: number;
  status: PaymentStatus;
  invoiceUrl: string;
}

export const professorPayments: ProfessorPayment[] = [
  { id: 'PAY-001', date: '2025-04-30', description: 'Salaire - Avril 2025', amount: 1250000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-002', date: '2025-03-31', description: 'Salaire - Mars 2025', amount: 1250000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-003', date: '2025-03-15', description: 'Prime de recherche', amount: 300000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-004', date: '2025-02-28', description: 'Salaire - Février 2025', amount: 1250000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-005', date: '2025-01-31', description: 'Salaire - Janvier 2025', amount: 1250000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-006', date: '2025-01-10', description: 'Heures supplémentaires - Déc 2024', amount: 175000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-007', date: '2024-12-31', description: 'Salaire - Décembre 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-008', date: '2024-11-30', description: 'Salaire - Novembre 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-009', date: '2024-10-31', description: 'Salaire - Octobre 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-010', date: '2024-09-30', description: 'Salaire - Septembre 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-011', date: '2024-08-31', description: 'Salaire - Août 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
  { id: 'PAY-012', date: '2024-07-31', description: 'Salaire - Juillet 2024', amount: 1200000, status: 'paid', invoiceUrl: '#' },
];
