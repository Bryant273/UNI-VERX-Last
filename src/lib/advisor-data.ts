
export type CourseStatus = 'pending' | 'approved' | 'published' | 'rejected';

export interface AdvisorCourse {
  id: number;
  date: string;
  teacher: string;
  level: string;
  class: string;
  module: string;
  title: string;
  extension: string;
  status: CourseStatus;
  description: string;
}

export const allCoursesData: AdvisorCourse[] = [
    { id: 1, date: '10/05/2025', teacher: 'Dr. Claire Dubois', level: 'L3', class: 'INFO', module: 'Bases de Données', title: 'Cours SQL Avancé.pdf', extension: 'pdf', status: 'published', description: 'Introduction aux requêtes SQL avancées' },
    { id: 2, date: '09/05/2025', teacher: 'Prof. Martin', level: 'L2', class: 'INFO', module: 'Algorithmique', title: 'TD Algorithmes de graphes.docx', extension: 'docx', status: 'pending', description: 'Exercices pratiques sur les algorithmes de graphes' },
    { id: 3, date: '08/05/2025', teacher: 'Prof. Leroy', level: 'L3', class: 'INFO', module: 'Programmation', title: 'Exemples de code.zip', extension: 'zip', status: 'approved', description: 'Collection d\'exemples de code' },
    { id: 4, date: '07/05/2025', teacher: 'Dr. Sophie Moreau', level: 'L3', class: 'INFO', module: 'Développement Web', title: 'Introduction JavaScript.pptx', extension: 'pptx', status: 'published', description: 'Présentation des bases de JavaScript' },
    { id: 5, date: '06/05/2025', teacher: 'Dr. Claire Dubois', level: 'L2', class: 'INFO', module: 'Bases de Données', title: 'Introduction NoSQL.pdf', extension: 'pdf', status: 'pending', description: 'Concepts des bases de données NoSQL' },
    { id: 6, date: '05/05/2025', teacher: 'Prof. Jean Durand', level: 'L3', class: 'INFO', module: 'Réseaux Informatiques', title: 'Protocoles TCP-IP.pdf', extension: 'pdf', status: 'published', description: 'Guide des protocoles réseau' },
    { id: 7, date: '04/05/2025', teacher: 'Prof. Martin', level: 'L2', class: 'MATH', module: 'Mathématiques', title: 'Analyse complexe.pdf', extension: 'pdf', status: 'approved', description: 'Cours d\'analyse complexe' },
    { id: 8, date: '03/05/2025', teacher: 'Dr. Sophie Moreau', level: 'L3', class: 'INFO', module: 'Systèmes d\'exploitation', title: 'Gestion mémoire.pptx', extension: 'pptx', status: 'published', description: 'Mécanismes de gestion mémoire' },
    { id: 9, date: '02/05/2025', teacher: 'Prof. Leroy', level: 'L2', class: 'INFO', module: 'Algorithmique', title: 'Tri et recherche.docx', extension: 'docx', status: 'rejected', description: 'Algorithmes de tri et de recherche' },
    { id: 10, date: '01/05/2025', teacher: 'Dr. Claire Dubois', level: 'L3', class: 'INFO', module: 'Programmation', title: 'POO Java.zip', extension: 'zip', status: 'pending', description: 'Programmation orientée objet en Java' },
    { id: 11, date: '30/04/2025', teacher: 'Prof. Martin', level: 'L1', class: 'MATH', module: 'Mathématiques', title: 'Algèbre linéaire.pdf', extension: 'pdf', status: 'published', description: 'Fondements de l\'algèbre linéaire' },
    { id: 12, date: '29/04/2025', teacher: 'Prof. Jean Durand', level: 'L2', class: 'INFO', module: 'Bases de Données', title: 'Modélisation ER.pdf', extension: 'pdf', status: 'approved', description: 'Modélisation Entité-Relation' },
    { id: 13, date: '28/04/2025', teacher: 'Dr. Sophie Moreau', level: 'L3', class: 'INFO', module: 'Développement Web', title: 'CSS Avancé.zip', extension: 'zip', status: 'published', description: 'Techniques CSS avancées' },
    { id: 14, date: '27/04/2025', teacher: 'Prof. Leroy', level: 'M1', class: 'INFO', module: 'Réseaux Informatiques', title: 'Sécurité réseau.pptx', extension: 'pptx', status: 'pending', description: 'Sécurité des réseaux informatiques' },
    { id: 15, date: '26/04/2025', teacher: 'Dr. Claire Dubois', level: 'L3', class: 'INFO', module: 'Systèmes d\'exploitation', title: 'Processus et threads.pdf', extension: 'pdf', status: 'published', description: 'Gestion des processus et threads' },
    { id: 16, date: '25/04/2025', teacher: 'Prof. Martin', level: 'L2', class: 'PHYS', module: 'Physique', title: 'Mécanique quantique.pdf', extension: 'pdf', status: 'approved', description: 'Introduction à la mécanique quantique' },
    { id: 17, date: '24/04/2025', teacher: 'Prof. Jean Durand', level: 'L1', class: 'ELEC', module: 'Électronique', title: 'Circuits électriques.pptx', extension: 'pptx', status: 'published', description: 'Bases des circuits électriques' },
    { id: 18, date: '23/04/2025', teacher: 'Dr. Sophie Moreau', level: 'L2', class: 'INFO', module: 'Programmation', title: 'Python avancé.zip', extension: 'zip', status: 'pending', description: 'Techniques avancées en Python' },
    { id: 19, date: '22/04/2025', teacher: 'Prof. Leroy', level: 'M1', class: 'INFO', module: 'Intelligence Artificielle', title: 'Machine Learning.pdf', extension: 'pdf', status: 'published', description: 'Introduction au Machine Learning' },
    { id: 20, date: '21/04/2025', teacher: 'Dr. Claire Dubois', level: 'L3', class: 'INFO', module: 'Génie Logiciel', title: 'Méthodes Agiles.docx', extension: 'docx', status: 'approved', description: 'Méthodes de développement agiles' },
];
