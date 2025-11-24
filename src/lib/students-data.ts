
export interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    class: string;
    className: string;
    average: number;
    attendance: number;
    status: "excellent" | "good" | "average" | "difficulty" | "absent";
    lastLogin: string;
    photo: string;
    enrollment: string;
    studentId: string;
    totalCredits: number;
    validatedCredits: number;
    ranking: number;
    totalStudents: number;
    passStatus: "Admis" | "Ajournement";
    academicResults: {
        s1: Array<{ ue: string; module: string; grade: string; credits: number; validated: number }>;
        s2: Array<{ ue: string; module: string; grade: string; credits: number; validated: number }>;
    };
    juryComments: string;
}

export const studentsData: Student[] = [
    {
        id: 1,
        name: "Alexandre Martin",
        email: "alexandre.martin@etudiant.univers.fr",
        phone: "06 12 34 56 78",
        birthdate: "15/03/2002",
        class: "l3-info",
        className: "L3 Informatique",
        average: 18.5,
        attendance: 96,
        status: "excellent",
        lastLogin: "Hier 14:30",
        photo: "https://i.pravatar.cc/100?img=1",
        enrollment: "Sept 2022",
        studentId: "22305001",
        totalCredits: 60,
        validatedCredits: 60,
        ranking: 1,
        totalStudents: 67,
        passStatus: "Admis",
        academicResults: {
            s1: [
                { ue: "UE: Programmation", module: "Algorithmique avancée", grade: "18,5/20", credits: 6, validated: 6 },
                { ue: "UE: Programmation", module: "Programmation", grade: "17,0/20", credits: 4, validated: 4 },
                { ue: "UE: Systèmes et Réseaux", module: "Bases de données", grade: "19,0/20", credits: 5, validated: 5 },
                { ue: "UE: Systèmes et Réseaux", module: "Réseaux", grade: "18,0/20", credits: 5, validated: 5 },
                { ue: "UE: Langues et Communication", module: "Anglais technique", grade: "16,5/20", credits: 4, validated: 4 },
                { ue: "UE: Mathématiques", module: "Mathématiques discrètes", grade: "19,0/20", credits: 3, validated: 3 },
                { ue: "UE: Mathématiques", module: "Statistiques", grade: "17,5/20", credits: 3, validated: 3 }
            ],
            s2: [
                { ue: "UE: Architecture et Systèmes", module: "Architecture des ordinateurs", grade: "18,0/20", credits: 5, validated: 5 },
                { ue: "UE: Architecture et Systèmes", module: "Sécurité informatique", grade: "17,5/20", credits: 5, validated: 5 },
                { ue: "UE: Développement Avancé", module: "Développement web", grade: "19,5/20", credits: 4, validated: 4 },
                { ue: "UE: Développement Avancé", module: "Programmation orientée objet", grade: "18,5/20", credits: 5, validated: 5 },
                { ue: "UE: Technologies Avancées", module: "Intelligence artificielle", grade: "17,0/20", credits: 6, validated: 6 },
                { ue: "UE: Technologies Avancées", module: "Big Data", grade: "18,0/20", credits: 5, validated: 5 }
            ]
        },
        juryComments: "Excellent parcours avec des résultats remarquables dans toutes les matières. L'étudiant fait preuve d'une grande rigueur et d'une excellente compréhension des concepts. Félicitations pour ce travail exceptionnel qui place l'étudiant en tête de promotion."
    },
    {
        id: 2,
        name: "Sophie Dubois",
        email: "sophie.dubois@etudiant.univers.fr",
        phone: "06 23 45 67 89",
        birthdate: "22/08/2001",
        class: "m1-info",
        className: "M1 Informatique",
        average: 16.8,
        attendance: 94,
        status: "excellent",
        lastLogin: "Aujourd'hui 09:15",
        photo: "https://i.pravatar.cc/100?img=2",
        enrollment: "Sept 2021",
        studentId: "21405002",
        totalCredits: 60,
        validatedCredits: 60,
        ranking: 3,
        totalStudents: 54,
        passStatus: "Admis",
        academicResults: {
            s1: [
                { ue: "UE: Programmation", module: "Algorithmique avancée", grade: "17,0/20", credits: 6, validated: 6 },
                { ue: "UE: Programmation", module: "Programmation", grade: "16,5/20", credits: 4, validated: 4 },
            ],
            s2: [
                { ue: "UE: Développement Avancé", module: "Développement web", grade: "18,0/20", credits: 4, validated: 4 },
                { ue: "UE: Développement Avancé", module: "Programmation orientée objet", grade: "17,5/20", credits: 5, validated: 5 },
            ]
        },
        juryComments: "Très bon parcours avec des résultats solides et constants. L'étudiante montre une excellente maîtrise des concepts et une progression remarquable."
    },
    {
        id: 3,
        name: "Thomas Bernard",
        email: "thomas.bernard@etudiant.univers.fr",
        phone: "06 34 56 78 90",
        birthdate: "10/12/2003",
        class: "l2-info",
        className: "L2 Informatique",
        average: 14.2,
        attendance: 88,
        status: "good",
        lastLogin: "Hier 16:45",
        photo: "https://i.pravatar.cc/100?img=3",
        enrollment: "Sept 2023",
        studentId: "23205003",
        totalCredits: 60,
        validatedCredits: 56,
        ranking: 12,
        totalStudents: 72,
        passStatus: "Admis",
         academicResults: {
            s1: [
                { ue: "UE: Programmation", module: "Programmation", grade: "15,0/20", credits: 4, validated: 4 },
                { ue: "UE: Systèmes et Réseaux", module: "Bases de données", grade: "15,5/20", credits: 5, validated: 5 },
            ],
            s2: [
                { ue: "UE: Développement Avancé", module: "Développement web", grade: "15,5/20", credits: 4, validated: 4 },
                 { ue: "UE: Technologies Avancées", module: "Intelligence artificielle", grade: "8,5/20", credits: 6, validated: 0 },
            ]
        },
        juryComments: "Bon travail dans l'ensemble. Un rattrapage sera nécessaire en Intelligence Artificielle pour valider l'année."
    },
    {
        id: 4,
        name: "Emma Moreau",
        email: "emma.moreau@etudiant.univers.fr",
        phone: "06 45 67 89 01",
        birthdate: "05/07/2002",
        class: "l3-info",
        className: "L3 Informatique",
        average: 17.9,
        attendance: 98,
        status: "excellent",
        lastLogin: "Aujourd'hui 11:20",
        photo: "https://i.pravatar.cc/100?img=4",
        enrollment: "Sept 2022",
        studentId: "22305004",
        totalCredits: 60,
        validatedCredits: 60,
        ranking: 2,
        totalStudents: 67,
        passStatus: "Admis",
        academicResults: {
             s1: [{ ue: "UE: Programmation", module: "Algorithmique avancée", grade: "18,0/20", credits: 6, validated: 6 }],
             s2: [{ ue: "UE: Développement Avancé", module: "Développement web", grade: "19,0/20", credits: 4, validated: 4 }]
        },
        juryComments: "Parcours exemplaire. Félicitations."
    },
    {
        id: 5,
        name: "Lucas Petit",
        email: "lucas.petit@etudiant.univers.fr",
        phone: "06 56 78 90 12",
        birthdate: "18/11/2004",
        class: "l1-info",
        className: "L1 Informatique",
        average: 11.5,
        attendance: 76,
        status: "difficulty",
        lastLogin: "Il y a 3 jours",
        photo: "https://i.pravatar.cc/100?img=5",
        enrollment: "Sept 2024",
        studentId: "24105005",
        totalCredits: 60,
        validatedCredits: 42,
        ranking: 45,
        totalStudents: 58,
        passStatus: "Ajournement",
        academicResults: {
             s1: [{ ue: "UE: Programmation", module: "Algorithmique avancée", grade: "10,5/20", credits: 6, validated: 6 }],
             s2: [{ ue: "UE: Technologies Avancées", module: "Intelligence artificielle", grade: "8,0/20", credits: 6, validated: 0 }]
        },
        juryComments: "Difficultés importantes. Un suivi personnalisé est recommandé."
    }
];

