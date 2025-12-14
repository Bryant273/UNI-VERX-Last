
export type BudgetItemType = 'income' | 'expense';
export type IncomeCategory = 'tuition' | 'fees' | 'donation' | 'other';
export type ExpenseCategory = 'salaries' | 'supplies' | 'maintenance' | 'utilities' | 'marketing' | 'other';

export interface BudgetItem {
    id: string;
    category: IncomeCategory | ExpenseCategory;
    categoryLabel: string;
    type: BudgetItemType;
    amount: number;
    year: number;
}

export const budgetData: BudgetItem[] = [
    // 2025 Incomes
    { id: 'inc-1-2025', category: 'tuition', categoryLabel: 'Frais de scolarité', type: 'income', amount: 350000000, year: 2025 },
    { id: 'inc-2-2025', category: 'fees', categoryLabel: 'Frais annexes (inscriptions, certifications)', type: 'income', amount: 25000000, year: 2025 },
    { id: 'inc-3-2025', category: 'donation', categoryLabel: 'Subventions et donations', type: 'income', amount: 50000000, year: 2025 },
    { id: 'inc-4-2025', category: 'other', categoryLabel: 'Autres revenus (locations, etc.)', type: 'income', amount: 10000000, year: 2025 },
    // 2025 Expenses
    { id: 'exp-1-2025', category: 'salaries', categoryLabel: 'Masse salariale (enseignants et admin)', type: 'expense', amount: 220000000, year: 2025 },
    { id: 'exp-2-2025', category: 'utilities', categoryLabel: 'Charges (eau, électricité, internet)', type: 'expense', amount: 45000000, year: 2025 },
    { id: 'exp-3-2025', category: 'maintenance', categoryLabel: 'Maintenance et entretien', type: 'expense', amount: 30000000, year: 2025 },
    { id: 'exp-4-2025', category: 'supplies', categoryLabel: 'Fournitures et équipements', type: 'expense', amount: 20000000, year: 2025 },
    { id: 'exp-5-2025', category: 'marketing', categoryLabel: 'Marketing et communication', type: 'expense', amount: 15000000, year: 2025 },
    { id: 'exp-6-2025', category: 'other', categoryLabel: 'Dépenses diverses', type: 'expense', amount: 8000000, year: 2025 },
    
    // 2024 Incomes
    { id: 'inc-1-2024', category: 'tuition', categoryLabel: 'Frais de scolarité', type: 'income', amount: 320000000, year: 2024 },
    { id: 'inc-2-2024', category: 'fees', categoryLabel: 'Frais annexes', type: 'income', amount: 22000000, year: 2024 },
    { id: 'inc-3-2024', category: 'donation', categoryLabel: 'Subventions et donations', type: 'income', amount: 45000000, year: 2024 },
    // 2024 Expenses
    { id: 'exp-1-2024', category: 'salaries', categoryLabel: 'Masse salariale', type: 'expense', amount: 200000000, year: 2024 },
    { id: 'exp-2-2024', category: 'utilities', categoryLabel: 'Charges', type: 'expense', amount: 40000000, year: 2024 },
    { id: 'exp-3-2024', category: 'maintenance', categoryLabel: 'Maintenance', type: 'expense', amount: 28000000, year: 2024 },
];
