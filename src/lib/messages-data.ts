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
    id: 'group-1',
    type: 'group',
    name: 'Groupe Universitaire',
    avatar: '',
    initials: 'GU',
    lastMessage: 'Admin: Rappel des dates...',
    time: '10:42',
    unread: 3,
    online: true,
  },
  {
    id: 'student-1',
    type: 'user',
    name: 'Emma Bernard',
    avatar: 'https://i.pravatar.cc/100?img=32',
    initials: 'EB',
    lastMessage: 'Parfait ! On se retrouve...',
    time: '08:55',
    unread: 0,
    online: true,
  },
  {
    id: 'group-2',
    type: 'group',
    name: 'L3 Informatique',
    avatar: '',
    initials: 'L3I',
    lastMessage: 'Lucas: Est-ce que quelqu\'un...',
    time: 'Hier',
    unread: 1,
    online: true,
  },
  {
    id: 'professor-1',
    type: 'user',
    name: 'Prof. Martin',
    avatar: 'https://i.pravatar.cc/100?img=60',
    initials: 'PM',
    lastMessage: 'Concernant votre demande...',
    time: '11:22',
    unread: 1,
    online: true,
  },
  {
    id: 'group-td-2',
    type: 'group',
    name: 'Groupe TD - Équipe 2',
    avatar: '',
    initials: 'TD',
    lastMessage: 'OK, parfait pour moi.',
    time: '12:18',
    unread: 2,
    online: true,
  },
  {
    id: 'student-2',
    type: 'user',
    name: 'Thomas Mercier',
    avatar: 'https://i.pravatar.cc/100?img=59',
    initials: 'TM',
    lastMessage: 'D\'accord, je t\'envoie ça ce soir.',
    time: 'Hier',
    unread: 0,
    online: false,
  },
];


export const messagesData: { [key: string]: any[] } = {
  'group-1': [
    { id: 1, sender: 'Admin Université', avatar: 'https://i.pravatar.cc/100?img=68', time: '10:30', content: 'Bonjour à tous ! Rappel des dates d\'examens...', isMe: false },
    { id: 2, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '10:35', content: 'Merci ! Le planning des salles est dispo ?', isMe: false },
    { id: 3, sender: 'Admin Université', avatar: 'https://i.pravatar.cc/100?img=68', time: '10:42', content: 'Pas encore, il sera communiqué bientôt.', isMe: false },
  ],
  'student-1': [
      { id: 1, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '08:50', content: 'Salut ! Bien dormi ?', isMe: false },
      { id: 2, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', time: '08:51', content: 'Hey ! Oui super et toi ? Prête pour le cours d\'algo ?', isMe: true },
      { id: 3, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', time: '08:55', content: 'Oui, plus ou moins ! On se voit à la cafet avant ?', isMe: false },
  ],
  'group-2': [
    { id: 1, sender: 'Lucas', avatar: 'https://i.pravatar.cc/100?img=11', time: 'Hier', content: 'Quelqu\'un a les corrigés du TD d\'algo ?', isMe: false },
  ],
  'professor-1': [
     { id: 1, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', time: '10:50', content: 'Bonjour Monsieur, j\'ai une question sur le projet.', isMe: true },
     { id: 2, sender: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', time: '11:22', content: 'Bonjour Sarah, je vous écoute.', isMe: false },
  ],
  'group-td-2': [
     { id: 1, sender: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', time: '12:00', content: 'Salut l\'équipe, j\'ai push ma partie sur Github.', isMe: false },
     { id: 2, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', time: '12:05', content: 'Super, je regarde ça !', isMe: true },
  ],
  'student-2': [
     { id: 1, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', time: 'Hier', content: 'Salut ! Tu pourrais m\'envoyer les notes du cours de réseau stp ?', isMe: true },
     { id: 2, sender: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=59', time: 'Hier', content: 'Oui bien sûr, je te fais ça ce soir.', isMe: false },
  ],
};
