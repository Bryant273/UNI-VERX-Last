
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'academic' | 'administrative' | 'technical' | 'attendance';

export interface Alert {
    id: number;
    title: string;
    description: string;
    date: string;
    priority: AlertPriority;
    type: AlertType;
    isNew: boolean;
    subject: {
        type: 'student' | 'course' | 'system';
        name: string;
        id: string;
    };
}

export const alertsData: Alert[] = [
    {
        id: 1,
        title: "Chute de performance",
        description: "La moyenne de l'étudiant a chuté de 4 points par rapport au semestre précédent.",
        date: "Il y a 2 heures",
        priority: "critical",
        type: "academic",
        isNew: true,
        subject: { type: "student", name: "Lucas Dupont", id: "ETU-2023-54321" }
    },
    {
        id: 2,
        title: "Taux d'absence élevé",
        description: "L'étudiant a été absent à 35% des cours de 'Réseaux avancés' ce mois-ci.",
        date: "Il y a 8 heures",
        priority: "high",
        type: "attendance",
        isNew: true,
        subject: { type: "student", name: "Juliette Martin", id: "ETU-2022-98765" }
    },
    {
        id: 3,
        title: "Notes faibles pour un cours",
        description: "La moyenne de la classe pour l'examen de 'Physique Quantique II' est de 7.2/20.",
        date: "Hier",
        priority: "high",
        type: "academic",
        isNew: true,
        subject: { type: "course", name: "Physique Quantique II", id: "PHY-401" }
    },
    {
        id: 4,
        title: "Absence à un examen",
        description: "L'étudiant était absent à l'examen final de 'Bases de Données' sans justificatif.",
        date: "Hier",
        priority: "high",
        type: "attendance",
        isNew: false,
        subject: { type: "student", name: "Thomas Leroy", id: "ETU-2023-11223" }
    },
    {
        id: 5,
        title: "Documents manquants",
        description: "Le dossier d'inscription pour l'année prochaine est incomplet.",
        date: "Il y a 2 jours",
        priority: "medium",
        type: "administrative",
        isNew: false,
        subject: { type: "student", name: "Chloé Girard", id: "ETU-2024-33445" }
    },
    {
        id: 6,
        title: "Conflit d'horaire détecté",
        description: "Le cours 'Analyse de Données' et 'Projet Big Data' se chevauchent pour 5 étudiants.",
        date: "Il y a 3 jours",
        priority: "medium",
        type: "technical",
        isNew: false,
        subject: { type: "system", name: "Planification", id: "PLAN-SYS" }
    },
    {
        id: 7,
        title: "Dépassement de capacité",
        description: "Le cours 'Introduction à l'IA' a 150 inscrits pour une salle de 120 places.",
        date: "Il y a 3 jours",
        priority: "medium",
        type: "technical",
        isNew: false,
        subject: { type: "course", name: "Introduction à l'IA", id: "IA-101" }
    },
    {
        id: 8,
        title: "Risque d'abandon",
        description: "L'IA a identifié un risque élevé d'abandon basé sur les notes, l'assiduité et le manque d'engagement.",
        date: "Il y a 4 jours",
        priority: "critical",
        type: "academic",
        isNew: false,
        subject: { type: "student", name: "Marc Antoine", id: "ETU-2024-67890" }
    }
];

export const priorityConfig: Record<AlertPriority, { text: string; color: string; }> = {
    critical: { text: "Critique", color: "bg-red-500" },
    high: { text: "Haute", color: "bg-orange-500" },
    medium: { text: "Moyenne", color: "bg-yellow-500" },
    low: { text: "Faible", color: "bg-blue-500" },
};
