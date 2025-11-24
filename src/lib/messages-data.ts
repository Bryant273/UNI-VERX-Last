export interface DemoUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online?: boolean;
}

export interface Conversation {
  id: string;
  type: 'group' | 'user';
  name: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  members?: DemoUser[];
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export const allUsers: DemoUser[] = [
  { id: 'student-sarah-dupont', name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', role: 'Étudiant(e)', online: true },
  { id: 'student-thomas-mercier', name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', role: 'Étudiant(e)', online: false },
  { id: 'student-emma-bernard', name: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', role: 'Étudiant(e)', online: true },
  { id: 'prof-martin', name: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', role: 'Professeur', online: true },
  { id: 'prof-dubois', name: 'Prof. Dubois', avatar: 'https://i.pravatar.cc/100?img=69', role: 'Professeur', online: false },
  { id: 'admin-univ', name: 'Admin Université', avatar: 'https://i.pravatar.cc/100?img=68', role: 'Administration', online: true },
];

export const initialConversationsData: Conversation[] = [
  {
    id: 'course-bdd-l3',
    type: 'group',
    name: 'Bases de Données L3',
    avatar: '',
    initials: 'BDD',
    lastMessage: 'Emma: Professeur, question sur le TP 5...',
    time: '14:30',
    unread: 3,
    online: true,
  },
   {
    id: 'student-emma',
    type: 'user',
    name: 'Emma Bernard',
    avatar: 'https://i.pravatar.cc/100?img=32',
    initials: 'EB',
    lastMessage: 'Merci pour vos explications !',
    time: '15:20',
    unread: 1,
    online: true,
  },
  {
    id: 'colleague-martin',
    type: 'user',
    name: 'Prof. Martin',
    avatar: 'https://i.pravatar.cc/100?img=60',
    initials: 'PM',
    lastMessage: 'Réunion équipe pédagogique demain 10h ?',
    time: '16:45',
    unread: 1,
    online: true,
  },
  {
    id: 'course-python-l2',
    type: 'group',
    name: 'Programmation Python L2',
    avatar: '',
    initials: 'PY',
    lastMessage: 'Antoine: Erreur dans mon code...',
    time: '12:15',
    unread: 1,
    online: true,
  },
  {
    id: 'student-thomas',
    type: 'user',
    name: 'Thomas Mercier',
    avatar: 'https://i.pravatar.cc/100?img=59',
    initials: 'TM',
    lastMessage: 'Question sur le TP 5, partie 3...',
    time: '14:30',
    unread: 2,
    online: false,
  },
    {
    id: 'colleague-garcia',
    type: 'user',
    name: 'Dr. Garcia',
    avatar: 'https://i.pravatar.cc/100?img=34',
    initials: 'DG',
    lastMessage: 'Coordination des modules communs...',
    time: '15:30',
    unread: 0,
    online: false,
  },
  {
    id: 'course-algo-l1',
    type: 'group',
    name: 'Algorithmique L1',
    avatar: '',
    initials: 'ALG',
    lastMessage: 'Marie: Merci pour les exercices !',
    time: '10:45',
    unread: 0,
    online: true,
  },
  {
    id: 'admin-scolarite',
    type: 'group',
    name: 'Service Scolarité',
    avatar: '',
    initials: 'ADM',
    lastMessage: 'Calendrier des examens finalisé...',
    time: '14:15',
    unread: 0,
    online: true,
  },
  {
    id: 'student-sophie',
    type: 'user',
    name: 'Sophie Martin',
    avatar: 'https://i.pravatar.cc/100?img=47',
    initials: 'SM',
    lastMessage: 'Demande de rendez-vous pour discuter...',
    time: '12:45',
    unread: 0,
    online: false,
  },
   {
    id: 'course-projet-m1',
    type: 'group',
    name: 'Projet Informatique M1',
    avatar: '',
    initials: 'PRJ',
    lastMessage: 'Équipe 2: Validation de notre architecture ?',
    time: 'Hier',
    unread: 2,
    online: true,
  },
   {
    id: 'admin-direction',
    type: 'user',
    name: 'Direction UFR',
    avatar: 'https://i.pravatar.cc/100?img=68',
    initials: 'DU',
    lastMessage: 'Conseil d\'UFR vendredi 14h - Salle 301',
    time: 'Mar',
    unread: 0,
    online: false,
  },
   {
    id: 'student-lucas',
    type: 'user',
    name: 'Lucas Fournier',
    avatar: 'https://i.pravatar.cc/100?img=11',
    initials: 'LF',
    lastMessage: 'Projet avance bien, merci pour les conseils !',
    time: 'Lun',
    unread: 0,
    online: true,
  },
];


export const messagesData: { [key: string]: any[] } = {
    'course-bdd-l3': [
        { id: 1, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '09:00', content: 'Bonjour à tous ! Le TP 5 sur les requêtes SQL avancées est maintenant disponible sur la plateforme. Date limite de rendu : vendredi 17 mai.', isMe: true },
        { id: 2, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '09:15', content: 'Merci professeur ! J\'ai une question sur l\'exercice 3, est-ce qu\'on doit utiliser des sous-requêtes ou des jointures ?', isMe: false },
        { id: 3, sender: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', time: '09:18', content: 'Même question que Emma ! Et est-ce qu\'on peut utiliser les fonctions d\'agrégation ?', isMe: false },
        { id: 4, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '09:25', content: 'Excellentes questions ! Pour l\'exercice 3, vous pouvez utiliser les deux approches. L\'important est d\'optimiser vos requêtes. Les fonctions d\'agrégation sont autorisées et même recommandées.', isMe: true },
        { id: 5, sender: 'Sophie Martin', avatar: 'https://i.pravatar.cc/100?img=47', time: '09:30', content: 'Est-ce que vous pourriez nous montrer un exemple en cours ?', isMe: false },
        { id: 6, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '14:30', content: 'Bien sûr ! Je ferai des exemples détaillés lors du prochain cours mardi. En attendant, consultez le chapitre 8 du manuel.', isMe: true }
    ],
    'course-python-l2': [
        { id: 1, sender: 'Antoine Moreau', avatar: 'https://i.pravatar.cc/100?img=15', time: '11:30', content: 'Professeur, j\'ai une erreur dans mon code pour le TP 4. Pouvez-vous m\'aider ?', isMe: false },
        { id: 2, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '11:45', content: 'Bien sûr Antoine ! Peux-tu partager le message d\'erreur et le code problématique ?', isMe: true },
        { id: 3, sender: 'Antoine Moreau', avatar: 'https://i.pravatar.cc/100?img=15', time: '11:50', content: 'J\'ai un "IndexError: list index out of range" ligne 23. Je pense que c\'est avec ma boucle for.', isMe: false },
        { id: 4, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '12:00', content: 'Cette erreur indique que tu essaies d\'accéder à un élément qui n\'existe pas dans ta liste. Vérifie la longueur de ta liste avec len() avant d\'y accéder.', isMe: true },
        { id: 5, sender: 'Antoine Moreau', avatar: 'https://i.pravatar.cc/100?img=15', time: '12:15', content: 'Ça marche ! Merci beaucoup professeur 😊', isMe: false }
    ],
    'student-emma': [
        { id: 1, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '14:30', content: 'Bonjour Professeur Dubois, j\'ai une question sur les index en base de données. Je ne comprends pas bien la différence entre un index clustered et non-clustered.', isMe: false },
        { id: 2, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '14:45', content: 'Bonjour Emma ! Excellente question. Un index clustered réorganise physiquement les données sur le disque selon l\'ordre de l\'index, tandis qu\'un index non-clustered crée une structure séparée qui pointe vers les données.', isMe: true },
        { id: 3, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '14:50', content: 'D\'accord, donc il ne peut y avoir qu\'un seul index clustered par table ?', isMe: false },
        { id: 4, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '15:00', content: 'Exactement ! Puisque les données ne peuvent être organisées physiquement que d\'une seule façon. Par contre, vous pouvez avoir plusieurs index non-clustered.', isMe: true },
        { id: 5, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '15:20', content: 'Merci beaucoup pour vos explications ! C\'est beaucoup plus clair maintenant 😊', isMe: false }
    ],
    'colleague-martin': [
        { id: 1, sender: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', time: '16:30', content: 'Salut Claire ! Tu es disponible pour la réunion équipe pédagogique demain 10h ? On doit discuter des nouveaux programmes.', isMe: false },
        { id: 2, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '16:35', content: 'Salut Pierre ! Oui, je suis disponible. Tu as déjà l\'ordre du jour ?', isMe: true },
        { id: 3, sender: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', time: '16:40', content: 'Je l\'envoie ce soir par mail. On va principalement parler de la réforme du L2 et de la coordination entre nos modules.', isMe: false },
        { id: 4, sender: 'Dr. Claire Dubois', avatar: 'https://i.pravatar.cc/100?img=12', time: '16:45', content: 'Parfait ! J\'ai quelques idées pour mieux articuler programmation et bases de données. À demain !', isMe: true }
    ],
};
