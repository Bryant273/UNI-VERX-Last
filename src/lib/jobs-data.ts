import { Briefcase, MapPin, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


export interface JobOffer {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  contractType: 'Stage' | 'CDI' | 'CDD' | 'Alternance';
  duration: string;
  salary?: string;
  skills: string[];
  description: string;
  postedDate: string;
  isFavorite: boolean;
  missions: string[];
}

export const jobOffers: JobOffer[] = [
  {
    id: '1',
    title: 'Développeur Frontend',
    company: 'TechSolutions',
    companyLogo: 'https://i.imgur.com/8Km9tLL.png',
    location: 'Paris, France (Hybride)',
    contractType: 'Stage',
    duration: '6 mois',
    salary: '1200€ - 1400€ /mois',
    skills: ['React', 'TypeScript', 'UI/UX', 'HTML5', 'CSS3'],
    description: 'Rejoignez notre équipe dynamique pour développer des interfaces utilisateur modernes et responsives pour nos applications web. Vous travaillerez sur des projets stimulants avec les dernières technologies.',
    postedDate: 'Il y a 2 jours',
    isFavorite: false,
    missions: [
      'Développer des interfaces utilisateur réactives et intuitives',
      'Collaborer avec les designers UX/UI pour implémenter les maquettes',
      'Optimiser les applications pour des performances maximales',
      'Participer aux revues de code et aux sessions de planification',
      'Maintenir et améliorer le code existant',
    ],
  },
  {
    id: '2',
    title: 'Data Scientist Junior',
    company: 'DataViz',
    companyLogo: 'https://i.imgur.com/UBKGwAn.png',
    location: 'Lyon, France (Sur site)',
    contractType: 'Stage',
    duration: '4 mois',
    salary: '1100€ - 1300€ /mois',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    description: 'Vous travaillerez sur des projets d\'analyse de données et de modélisation prédictive pour des clients dans le secteur financier, en utilisant des techniques de pointe.',
    postedDate: 'Il y a 3 jours',
    isFavorite: false,
    missions: [
      'Analyser de grands ensembles de données pour extraire des informations pertinentes',
      'Construire et évaluer des modèles de machine learning',
      'Créer des visualisations de données pour communiquer les résultats',
      'Participer à la mise en production des modèles',
    ],
  },
  {
    id: '3',
    title: 'Ingénieur DevOps',
    company: 'CloudNine',
    companyLogo: 'https://i.imgur.com/iQW4kFs.png',
    location: 'Bordeaux, France (Télétravail)',
    contractType: 'CDI',
    duration: 'Indéterminé',
    salary: '38k€ - 45k€ /an',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    description: 'Nous recherchons un ingénieur DevOps pour mettre en place et maintenir nos infrastructures cloud et nos pipelines CI/CD, garantissant la fiabilité et la scalabilité de nos services.',
    postedDate: 'Aujourd\'hui',
    isFavorite: true,
    missions: [
        'Gérer l\'infrastructure cloud sur AWS',
        'Mettre en place et optimiser les pipelines CI/CD',
        'Automatiser les déploiements et la surveillance',
        'Assurer la sécurité et la haute disponibilité des services',
    ],
  },
  {
    id: '4',
    title: 'Développeur Full Stack',
    company: 'WebCraft',
    companyLogo: 'https://i.imgur.com/qVX5RBV.png',
    location: 'Nantes, France (Hybride)',
    contractType: 'Stage',
    duration: '6 mois',
    salary: '1000€ - 1200€ /mois',
    skills: ['JavaScript', 'Node.js', 'MongoDB', 'React'],
    description: 'Participez au développement d\'applications web modernes en utilisant les dernières technologies JavaScript. Idéal pour les étudiants en fin de cursus cherchant une première expérience professionnelle complète.',
    postedDate: 'Il y a 5 jours',
    isFavorite: false,
     missions: [
        'Concevoir et développer des API RESTful',
        'Intégrer les interfaces front-end avec la logique back-end',
        'Gérer les bases de données NoSQL (MongoDB)',
        'Écrire des tests unitaires et d\'intégration',
    ],
  },
];

export interface FilterOption {
    value: string;
    label: string;
}

export interface JobFilter {
    id: string;
    name: string;
    icon: LucideIcon;
    options: FilterOption[];
}


export const jobFilters: JobFilter[] = [
  {
    id: 'contractType',
    name: 'Type',
    icon: Filter,
    options: [
      { value: 'Stage', label: 'Stage' },
      { value: 'CDI', label: 'CDI' },
      { value: 'CDD', label: 'CDD' },
      { value: 'Alternance', label: 'Alternance' },
    ],
  },
  {
    id: 'location',
    name: 'Lieu',
    icon: MapPin,
    options: [
      { value: 'Paris', label: 'Paris' },
      { value: 'Lyon', label: 'Lyon' },
      { value: 'Bordeaux', label: 'Bordeaux' },
      { value: 'Télétravail', label: 'Télétravail' },
    ],
  },
   {
    id: 'duration',
    name: 'Durée',
    icon: Clock,
    options: [
      { value: '1-3 mois', label: '1-3 mois' },
      { value: '3-6 mois', label: '3-6 mois' },
      { value: '6-12 mois', label: '6-12 mois' },
      { value: 'Plus d\'un an', label: 'Plus d\'un an' },
    ],
  },
];

    