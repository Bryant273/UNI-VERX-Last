

export interface Task {
    id: string;
    description: string;
    completed: boolean;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
    tasks: Task[];
    tags: string[];
    dueDate: string;
}

export interface Supervisor {
    name: string;
    role: string;
    avatar: string;
}

export interface Document {
    name: string;
    type: 'pdf' | 'word' | 'excel';
    info: string;
}

export interface ActivityLogItem {
    icon: string;
    iconColor: string;
    title: string;
    date: string;
    description: string;
}

export interface EnterpriseData {
    company: {
        name: string;
        logo: string;
        sector: string;
    };
    internship: {
        title: string;
        period: string;
        duration: string;
        startDate: string;
        endDate: string;
        contractType: string;
    };
    stats: {
        progress: number;
        currentEvaluation: string;
        nextEvaluationDate: string;
        completedMissions: number;
        inProgressMissions: number;
        totalMissions: number;
    };
    missions: Mission[];
    missionStatus: {
        [key: string]: {
            status: 'completed' | 'in-progress' | 'pending';
            icon: string;
            color: string;
            text: string;
        }
    };
    activityLog: ActivityLogItem[];
    supervisors: Supervisor[];
    documents: Document[];
    loginInfo: {
        username: string;
    };
}


export const enterpriseData: EnterpriseData = {
    company: {
        name: 'TechSolutions',
        logo: 'https://i.imgur.com/8Km9tLL.png',
        sector: 'Développement Logiciel & Solutions Cloud'
    },
    internship: {
        title: 'Développeur Front-end',
        period: 'Du 1er avril au 30 septembre 2025',
        duration: '6 mois',
        startDate: '01/04/2025',
        endDate: '30/09/2025',
        contractType: 'Stage',
    },
    stats: {
        progress: 45,
        currentEvaluation: '15/20',
        nextEvaluationDate: '15/07/2025',
        completedMissions: 1,
        inProgressMissions: 1,
        totalMissions: 3,
    },
    missions: [
        {
            id: 'm1',
            title: 'Refonte de l\'interface utilisateur',
            description: 'Modernisation de l\'interface utilisateur du dashboard administrateur en utilisant React et Material UI.',
            status: 'completed',
            tasks: [
                { id: 't1-1', description: 'Prototyper l\'interface avec Figma', completed: true },
                { id: 't1-2', description: 'Développer les composants React', completed: true },
                { id: 't1-3', description: 'Intégrer Material UI', completed: true },
                { id: 't1-4', description: 'Tests utilisateurs et ajustements', completed: true },
            ],
            tags: ['React', 'UX Design', 'Material UI'],
            dueDate: '30/04/2025',
        },
        {
            id: 'm2',
            title: 'Intégration API REST',
            description: 'Développement de l\'intégration avec les API REST pour la récupération et la mise à jour des données utilisateurs.',
            status: 'in-progress',
            tasks: [
                { id: 't2-1', description: 'Analyser la documentation de l\'API', completed: true },
                { id: 't2-2', description: 'Configurer Axios', completed: true },
                { id: 't2-3', description: 'Gérer les réponses et les erreurs', completed: false },
                { id: 't2-4', description: 'Intégrer avec Redux', completed: false },
            ],
            tags: ['API', 'React', 'Redux'],
            dueDate: '15/07/2025',
        },
        {
            id: 'm3',
            title: 'Optimisation des performances',
            description: 'Analyse et amélioration des performances de l\'application, avec un focus sur la vitesse de chargement.',
            status: 'pending',
            tasks: [
                { id: 't3-1', description: 'Audit des performances actuelles', completed: false },
                { id: 't3-2', description: 'Optimisation des images et assets', completed: false },
                { id: 't3-3', description: 'Implémentation du lazy loading', completed: false },
            ],
            tags: ['Performance', 'Webpack'],
            dueDate: '30/08/2025',
        }
    ],
    missionStatus: {
        completed: { status: 'completed', icon: 'CheckCircle', color: 'text-green-600', text: 'Terminée' },
        'in-progress': { status: 'in-progress', icon: 'Clock', color: 'text-yellow-600', text: 'En cours' },
        pending: { status: 'pending', icon: 'Flag', color: 'text-blue-600', text: 'À venir' },
    },
    activityLog: [
        { icon: 'Star', iconColor: 'text-yellow-500', title: 'Évaluation mensuelle complétée', date: '15 mai 2025', description: 'Évaluation de mi-stage complétée par votre tuteur Jean Martin. Note obtenue: 15/20.' },
        { icon: 'HardHat', iconColor: 'text-blue-500', title: 'Nouvelle mission assignée', date: '1 mai 2025', description: 'Vous avez été assigné à la mission "Intégration API REST" par Marie Dupont.' },
        { icon: 'CheckCircle', iconColor: 'text-green-500', title: 'Mission terminée: Refonte UI', date: '30 avril 2025', description: 'Vous avez terminé la mission "Refonte de l\'interface utilisateur" avec succès.' },
        { icon: 'Lightbulb', iconColor: 'text-purple-500', title: 'Début du stage', date: '1 avril 2025', description: 'Premier jour chez TechSolutions. Accueil et intégration dans l\'équipe.' },
    ],
    supervisors: [
        { name: 'Jean Martin', role: 'Lead Developer - Tuteur entreprise', avatar: 'https://i.pravatar.cc/100?img=60' },
        { name: 'Prof. Durand', role: 'Enseignant Web - Tuteur université', avatar: 'https://i.pravatar.cc/100?img=68' },
    ],
    documents: [
        { name: 'Convention de stage', type: 'pdf', info: 'Signé le 15/03/2025' },
        { name: 'Guide du stagiaire', type: 'word', info: 'Mise à jour: 01/04/2025' },
        { name: 'Planning du stage', type: 'excel', info: 'Mise à jour: 05/04/2025' },
        { name: 'Rapport mensuel - Avril', type: 'pdf', info: 'Soumis le 30/04/2025' },
    ],
    loginInfo: {
        username: 'sdupont_stage',
    }
};
