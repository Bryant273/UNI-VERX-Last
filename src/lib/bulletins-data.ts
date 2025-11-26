
export type BulletinStatus = 'draft' | 'pending' | 'validated' | 'published' | 'rejected';

export interface Bulletin {
    id: number;
    studentName: string;
    studentNumber: string;
    class: string;
    className: string;
    semester: 'S1' | 'S2';
    average: number;
    status: BulletinStatus;
    lastUpdate: Date;
    isValid: boolean;
    creditsValidated: number;
    creditsTotal: number;
}

const classNames: Record<string, string> = {
    'l1-info': 'L1 Informatique',
    'l2-info': 'L2 Informatique',
    'l3-info': 'L3 Informatique',
    'm1-info': 'M1 Informatique',
    'm2-info': 'M2 Informatique'
};

const students = [
    'MARTIN Sarah', 'DUPONT Thomas', 'BERNARD Emma', 'LEROY Julie', 'MOREAU Lucas',
    'BLANC Marie', 'ROUX Antoine', 'GARCIA David', 'LOPEZ Clara', 'SIMON Paul',
    'LAURENT Sophie', 'VINCENT Paul', 'MICHEL Claire', 'THOMAS Henri', 'ANDRE Sarah',
    'BERGER Tom', 'CARON Zoé', 'DAVID Alex', 'FAURE Emma', 'HENRY Marc',
    'KLEIN Anna', 'JOLY Maxime', 'MOREL Lucas', 'PETIT Sarah', 'DURAND Marc'
];

const generateBulletinsData = (count: number): Bulletin[] => {
    const bulletins: Bulletin[] = [];
    const classes = Object.keys(classNames);
    const statuses: BulletinStatus[] = ['draft', 'pending', 'validated', 'published', 'rejected'];
    const statusWeights = [0.1, 0.15, 0.3, 0.4, 0.05];

    for (let i = 1; i <= count; i++) {
        const studentName = students[i % students.length];
        const studentNumber = `225058${String(i).padStart(3, '0')}`;
        const classCode = classes[i % classes.length];
        const average = parseFloat((8 + (i * 13) % 12 + ((i * 7) % 100) / 100).toFixed(2));
        const semester = i % 2 === 0 ? 'S1' : 'S2';
        const lastUpdate = new Date(2025, 0, (i % 30) + 1);

        // Make status generation deterministic to avoid hydration errors
        const statusIndex = i % statuses.length;
        const status = statuses[statusIndex];

        bulletins.push({
            id: i,
            studentName,
            studentNumber,
            class: classCode,
            className: classNames[classCode],
            semester,
            average,
            status,
            lastUpdate,
            isValid: average >= 10,
            creditsValidated: Math.floor(Math.random() * 10) + (average >= 10 ? 50 : 40),
            creditsTotal: 60
        });
    }
    return bulletins;
};

export const allBulletinsData: Bulletin[] = generateBulletinsData(156);
