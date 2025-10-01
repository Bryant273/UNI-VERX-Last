

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
    "algorithmique_avancee_s1": {
        id: "algorithmique_avancee_s1",
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
    "programmation_s1": {
        id: "programmation_s1",
        name: "Programmation",
        grade: "15,0/20",
        credits: "4/4",
        semester: "Semestre 1",
        teacher: "Prof. Laurent",
        ue: "UE: Programmation",
        status: "validated",
        details: [
            { name: "QCM 1", date: "20/09/2024", grade: "14/20", coef: 0.2, comment: "Bonnes bases." },
            { name: "Projet 1", date: "15/10/2024", grade: "16/20", coef: 0.4, comment: "Projet bien structuré." },
            { name: "Examen final", date: "12/12/2024", grade: "15/20", coef: 0.4, comment: "Bonne maîtrise des concepts." },
        ],
        teacherComment: "Résultats très satisfaisants. Alex est un programmeur compétent."
    },
    "bases_de_donnees_s1": {
        id: "bases_de_donnees_s1",
        name: "Bases de données",
        grade: "18,0/20",
        credits: "5/5",
        semester: "Semestre 1",
        teacher: "Prof. Leclerc",
        ue: "UE: Systèmes et Réseaux",
        status: "validated",
        details: [
            { name: "TP Noté - SQL", date: "01/10/2024", grade: "17/20", coef: 0.3, comment: "Très bonnes requêtes." },
            { name: "Projet - Conception BDD", date: "10/11/2024", grade: "19/20", coef: 0.4, comment: "Excellent modèle conceptuel." },
            { name: "Examen final", date: "15/12/2024", grade: "18/20", coef: 0.3, comment: "Maîtrise parfaite du sujet." },
        ],
        teacherComment: "Alex a excellé dans ce cours. Sa logique et sa rigueur sont impressionnantes."
    },
     "reseaux_s1": {
        id: "reseaux_s1",
        name: "Réseaux",
        grade: "14,5/20",
        credits: "5/5",
        semester: "Semestre 1",
        teacher: "Prof. Rivière",
        ue: "UE: Systèmes et Réseaux",
        status: "validated",
        details: [
            { name: "Contrôle continu 1", date: "11/10/2024", grade: "13/20", coef: 0.25, comment: "Peut mieux faire." },
            { name: "TP - Configuration", date: "08/11/2024", grade: "16/20", coef: 0.25, comment: "Très bon travail pratique." },
            { name: "Examen final", date: "18/12/2024", grade: "14.5/20", coef: 0.5, comment: "Solide." },
        ],
        teacherComment: "Bon semestre. Alex a montré une bonne progression."
    },
    "anglais_technique_s1": {
        id: "anglais_technique_s1",
        name: "Anglais technique",
        grade: "12,5/20",
        credits: "4/4",
        semester: "Semestre 1",
        teacher: "Prof. Smith",
        ue: "UE: Langues et Communication",
        status: "validated",
        details: [
            { name: "Oral", date: "19/10/2024", grade: "11/20", coef: 0.4, comment: "Manque de fluidité." },
            { name: "Examen écrit", date: "11/12/2024", grade: "13.5/20", coef: 0.6, comment: "Bonne compréhension écrite." },
        ],
        teacherComment: "Niveau correct. L'expression orale est à travailler."
    },
    "mathematiques_discretes_s1": {
        id: "mathematiques_discretes_s1",
        name: "Mathématiques discrètes",
        grade: "16,0/20",
        credits: "3/3",
        semester: "Semestre 1",
        teacher: "Prof. Girard",
        ue: "UE: Mathématiques",
        status: "validated",
        details: [
            { name: "Devoir surveillé 1", date: "15/10/2024", grade: "15/20", coef: 0.5, comment: "Bon raisonnement." },
            { name: "Examen final", date: "14/12/2024", grade: "17/20", coef: 0.5, comment: "Excellent." },
        ],
        teacherComment: "Très bon niveau en mathématiques. Alex a une grande facilité avec les concepts abstraits."
    },
    "statistiques_s1": {
        id: "statistiques_s1",
        name: "Statistiques",
        grade: "13,0/20",
        credits: "3/3",
        semester: "Semestre 1",
        teacher: "Prof. Girard",
        ue: "UE: Mathématiques",
        status: "validated",
        details: [
            { name: "Projet d'analyse de données", date: "20/11/2024", grade: "14/20", coef: 0.5, comment: "Bonne analyse." },
            { name: "Examen sur table", date: "20/12/2024", grade: "12/20", coef: 0.5, comment: "Quelques erreurs de calcul." },
        ],
        teacherComment: "Résultats corrects. Une plus grande rigueur dans les calculs est attendue."
    },
    "architecture_des_ordinateurs_s2": {
        id: "architecture_des_ordinateurs_s2",
        name: "Architecture des ordinateurs",
        grade: "15,0/20",
        credits: "5/5",
        semester: "Semestre 2",
        teacher: "Prof. Lefevre",
        ue: "UE: Architecture et Systèmes",
        status: "validated",
        details: [
            { name: "Interrogation", date: "10/02/2025", grade: "14/20", coef: 0.3, comment: "Bonnes connaissances." },
            { name: "TP sur les architectures RISC", date: "10/03/2025", grade: "17/20", coef: 0.3, comment: "Excellent travail pratique." },
            { name: "Examen final", date: "12/04/2025", grade: "14.5/20", coef: 0.4, comment: "Bonne synthèse." },
        ],
        teacherComment: "Très bon semestre. Alex a une compréhension solide de l'architecture des systèmes."
    },
    "securite_informatique_s2": {
        id: "securite_informatique_s2",
        name: "Sécurité informatique",
        grade: "13,5/20",
        credits: "5/5",
        semester: "Semestre 2",
        teacher: "Prof. Moreau",
        ue: "UE: Architecture et Systèmes",
        status: "validated",
        details: [
            { name: "QCM sécurité", date: "15/02/2025", grade: "12/20", coef: 0.2, comment: "Bases à revoir." },
            { name: "Capture The Flag (CTF)", date: "20/03/2025", grade: "15/20", coef: 0.4, comment: "Très bonne performance." },
            { name: "Examen final", date: "18/04/2025", grade: "13/20", coef: 0.4, comment: "Correct." },
        ],
        teacherComment: "Alex a de bonnes intuitions en sécurité, mais doit consolider ses bases théoriques."
    },
    "developpement_web_s2": {
        id: "developpement_web_s2",
        name: "Développement web",
        grade: "18,5/20",
        credits: "4/4",
        semester: "Semestre 2",
        teacher: "Prof. Girard",
        ue: "UE: Développement Avancé",
        status: "validated",
        details: [
            { name: "TP1 - Site responsive", date: "25/02/2025", grade: "18/20", coef: 0.3, comment: "Excellent design et code propre." },
            { name: "TP2 - API REST", date: "25/03/2025", grade: "19/20", coef: 0.4, comment: "API performante et bien documentée." },
            { name: "Examen final", date: "20/04/2025", grade: "18/20", coef: 0.3, comment: "Maîtrise complète des frameworks." },
        ],
        teacherComment: "Excellent travail. Alex est un développeur web très prometteur avec un grand souci du détail."
    },
    "programmation_orientee_objet_s2": {
        id: "programmation_orientee_objet_s2",
        name: "Programmation orientée objet",
        grade: "16,5/20",
        credits: "5/5",
        semester: "Semestre 2",
        teacher: "Prof. Laurent",
        ue: "UE: Développement Avancé",
        status: "validated",
        details: [
            { name: "TP héritage et polymorphisme", date: "01/03/2025", grade: "16/20", coef: 0.5, comment: "Très bonne application des concepts." },
            { name: "Examen final", date: "22/04/2025", grade: "17/20", coef: 0.5, comment: "Très bonne conception." },
        ],
        teacherComment: "Alex maîtrise parfaitement les paradigmes de la POO. Très bon semestre."
    },
     "intelligence_artificielle_s2": {
        id: "intelligence_artificielle_s2",
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
    "big_data_s2": {
        id: "big_data_s2",
        name: "Big Data",
        grade: "12,5/20",
        credits: "5/5",
        semester: "Semestre 2",
        teacher: "Prof. Chen",
        ue: "UE: Technologies Avancées",
        status: "validated",
        details: [
            { name: "Projet Hadoop", date: "15/03/2025", grade: "13/20", coef: 0.6, comment: "Bonne mise en place de l'écosystème." },
            { name: "Présentation Spark", date: "25/04/2025", grade: "12/20", coef: 0.4, comment: "Présentation claire." },
        ],
        teacherComment: "Semestre validé. Alex a su mener à bien le projet technique, qui était l'essentiel du module."
    }
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
             { ue: "UE: Programmation", module: "Algorithmique avancée", grade: "17,5/20", creditsToValidate: 6, creditsValidated: 6, id: "algorithmique_avancee_s1" },
             { ue: "UE: Programmation", module: "Programmation", grade: "15,0/20", creditsToValidate: 4, creditsValidated: 4, id: "programmation_s1" },
             { ue: "UE: Systèmes et Réseaux", module: "Bases de données", grade: "18,0/20", creditsToValidate: 5, creditsValidated: 5, id: "bases_de_donnees_s1" },
             { ue: "UE: Systèmes et Réseaux", module: "Réseaux", grade: "14,5/20", creditsToValidate: 5, creditsValidated: 5, id: "reseaux_s1" },
             { ue: "UE: Langues et Communication", module: "Anglais technique", grade: "12,5/20", creditsToValidate: 4, creditsValidated: 4, id: "anglais_technique_s1" },
             { ue: "UE: Mathématiques", module: "Mathématiques discrètes", grade: "16,0/20", creditsToValidate: 3, creditsValidated: 3, id: "mathematiques_discretes_s1" },
             { ue: "UE: Mathématiques", module: "Statistiques", grade: "13,0/20", creditsToValidate: 3, creditsValidated: 3, id: "statistiques_s1" },
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
            { ue: "UE: Architecture et Systèmes", module: "Architecture des ordinateurs", grade: "15,0/20", creditsToValidate: 5, creditsValidated: 5, id: "architecture_des_ordinateurs_s2" },
            { ue: "UE: Architecture et Systèmes", module: "Sécurité informatique", grade: "13,5/20", creditsToValidate: 5, creditsValidated: 5, id: "securite_informatique_s2" },
            { ue: "UE: Développement Avancé", module: "Développement web", grade: "18,5/20", creditsToValidate: 4, creditsValidated: 4, id: "developpement_web_s2" },
            { ue: "UE: Développement Avancé", module: "Programmation orientée objet", grade: "16,5/20", creditsToValidate: 5, creditsValidated: 5, id: "programmation_orientee_objet_s2" },
            { ue: "UE: Technologies Avancées", module: "Intelligence artificielle", grade: "9,5/20", creditsToValidate: 6, creditsValidated: 0, id: "intelligence_artificielle_s2" },
            { ue: "UE: Technologies Avancées", module: "Big Data", grade: "12,5/20", creditsToValidate: 5, creditsValidated: 5, id: "big_data_s2" },
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
