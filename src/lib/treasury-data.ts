'use client';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Clock, XCircle, Building, Briefcase } from 'lucide-react';

// Types for Incomes
export type IncomeStatus = 'completed' | 'pending';
export type IncomeType = 'tuition' | 'fees' | 'donation' | 'other';

export interface Income {
  id: string;
  date: string;
  description: string;
  origin: string; // e.g., student name, company name
  type: IncomeType;
  amount: number;
  status: IncomeStatus;
}

export const incomeStatusConfig: Record<IncomeStatus, { label: string; icon: LucideIcon; color: string; }> = {
  completed: { label: 'Complété', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
};

// Types for Expenses
export type ExpenseStatus = 'paid' | 'pending' | 'due';
export type ExpenseCategory = 'salaries' | 'supplies' | 'maintenance' | 'utilities' | 'marketing' | 'other';

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  status: ExpenseStatus;
}

export const expenseStatusConfig: Record<ExpenseStatus, { label: string; icon: LucideIcon; color: string; }> = {
  paid: { label: 'Payé', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  due: { label: 'Dû', icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
};

// Mock Data
export const allIncomes: Income[] = [
  { id: 'IN-001', date: '2025-05-20', description: 'Frais de scolarité L3', origin: 'Dupont Sarah', type: 'tuition', amount: 750000, status: 'completed' },
  { id: 'IN-002', date: '2025-05-19', description: 'Frais d\'inscription', origin: 'Martin Lucas', type: 'fees', amount: 50000, status: 'completed' },
  { id: 'IN-003', date: '2025-05-18', description: 'Donation - Gala annuel', origin: 'Entreprise TechCorp', type: 'donation', amount: 500000, status: 'completed' },
  { id: 'IN-004', date: '2025-05-17', description: 'Frais de scolarité M1', origin: 'Bernard Thomas', type: 'tuition', amount: 1000000, status: 'pending' },
  { id: 'IN-005', date: '2025-05-16', description: 'Location Amphi A', origin: 'Évènement externe', type: 'other', amount: 200000, status: 'completed' },
];

export const allExpenses: Expense[] = [
  { id: 'EX-001', date: '2025-05-25', description: 'Salaires - Mai 2025', category: 'salaries', amount: 15500000, status: 'pending' },
  { id: 'EX-002', date: '2025-05-22', description: 'Achat fournitures de bureau', category: 'supplies', amount: 350000, status: 'paid' },
  { id: 'EX-003', date: '2025-05-20', description: 'Facture électricité', category: 'utilities', amount: 850000, status: 'due' },
  { id: 'EX-004', date: '2025-05-15', description: 'Maintenance serveurs', category: 'maintenance', amount: 450000, status: 'paid' },
  { id: 'EX-005', date: '2025-05-10', description: 'Campagne publicitaire', category: 'marketing', amount: 1200000, status: 'paid' },
];
