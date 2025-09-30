export type DocumentType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'zip';

export interface CourseDocument {
  id: number;
  date: string;
  module: string;
  documentName: string;
  type: DocumentType;
  uploader: string;
  fileUrl: string;
}

export const courseDocuments: CourseDocument[] = [
  { id: 1, date: '10/05/2025', module: 'Bases de Données', documentName: 'Cours SQL Avancé.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/cours-sql.pdf' },
  { id: 2, date: '05/05/2025', module: 'Algorithmique', documentName: 'TD Algorithmes de graphes.docx', type: 'docx', uploader: 'Prof. Michel Martin', fileUrl: '/documents/td-graphes.docx' },
  { id: 3, date: '02/05/2025', module: 'Programmation', documentName: 'Exemples de code.zip', type: 'zip', uploader: 'Dr. Thomas Laurent', fileUrl: '/documents/exemples-code.zip' },
  { id: 4, date: '28/04/2025', module: 'Développement Web', documentName: 'Introduction JavaScript.pptx', type: 'pptx', uploader: 'Prof. Jean Leroy', fileUrl: '/documents/intro-js.pptx' },
  { id: 5, date: '25/04/2025', module: 'Réseaux', documentName: 'Planning laboratoire réseau.xlsx', type: 'xlsx', uploader: 'Dr. Laurent Rivière', fileUrl: '/documents/planning-reseau.xlsx' },
  { id: 6, date: '22/04/2025', module: 'Bases de Données', documentName: 'Introduction NoSQL.pdf', type: 'pdf', uploader: 'Dr. Claire Dubois', fileUrl: '/documents/intro-nosql.pdf' },
  { id: 7, date: '18/04/2025', module: 'Algorithmique', documentName: 'Complexité algorithmique.pdf', type: 'pdf', uploader: 'Prof. Michel Martin', fileUrl: '/documents/complexite.pdf' },
];