// Add more students to reach 185 total for realistic pagination
const firstNames = ["Léa", "Manon", "Chloé", "Louis", "Gabriel", "Jules", "Hugo", "Alice", "Rose", "Louise", "Adam", "Arthur", "Raphaël"];
const lastNames = ["Garcia", "Rodriguez", "Gomez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gonzalez", "Martin", "Bernard", "Dubois"];

for (let i = 6; i <= 185; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const average = 8 + Math.random() * 10;
    const attendance = 70 + Math.random() * 30;
    let status: Student['status'] = 'average';
    if (average >= 16) status = 'excellent';
    else if (average >= 13) status = 'good';
    else if (average < 10 || attendance < 80) status = 'difficulty';

    const classOptions = ['l1-info', 'l2-info', 'l3-info', 'm1-info', 'm2-info'];
    const randomClass = classOptions[Math.floor(Math.random() * classOptions.length)];

    studentsData.push({
        id: i,
        name: name,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@etudiant.univers.fr`,
        phone: `06 ${String(Math.floor(10 + Math.random() * 90))} ${String(Math.floor(10 + Math.random() * 90))} ${String(Math.floor(10 + Math.random() * 90))} ${String(Math.floor(10 + Math.random() * 90))}`,
        birthdate: `${String(Math.floor(1+Math.random()*28)).padStart(2,'0')}/${String(Math.floor(1+Math.random()*12)).padStart(2,'0')}/${2000 + Math.floor(Math.random()*5)}`,
        class: randomClass,
        className: randomClass.replace('-', ' ').toUpperCase(),
        average: average,
        attendance: attendance,
        status: status,
        lastLogin: `Il y a ${Math.floor(Math.random()*5)+1} jours`,
        photo: `https://i.pravatar.cc/100?img=${i}`,
        enrollment: `Sept ${2020 + Math.floor(Math.random()*5)}`,
        studentId: `${20+Math.floor(Math.random()*5)}${String(Math.floor(10000+Math.random()*90000))}`,
        totalCredits: 60,
        validatedCredits: average >= 10 ? 60 : 30 + Math.floor(Math.random()*20),
        ranking: Math.floor(2 + Math.random() * 80),
        totalStudents: 82,
        passStatus: average >= 10 ? 'Admis' : 'Ajournement',
        academicResults: {s1:[], s2:[]},
        juryComments: 'Résultats en ligne avec la moyenne de la promotion.'
    });
}

    