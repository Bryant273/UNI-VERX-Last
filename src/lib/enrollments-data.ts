
export interface NewEnrollment {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    level: string;
    program: string;
    department: string;
    dateSubmitted: string;
    birthDate: string;
    phone: string;
    address: string;
    birthPlace: string;
    previousSchool: string;
    baccalaureateYear: number;
    baccalaureateGrade: string;
    specialty: string;
    loginId: string;
    password?: string;
}

export interface EnrolledStudent {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studentNumber: string;
    currentLevel: string;
    currentProgram: string;
    currentDepartment: string;
    phone: string;
    gpa: string;
    status: string;
    canProgress: boolean;
    enrollmentDate: string;
    credits: number;
    totalCredits: number;
    academicRecord: {
        [key: string]: {
            gpa: number;
            credits: number;
            courses: string[];
        };
    };
}


export const newInscriptionsData: NewEnrollment[] = [
    {
        id: 1, firstName: "Marie", lastName: "Dubois", email: "marie.dubois@email.com",
        level: "L1", program: "Informatique", department: "informatique",
        dateSubmitted: "2025-01-15", birthDate: "2003-08-12", phone: "06.12.34.56.78",
        address: "123 Rue de la Paix, 75001 Paris", birthPlace: "Paris",
        previousSchool: "Lycée Victor Hugo", baccalaureateYear: 2024, baccalaureateGrade: "Mention Bien",
        specialty: "Développement Web", loginId: "marie.dubois2025", password: "Marie2025!"
    },
    {
        id: 2, firstName: "Lucas", lastName: "Martin", email: "lucas.martin@email.com",
        level: "M1", program: "Intelligence Artificielle", department: "informatique",
        dateSubmitted: "2025-01-10", birthDate: "2001-03-22", phone: "06.98.76.54.32",
        address: "456 Avenue des Champs, 69000 Lyon", birthPlace: "Lyon",
        previousSchool: "Université de Lyon", baccalaureateYear: 2023, baccalaureateGrade: "Mention Très Bien",
        specialty: "Machine Learning", loginId: "lucas.martin2025", password: "Lucas2025!"
    },
    {
        id: 3, firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@email.com",
        level: "L2", program: "Mathématiques", department: "mathematiques",
        dateSubmitted: "2025-01-08", birthDate: "2002-11-08", phone: "06.55.44.33.22",
        address: "789 Boulevard Saint-Germain, 33000 Bordeaux", birthPlace: "Bordeaux",
        previousSchool: "Université de Bordeaux", baccalaureateYear: 2022, baccalaureateGrade: "Mention Bien",
        specialty: "", loginId: "sarah.johnson2025", password: "Sarah2025!"
    }
];

export const enrolledStudentsData: EnrolledStudent[] = [
    {
        id: 101, firstName: "Pierre", lastName: "Durand", email: "pierre.durand@email.com",
        studentNumber: "20220101", currentLevel: "L2", currentProgram: "Informatique",
        currentDepartment: "informatique", phone: "06.12.34.56.78",
        gpa: "15.2", status: "active", canProgress: true, enrollmentDate: "2022-09-01",
        credits: 120, totalCredits: 120, academicRecord: {
            semester1: { gpa: 14.8, credits: 30, courses: ["Programmation", "Mathématiques", "Anglais"] },
            semester2: { gpa: 15.6, credits: 30, courses: ["Base de données", "Algorithmique", "Physique"] }
        }
    },
    {
        id: 102, firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.com",
        studentNumber: "20220102", currentLevel: "L1", currentProgram: "Mathématiques",
        currentDepartment: "mathematiques", phone: "06.98.76.54.32",
        gpa: "12.8", status: "active", canProgress: false, enrollmentDate: "2023-09-01",
        credits: 45, totalCredits: 60, academicRecord: {
            semester1: { gpa: 11.2, credits: 25, courses: ["Analyse", "Algèbre", "Géométrie"] },
            semester2: { gpa: 14.4, credits: 20, courses: ["Probabilités", "Statistiques"] }
        }
    },
    {
        id: 103, firstName: "Nicolas", lastName: "Leroy", email: "nicolas.leroy@email.com",
        studentNumber: "20210103", currentLevel: "L3", currentProgram: "Informatique",
        currentDepartment: "informatique", phone: "06.55.44.33.22",
        gpa: "16.7", status: "active", canProgress: true, enrollmentDate: "2021-09-01",
        credits: 180, totalCredits: 180, academicRecord: {
            semester1: { gpa: 16.2, credits: 30, courses: ["Systèmes", "Réseaux", "Génie logiciel"] },
            semester2: { gpa: 17.2, credits: 30, courses: ["Intelligence artificielle", "Sécurité", "Projet"] }
        }
    },
    {
        id: 104, firstName: "Emma", lastName: "Garcia", email: "emma.garcia@email.com",
        studentNumber: "20230104", currentLevel: "M1", currentProgram: "Intelligence Artificielle",
        currentDepartment: "informatique", phone: "06.11.22.33.44",
        gpa: "17.1", status: "active", canProgress: true, enrollmentDate: "2023-09-01",
        credits: 60, totalCredits: 60, academicRecord: {
            semester1: { gpa: 16.8, credits: 30, courses: ["Machine Learning", "Deep Learning", "Vision"] },
            semester2: { gpa: 17.4, credits: 30, courses: ["NLP", "Robotique", "Stage"] }
        }
    }
];

export const getStatusLabel = (canProgress: boolean) => (canProgress ? 'Peut progresser' : 'Redoublement');
export const getStatusColor = (canProgress: boolean) => (canProgress ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300');
