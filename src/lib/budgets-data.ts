
export type BudgetItemType = 'income' | 'expense';
export type IncomeCategory = 'tuition' | 'fees' | 'donation' | 'other';
export type ExpenseCategory = 'salaries' | 'supplies' | 'maintenance' | 'utilities' | 'marketing' | 'other';

export interface BudgetItem {
    id: string;
    category: IncomeCategory | ExpenseCategory;
    categoryLabel: string;
    type: BudgetItemType;
    amount: number;
}

export const budgetData: BudgetItem[] = [
    // Incomes
    { id: 'inc-1', category: 'tuition', categoryLabel: 'Frais de scolarité', type: 'income', amount: 350000000 },
    { id: 'inc-2', category: 'fees', categoryLabel: 'Frais annexes (inscriptions, certifications)', type: 'income', amount: 25000000 },
    { id: 'inc-3', category: 'donation', categoryLabel: 'Subventions et donations', type: 'income', amount: 50000000 },
    { id: 'inc-4', category: 'other', categoryLabel: 'Autres revenus (locations, etc.)', type: 'income', amount: 10000000 },
    // Expenses
    { id: 'exp-1', category: 'salaries', categoryLabel: 'Masse salariale (enseignants et admin)', type: 'expense', amount: 220000000 },
    { id: 'exp-2', category: 'utilities', categoryLabel: 'Charges (eau, électricité, internet)', type: 'expense', amount: 45000000 },
    { id: 'exp-3', category: 'maintenance', categoryLabel: 'Maintenance et entretien', type: 'expense', amount: 30000000 },
    { id: 'exp-4', category: 'supplies', categoryLabel: 'Fournitures et équipements', type: 'expense', amount: 20000000 },
    { id: 'exp-5', category: 'marketing', categoryLabel: 'Marketing et communication', type: 'expense', amount: 15000000 },
    { id: 'exp-6', category: 'other', categoryLabel: 'Dépenses diverses', type: 'expense', amount: 8000000 },
];
