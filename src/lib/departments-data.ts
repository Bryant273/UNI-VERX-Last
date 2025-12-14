
export interface Department {
    id: string;
    name: string;
    head: string;
    specialties: string[];
}

export const initialDepartments: Department[] = [
    {
        id: 'dept-info',
        name: 'Informatique',
        head: 'Dr. Claire Dubois',
        specialties: ['Génie Logiciel', 'Réseaux & Sécurité', 'Science des Données', 'Intelligence Artificielle']
    },
    {
        id: 'dept-math',
        name: 'Mathématiques',
        head: 'Prof. Jean Martin',
        specialties: ['Mathématiques Appliquées', 'Statistiques et Probabilités', 'Mathématiques Fondamentales']
    },
    {
        id: 'dept-phys',
        name: 'Physique',
        head: 'Dr. Pierre Moreau',
        specialties: ['Physique Quantique', 'Astrophysique', 'Physique des Matériaux']
    },
    {
        id: 'dept-lettres',
        name: 'Lettres Modernes',
        head: 'Prof. Alice Dubois',
        specialties: ['Littérature Comparée', 'Linguistique', 'Édition et Métiers du livre']
    }
];
