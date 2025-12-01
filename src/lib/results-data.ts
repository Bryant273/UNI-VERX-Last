
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
    creditsToValidate: number;
    creditsValidated: number;
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
        grade: "17,5",
        credits: "6/6",
        creditsToValidate: 6,
        creditsValidated: 6,
        semester: "Semestre 1",
        teacher: "Prof. Dubois",
        ue: "UE: Programmation",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "programmation_s1": {
        id: "programmation_s1",
        name: "Programmation",
        grade: "15,0",
        credits: "4/4",
        creditsToValidate: 4,
        creditsValidated: 4,
        semester: "Semestre 1",
        teacher: "Prof. Laurent",
        ue: "UE: Programmation",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "bases_de_donnees_s1": {
        id: "bases_de_donnees_s1",
        name: "Bases de données",
        grade: "18,0",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 1",
        teacher: "Prof. Leclerc",
        ue: "UE: Systèmes et Réseaux",
        status: "validated",
        details: [],
        teacherComment: ""
    },
     "reseaux_s1": {
        id: "reseaux_s1",
        name: "Réseaux",
        grade: "14,5",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 1",
        teacher: "Prof. Rivière",
        ue: "UE: Systèmes et Réseaux",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "anglais_technique_s1": {
        id: "anglais_technique_s1",
        name: "Anglais technique",
        grade: "12,5",
        credits: "4/4",
        creditsToValidate: 4,
        creditsValidated: 4,
        semester: "Semestre 1",
        teacher: "Prof. Smith",
        ue: "UE: Langues et Communication",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "mathematiques_discretes_s1": {
        id: "mathematiques_discretes_s1",
        name: "Mathématiques discrètes",
        grade: "16,0",
        credits: "3/3",
        creditsToValidate: 3,
        creditsValidated: 3,
        semester: "Semestre 1",
        teacher: "Prof. Girard",
        ue: "UE: Mathématiques",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "statistiques_s1": {
        id: "statistiques_s1",
        name: "Statistiques",
        grade: "13,0",
        credits: "3/3",
        creditsToValidate: 3,
        creditsValidated: 3,
        semester: "Semestre 1",
        teacher: "Prof. Girard",
        ue: "UE: Mathématiques",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "architecture_des_ordinateurs_s2": {
        id: "architecture_des_ordinateurs_s2",
        name: "Architecture des ordinateurs",
        grade: "15,0",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 2",
        teacher: "Prof. Lefevre",
        ue: "UE: Architecture et Systèmes",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "securite_informatique_s2": {
        id: "securite_informatique_s2",
        name: "Sécurité informatique",
        grade: "13,5",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 2",
        teacher: "Prof. Moreau",
        ue: "UE: Architecture et Systèmes",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "developpement_web_s2": {
        id: "developpement_web_s2",
        name: "Développement web",
        grade: "18,5",
        credits: "4/4",
        creditsToValidate: 4,
        creditsValidated: 4,
        semester: "Semestre 2",
        teacher: "Prof. Girard",
        ue: "UE: Développement Avancé",
        status: "validated",
        details: [],
        teacherComment: ""
    },
    "programmation_orientee_objet_s2": {
        id: "programmation_orientee_objet_s2",
        name: "Programmation orientée objet",
        grade: "16,5",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 2",
        teacher: "Prof. Laurent",
        ue: "UE: Développement Avancé",
        status: "validated",
        details: [],
        teacherComment: ""
    },
     "intelligence_artificielle_s2": {
        id: "intelligence_artificielle_s2",
        name: "Intelligence artificielle",
        grade: "9,5",
        credits: "0/6",
        creditsToValidate: 6,
        creditsValidated: 0,
        semester: "Semestre 2",
        teacher: "Prof. Martin",
        ue: "UE: Technologies Avancées",
        status: "failed",
        details: [],
        teacherComment: ""
    },
    "big_data_s2": {
        id: "big_data_s2",
        name: "Big Data",
        grade: "12,5",
        credits: "5/5",
        creditsToValidate: 5,
        creditsValidated: 5,
        semester: "Semestre 2",
        teacher: "Prof. Chen",
        ue: "UE: Technologies Avancées",
        status: "validated",
        details: [],
        teacherComment: ""
    }
};

const s1Courses = [
    coursesResultsData["algorithmique_avancee_s1"],
    coursesResultsData["programmation_s1"],
    coursesResultsData["bases_de_donnees_s1"],
    coursesResultsData["reseaux_s1"],
    coursesResultsData["anglais_technique_s1"],
    coursesResultsData["mathematiques_discretes_s1"],
    coursesResultsData["statistiques_s1"],
];

const s2Courses = [
    coursesResultsData["architecture_des_ordinateurs_s2"],
    coursesResultsData["securite_informatique_s2"],
    coursesResultsData["developpement_web_s2"],
    coursesResultsData["programmation_orientee_objet_s2"],
    coursesResultsData["intelligence_artificielle_s2"],
    coursesResultsData["big_data_s2"],
];

const groupCoursesByUE = (courses: CourseResult[]) => {
    return courses.reduce((acc, course) => {
        (acc[course.ue] = acc[course.ue] || []).push(course);
        return acc;
    }, {} as Record<string, CourseResult[]>);
}

export const semesterResults = {
    s1: {
        average: "15.50",
        mention: "Bien",
        credits: "30",
        creditsStatus: "Tous crédits validés",
        rank: "4ème",
        totalStudents: 67,
        courses: s1Courses,
        groupedCourses: groupCoursesByUE(s1Courses),
    },
    s2: {
        average: "14.60",
        mention: "Bien",
        credits: "24",
        creditsStatus: "6 crédits à rattraper",
        rank: "7ème",
        totalStudents: 65,
        courses: s2Courses,
        groupedCourses: groupCoursesByUE(s2Courses),
    },
    annual: {
        average: "15.05",
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
