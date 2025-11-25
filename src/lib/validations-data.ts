export type ValidationType = 'notes' | 'planning' | 'course' | 'absence';
export type ValidationPriority = 'urgent' | 'normal' | 'low';

export interface Validation {
    id: number;
    title: string;
    teacher: string;
    type: ValidationType;
    priority: ValidationPriority;
    time: string;
    deadline: string;
    students: number;
    details: string;
    status: 'pending' | 'approved' | 'rejected';
    actionDate?: string;
}

export const allValidations: Validation[] = [
    {
        id: 1, title: "Notes d'examen - Bases de Données L3", teacher: "Dr. Claire Dubois", 
        type: "notes", priority: "urgent", time: "Il y a 2h", deadline: "Aujourd'hui 18h",
        students: 89, details: "Examen final du module Bases de Données L3", status: "pending"
    },
    {
        id: 2, title: "Modification planning - Cours Python L2", teacher: "Prof. Martin",
        type: "planning", priority: "urgent", time: "Il y a 1h", deadline: "Demain 10h",
        students: 67, details: "Changement d'horaire pour éviter un conflit", status: "pending"
    },
    {
        id: 3, title: "Création nouveau cours - IA M1", teacher: "Prof. Leroy",
        type: "course", priority: "normal", time: "Il y a 4h", deadline: "Dans 3 jours",
        students: 0, details: "Nouveau module pour le semestre prochain", status: "pending"
    },
    {
        id: 4, title: "Notes rattrapage - Algorithmique L2", teacher: "Prof. Martin",
        type: "notes", priority: "normal", time: "Il y a 6h", deadline: "Dans 2 jours",
        students: 12, details: "Session de rattrapage", status: "pending"
    },
    {
        id: 5, title: "Justificatif d'absence - Sarah Dubois", teacher: "Étudiante",
        type: "absence", priority: "low", time: "Hier", deadline: "Dans 7 jours",
        students: 1, details: "Certificat médical pour absence", status: "pending"
    },
    {
        id: 6, title: "Notes d'examen - Mathématiques L1", teacher: "Prof. Durand",
        type: "notes", priority: "urgent", time: "Il y a 3h", deadline: "Aujourd'hui 20h",
        students: 156, details: "Examen de fin de semestre", status: "pending"
    },
    {
        id: 7, title: "Création nouveau TD - Programmation M2", teacher: "Dr. Rousseau",
        type: "course", priority: "normal", time: "Il y a 8h", deadline: "Dans 5 jours",
        students: 0, details: "Travaux dirigés supplémentaires", status: "pending"
    },
    {
        id: 8, title: "Modification planning - Salle A103", teacher: "Service Technique",
        type: "planning", priority: "normal", time: "Il y a 12h", deadline: "Dans 1 jour",
        students: 45, details: "Maintenance de la salle", status: "pending"
    },
    {
        id: 9, title: "Justificatif d'absence - Marc Leroux", teacher: "Étudiant",
        type: "absence", priority: "low", time: "Il y a 1 jour", deadline: "Dans 6 jours",
        students: 1, details: "Absence pour stage en entreprise", status: "pending"
    },
    {
        id: 10, title: "Notes de TP - Réseaux L3", teacher: "Prof. Blanc",
        type: "notes", priority: "normal", time: "Il y a 1 jour", deadline: "Dans 3 jours",
        students: 78, details: "Travaux pratiques en laboratoire", status: "pending"
    },
    {
        id: 11, title: "Création nouveau projet - IA M1", teacher: "Prof. Leroy",
        type: "course", priority: "low", time: "Il y a 2 jours", deadline: "Dans 10 jours",
        students: 0, details: "Projet de fin d'année", status: "pending"
    },
    {
        id: 12, title: "Modification planning - Examens L2", teacher: "Service Scolarité",
        type: "planning", priority: "normal", time: "Il y a 2 jours", deadline: "Dans 4 jours",
        students: 120, details: "Réorganisation des créneaux d'examens", status: "pending"
    },
    {
        id: 13, title: "Justificatif d'absence - Emma Moreau", teacher: "Étudiante",
        type: "absence", priority: "low", time: "Il y a 3 jours", deadline: "Dans 5 jours",
        students: 1, details: "Absence pour raisons familiales", status: "pending"
    },
    {
        id: 14, title: "Notes d'examen - Physique L1", teacher: "Dr. Lemoine",
        type: "notes", priority: "normal", time: "Il y a 3 jours", deadline: "Dans 2 jours",
        students: 134, details: "Examen final du premier semestre", status: "pending"
    },
    {
        id: 15, title: "Création nouveau cours - Cybersécurité M2", teacher: "Prof. Noir",
        type: "course", priority: "low", time: "Il y a 4 jours", deadline: "Dans 15 jours",
        students: 0, details: "Module spécialisé en sécurité informatique", status: "pending"
    }
];

export const validationData = {
    1: {
        title: "Notes d'examen - Bases de Données L3", teacher: "Dr. Claire Dubois", type: "Notes d'examen",
        students: 89, average: "11.8/20", successRate: "73%", deadline: "Aujourd'hui 18h",
        level: "L3 Informatique", details: "Examen final du module Bases de Données L3. Les notes sont dans la moyenne habituelle mais avec un taux d'échec préoccupant de 27%. Il y a 8 notes en dessous de 8/20 qui nécessitent une attention particulière."
    },
    2: {
        title: "Modification planning - Cours Python L2", teacher: "Prof. Martin", type: "Modification planning",
        oldSlot: "14h-16h", newSlot: "10h-12h", room: "A205", students: 67, date: "Demain",
        details: "Demande de modification de créneau pour éviter un conflit avec une conférence exceptionnelle. La salle A205 est disponible au nouveau créneau. Tous les étudiants ont été prévenus par email."
    },
    3: {
        title: "Création nouveau cours - IA M1", teacher: "Prof. Leroy", type: "Nouveau cours",
        level: "M1", hours: "30h CM + 15h TD", ects: "6", semester: "Semestre prochain",
        details: "Nouveau module d'Intelligence Artificielle pour répondre à la demande croissante du marché. Le programme inclut apprentissage automatique, réseaux de neurones et applications pratiques."
    },
    4: {
        title: "Notes de rattrapage - Algorithmique L2", teacher: "Prof. Martin", type: "Notes de rattrapage",
        students: 12, average: "12.4/20", successRate: "83%", session: "Rattrapage", level: "L2 Informatique",
        details: "Session de rattrapage pour les étudiants ayant échoué au premier examen. Amélioration notable des résultats avec 10 étudiants qui ont validé leur module."
    },
    5: {
        title: "Justificatif d'absence - Sarah Dubois", teacher: "Étudiante", type: "Justificatif d'absence",
        student: "Sarah Dubois", date: "15/01/2025", reason: "Médical", level: "L3 Informatique",
        details: "Certificat médical fourni pour absence justifiée. L'étudiante a manqué le cours de Bases de Données et souhaite récupérer les supports de cours."
    }
};

