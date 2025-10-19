
export type DocumentType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip' | 'mp4';

export interface CourseDocument {
  id: number;
  date: string;
  module: string;
  documentName: string;
  type: DocumentType;
  uploader: string;
  fileUrl: string;
  level?: string;
  class?: string;
  description?: string;
}

export const courseDocuments: CourseDocument[] = [
  { id: 1, date: '10/05/2025', module: 'Bases de Données', documentName: 'Cours SQL Avancé.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/cours-sql.pdf', level: 'L3', class: 'INFO', description: 'Introduction aux requêtes SQL avancées, jointures complexes et procédures stockées.' },
  { id: 2, date: '09/05/2025', module: 'Algorithmique', documentName: 'TD Algorithmes de graphes.docx', type: 'docx', uploader: 'Prof. Michel Martin', fileUrl: '/documents/td-graphes.docx', level: 'L2', class: 'INFO', description: 'Exercices pratiques sur les parcours de graphes (BFS, DFS) et les arbres couvrants minimaux.' },
  { id: 3, date: '08/05/2025', module: 'Programmation', documentName: 'Exemples de code.zip', type: 'zip', uploader: 'Dr. Thomas Laurent', fileUrl: '/documents/exemples-code.zip', level: 'L3', class: 'INFO', description: 'Archive contenant les exemples de code vus en cours pour les design patterns.' },
  { id: 4, date: '07/05/2025', module: 'Développement Web', documentName: 'Introduction JavaScript.pptx', type: 'pptx', uploader: 'Prof. Jean Leroy', fileUrl: '/documents/intro-js.pptx', level: 'L3', class: 'INFO', description: 'Présentation des bases de JavaScript, du DOM et des événements.' },
  { id: 5, date: '06/05/2025', module: 'Bases de Données', documentName: 'Introduction NoSQL.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/intro-nosql.pdf', level: 'L2', class: 'INFO', description: 'Concepts des bases de données NoSQL (Document, Clé-Valeur, Graphe).' },
  { id: 6, date: '05/05/2025', module: 'Réseaux', documentName: 'Tutoriel Flexbox CSS.mp4', type: 'mp4', uploader: 'Prof. Jean Leroy', fileUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', level: 'L3', class: 'INFO', description: 'Vidéo tutoriel sur la mise en page avec Flexbox.' },
  { id: 7, date: '04/05/2025', module: 'Algorithmique', documentName: 'Complexité algorithmique.pdf', type: 'pdf', uploader: 'Prof. Michel Martin', fileUrl: '/documents/complexite.pdf', level: 'L3', class: 'INFO', description: 'Analyse de la complexité temporelle et spatiale des algorithmes.' },
  { id: 8, date: '03/05/2025', module: 'Programmation', documentName: 'Cours vidéo sur les Design Patterns.mp4', type: 'mp4', uploader: 'Dr. Thomas Laurent', fileUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', level: 'L3', class: 'INFO', description: 'Explication des patterns Singleton, Factory et Observer.' },
  { id: 9, date: '02/05/2025', module: 'Mathématiques', documentName: 'Analyse complexe.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '#', level: 'L2', class: 'MATH', description: 'Cours sur les fonctions de variable complexe.' },
  { id: 10, date: '01/05/2025', module: 'Physique', documentName: 'Mécanique quantique.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '#', level: 'L2', class: 'PHYS', description: 'Introduction aux postulats de la mécanique quantique.' },
];
