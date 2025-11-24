
export interface Teacher {
    id: number;
    name: string;
    email: string;
    phone: string;
    office: string;
    type: 'professor' | 'associate' | 'lecturer' | 'assistant';
    specialty: 'computer-science' | 'mathematics' | 'physics' | 'statistics';
    courses: number;
    students: number;
    publications: number;
    evaluation: number;
    status: 'active' | 'sabbatical' | 'temporary';
    avatar: string;
    experience: number;
    lastActivity: string;
}

export const teachersData: Teacher[] = [
    { 
        id: 1, 
        name: 'Dr. Claire Dubois', 
        type: 'professor', 
        specialty: 'computer-science', 
        courses: 4,
        students: 185,
        publications: 23,
        evaluation: 4.8, 
        status: 'active', 
        avatar: '12',
        email: 'claire.dubois@univ.fr',
        phone: '01 23 45 67 89',
        office: 'B305',
        experience: 12,
        lastActivity: 'Aujourd\'hui 14:30'
    },
    { 
        id: 2, 
        name: 'Prof. Jean Martin', 
        type: 'professor', 
        specialty: 'mathematics', 
        courses: 3,
        students: 142,
        publications: 18,
        evaluation: 4.6, 
        status: 'active', 
        avatar: '8',
        email: 'jean.martin@univ.fr',
        phone: '01 23 45 67 90',
        office: 'A201',
        experience: 15,
        lastActivity: 'Hier 16:45'
    },
    { 
        id: 3, 
        name: 'Dr. Marie Leroy', 
        type: 'associate', 
        specialty: 'computer-science', 
        courses: 5,
        students: 203,
        publications: 12,
        evaluation: 4.4, 
        status: 'active', 
        avatar: '18',
        email: 'marie.leroy@univ.fr',
        phone: '01 23 45 67 91',
        office: 'B412',
        experience: 8,
        lastActivity: 'Aujourd\'hui 11:20'
    },
    { 
        id: 4, 
        name: 'Dr. Pierre Moreau', 
        type: 'associate', 
        specialty: 'physics', 
        courses: 2,
        students: 95,
        publications: 15,
        evaluation: 4.2, 
        status: 'sabbatical', 
        avatar: '15',
        email: 'pierre.moreau@univ.fr',
        phone: '01 23 45 67 92',
        office: 'C105',
        experience: 10,
        lastActivity: 'Il y a 3 mois'
    },
    { 
        id: 5, 
        name: 'Dr. Sophie Bernard', 
        type: 'lecturer', 
        specialty: 'statistics', 
        courses: 6,
        students: 167,
        publications: 8,
        evaluation: 4.7, 
        status: 'active', 
        avatar: '22',
        email: 'sophie.bernard@univ.fr',
        phone: '01 23 45 67 93',
        office: 'A315',
        experience: 6,
        lastActivity: 'Aujourd\'hui 09:15'
    },
    {
        id: 6,
        name: 'Dr. Lucas Tremblay',
        type: 'professor',
        specialty: 'computer-science',
        courses: 4,
        students: 175,
        publications: 30,
        evaluation: 4.9,
        status: 'active',
        avatar: '28',
        email: 'lucas.tremblay@univ.fr',
        phone: '01 23 45 67 94',
        office: 'B101',
        experience: 18,
        lastActivity: 'Hier 10:00'
    },
    {
        id: 7,
        name: 'Prof. Alice Dubois',
        type: 'lecturer',
        specialty: 'mathematics',
        courses: 5,
        students: 210,
        publications: 5,
        evaluation: 4.3,
        status: 'active',
        avatar: '35',
        email: 'alice.dubois@univ.fr',
        phone: '01 23 45 67 95',
        office: 'A102',
        experience: 5,
        lastActivity: 'Il y a 2 jours'
    },
    {
        id: 8,
        name: 'Dr. Paul Durand',
        type: 'temporary',
        specialty: 'physics',
        courses: 1,
        students: 45,
        publications: 2,
        evaluation: 4.1,
        status: 'temporary',
        avatar: '42',
        email: 'paul.durand@univ.fr',
        phone: '01 23 45 67 96',
        office: 'C203',
        experience: 3,
        lastActivity: 'La semaine dernière'
    }
];

export const getStatusConfig = (status: Teacher['status']) => {
  const config = {
    active: {
      label: 'Actif',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    },
    sabbatical: {
      label: 'En congé',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    },
    temporary: {
      label: 'Temporaire',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    },
  };
  return config[status] || { label: 'Inconnu', color: 'bg-gray-100 dark:bg-gray-700' };
};

export const getTypeConfig = (type: Teacher['type']) => {
  const config = {
    professor: 'Professeur',
    associate: 'Maître de conférences',
    lecturer: 'Chargé de cours',
    assistant: 'Assistant',
  };
  return config[type] || 'Inconnu';
};

export const getSpecialtyConfig = (specialty: Teacher['specialty']) => {
    const config = {
        'computer-science': 'Informatique',
        'mathematics': 'Mathématiques',
        'physics': 'Physique',
        'statistics': 'Statistiques',
    };
    return config[specialty] || 'Autre';
}
