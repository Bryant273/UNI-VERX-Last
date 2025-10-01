

export interface CourseResultDetail {
    name: string;
    date: string;
    grade: string;
    coef: number;
    comment: string;
}

export interface CourseResult {
    id: string;
    name: string;
    grade: string;
    credits: string;
    semester: string;
    teacher: string;
    ue: string;
    status: 'validated' | 'failed';
    details: CourseResultDetail[];
    teacherComment: string;
}

export const coursesResultsData: { [key: string]: CourseResult } = {
    "algoritm_s1": {
        id: "algoritm_s1",
        name: "Algorithmique avancée",
        grade: "17,5/20",
        credits: "6/6",
        semester: "Semestre 1",
        teacher: "Prof. Dubois",
        ue: "UE: Programmation",
        status: "validated",
        details: [
            { name: "Interrogation 1", date: "25/09/2024", grade: "16,5/20", coef: 0.15, comment: "Très bonne compréhension des structures de données" },
            { name: "TP noté 1", date: "05/10/2024", grade: "18,0/20", coef: 0.15, comment: "Excellent travail sur les algorithmes de tri" },
            { name: "Devoir maison", date: "25/10/2024", grade: "17,0/20", coef: 0.2, comment: "Très bon travail sur la complexité algorithmique" },
            { name: "TD noté", date: "15/11/2024", grade: "16,5/20", coef: 0.1, comment: "Bonne participation en classe" },
            { name: "Examen final", date: "10/12/2024", grade: "18,0/20", coef: 0.4, comment: "Excellent niveau, quelques imprécisions mineures" }
        ],
        teacherComment: "Excellent travail tout au long du semestre. L'étudiant montre une très bonne compréhension des algorithmes et une capacité à résoudre des problèmes complexes."
    },
     "ia_s2": {
        id: "ia_s2",
        name: "Intelligence artificielle",
        grade: "9,5/20",
        credits: "0/6",
        semester: "Semestre 2",
        teacher: "Prof. Martin",
        ue: "UE: Technologies Avancées",
        status: "failed",
        details: [
            { name: "Interrogation", date: "05/02/2025", grade: "8,5/20", coef: 0.1, comment: "Difficultés avec les concepts fondamentaux" },
            { name: "TP Machine Learning", date: "15/02/2025", grade: "11,0/20", coef: 0.2, comment: "Implémentation partielle des algorithmes" },
            { name: "Quiz en ligne", date: "01/03/2025", grade: "8,5/20", coef: 0.1, comment: "Connaissances à renforcer" },
            { name: "Projet Deep Learning", date: "20/03/2025", grade: "10,0/20", coef: 0.3, comment: "Implémentation incomplète" },
            { name: "Examen final", date: "15/04/2025", grade: "9,0/20", coef: 0.3, comment: "Nombreuses lacunes théoriques et pratiques" }
        ],
        teacherComment: "L'étudiant a montré des difficultés dans la compréhension des concepts fondamentaux de l'intelligence artificielle. Un effort supplémentaire est nécessaire sur les aspects théoriques. Le projet final présentait de bonnes idées mais une implémentation insuffisante. Je recommande vivement un rattrapage pour valider ce module essentiel dans la formation."
    },
};

export const semesterResults = {
    s1: {
        average: "15.50/20",
        mention: "Bien",
        credits: "30",
        creditsStatus: "Tous crédits validés",
        rank: "4ème",
        totalStudents: 67,
        courses: [
             { ue: "UE: Programmation", module: "Algorithmique avancée", grade: "17,5/20", creditsToValidate: 6, creditsValidated: 6 },
             { ue: "UE: Programmation", module: "Programmation", grade: "15,0/20", creditsToValidate: 4, creditsValidated: 4 },
             { ue: "UE: Systèmes et Réseaux", module: "Bases de données", grade: "18,0/20", creditsToValidate: 5, creditsValidated: 5 },
             { ue: "UE: Systèmes et Réseaux", module: "Réseaux", grade: "14,5/20", creditsToValidate: 5, creditsValidated: 5 },
             { ue: "UE: Langues et Communication", module: "Anglais technique", grade: "12,5/20", creditsToValidate: 4, creditsValidated: 4 },
             { ue: "UE: Mathématiques", module: "Mathématiques discrètes", grade: "16,0/20", creditsToValidate: 3, creditsValidated: 3 },
             { ue: "UE: Mathématiques", module: "Statistiques", grade: "13,0/20", creditsToValidate: 3, creditsValidated: 3 },
        ]
    },
    s2: {
        average: "14.60/20",
        mention: "Bien",
        credits: "24",
        creditsStatus: "6 crédits à rattraper",
        rank: "7ème",
        totalStudents: 65,
        courses: [
            { ue: "UE: Architecture et Systèmes", module: "Architecture des ordinateurs", grade: "15,0/20", creditsToValidate: 5, creditsValidated: 5 },
            { ue: "UE: Architecture et Systèmes", module: "Sécurité informatique", grade: "13,5/20", creditsToValidate: 5, creditsValidated: 5 },
            { ue: "UE: Développement Avancé", module: "Développement web", grade: "18,5/20", creditsToValidate: 4, creditsValidated: 4 },
            { ue: "UE: Développement Avancé", module: "Programmation orientée objet", grade: "16,5/20", creditsToValidate: 5, creditsValidated: 5 },
            { ue: "UE: Technologies Avancées", module: "Intelligence artificielle", grade: "9,5/20", creditsToValidate: 6, creditsValidated: 0 },
            { ue: "UE: Technologies Avancées", module: "Big Data", grade: "12,5/20", creditsToValidate: 5, creditsValidated: 5 },
        ]
    },
    annual: {
        average: "15,05/20",
        mention: "Bien",
        credits: "54/60",
        creditsStatus: "6 crédits à rattraper",
        rank: "6ème",
        totalStudents: 65,
        status: "Admis(e)",
        statusDetails: "Seuil requis de 50/60 atteint",
        juryComment: "Excellente année avec des résultats solides. L'étudiant(e) a montré de très bonnes aptitudes en programmation et développement web. Un rattrapage sera nécessaire pour le module d'Intelligence Artificielle. Le jury salue l'implication et les performances générales qui placent l'étudiant(e) dans le top 10% de sa promotion."
    }
}

    