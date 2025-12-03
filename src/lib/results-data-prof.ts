

export const getGradeClass = (grade) => {
    if (grade >= 16) return 'text-green-600';
    if (grade >= 14) return 'text-blue-600';
    if (grade >= 10) return 'text-yellow-600';
    return 'text-red-600';
};

export const calculateSubjectAverage = (grades, subject) => {
    if (!grades[subject]) return null;
    
    const subjectGrades = grades[subject];
    let total = 0;
    let totalCoeff = 0;
    
    const gradeCoefficients = {
        examen: 3, td: 1, tp: 2, qcm_moyenne: 2, devoir: 2, projet: 3, oral: 2
    };
    
    for (const [type, grade] of Object.entries(subjectGrades)) {
        if (grade !== null && grade !== undefined && type !== 'locked') {
            const coeff = gradeCoefficients[type] || 1;
            total += grade * coeff;
            totalCoeff += coeff;
        }
    }
    
    return totalCoeff > 0 ? (total / totalCoeff) : null;
};

export const calculateGeneralAverage = (grades) => {
    const subjects = Object.keys(grades).filter(s => s !== 'locked');
    let total = 0;
    let count = 0;
    
    subjects.forEach(subject => {
        const avg = calculateSubjectAverage(grades, subject);
        if (avg !== null) {
            total += avg;
            count++;
        }
    });
    
    return count > 0 ? (total / count) : null;
};

export const allStudentsData = {
    'l1-info': [
        { id: 11, name: "LEMOINE Alexandre", number: "22505891", class: "l1-info", grades: { python: { examen: null, td: null, tp: null, qcm_moyenne: 14.0 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 13.5 } }, locked: {} },
        { id: 12, name: "ROBERT Camille", number: "22505892", class: "l1-info", grades: { python: { examen: null, td: null, tp: null, qcm_moyenne: 16.5 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 15.0 } }, locked: {} },
    ],
    'l2-info': [
        { id: 23, name: "SIMON Julie", number: "22505903", class: "l2-info", grades: { bdd: { examen: null, td: null, tp: null, qcm_moyenne: 15.5 }, python: { examen: null, td: null, tp: null, qcm_moyenne: 17.0 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 16.0 } }, locked: {} },
        { id: 24, name: "DURAND Marc", number: "22505904", class: "l2-info", grades: { bdd: { examen: null, td: null, tp: null, qcm_moyenne: 13.0 }, python: { examen: null, td: null, tp: null, qcm_moyenne: 14.5 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 12.5 } }, locked: {} },
    ],
    'l3-info': [
        { id: 1, name: "DUPONT Sarah", number: "22505876", class: "l3-info", grades: { bdd: { examen: 15, td: 18, tp: 17, qcm_moyenne: 16.5 }, python: { examen: 13, td: 15, tp: 16, qcm_moyenne: 14.5 }, algo: { examen: 19, td: 17, tp: 18, qcm_moyenne: 18.0 }, web: { examen: 16, td: 14, tp: 15, qcm_moyenne: 15.0 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: null, projet: 17.5 } }, locked: {} },
        { id: 2, name: "MARTIN Thomas", number: "22505877", class: "l3-info", grades: { bdd: { examen: 11, td: 14, tp: 13, qcm_moyenne: 12.5 }, python: { examen: 16, td: 14, tp: 15, qcm_moyenne: 15.0 }, algo: { examen: 14, td: 13, tp: 14, qcm_moyenne: 13.5 }, web: { examen: 11, td: 12, tp: 13, qcm_moyenne: 12.0 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: null, projet: 14.5 } }, locked: {} },
        { id: 3, name: "BERNARD Emma", number: "22505878", class: "l3-info", grades: { bdd: { examen: 19, td: 18, tp: 19, qcm_moyenne: 18.5 }, python: { examen: 18, td: 17, tp: 18, qcm_moyenne: 17.5 }, algo: { examen: 20, td: 19, tp: 20, qcm_moyenne: 19.5 }, web: { examen: 20, td: 18, tp: 19, qcm_moyenne: 19.0 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: null, projet: 18.5 } }, locked: {} },
        { id: 4, name: "LEROY Julie", number: "22505879", class: "l3-info", grades: { bdd: { examen: null, td: null, tp: null, qcm_moyenne: 15.0 }, python: { examen: null, td: null, tp: null, qcm_moyenne: 16.0 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 14.5 }, web: { examen: null, td: null, tp: null, qcm_moyenne: 16.5 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: null, projet: 15.5 } }, locked: {} },
        { id: 5, name: "MOREAU Lucas", number: "22505880", class: "l3-info", grades: { bdd: { examen: null, td: null, tp: null, qcm_moyenne: 11.0 }, python: { examen: null, td: null, tp: null, qcm_moyenne: 13.0 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 12.0 }, web: { examen: null, td: null, tp: null, qcm_moyenne: 10.5 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: null, projet: 11.5 } }, locked: {} },
    ],
    'm1-info': [
        { id: 35, name: "LAURENT Sophie", number: "22505915", class: "m1-info", grades: { web: { examen: null, td: null, tp: null, qcm_moyenne: 18.0 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: 17.5 } }, locked: {} },
        { id: 36, name: "VINCENT Paul", number: "22505916", class: "m1-info", grades: { web: { examen: null, td: null, tp: null, qcm_moyenne: 15.0 }, projet: { examen: null, td: null, tp: null, qcm_moyenne: 16.0 } }, locked: {} },
    ],
    'm2-info': [
        { id: 45, name: "MICHEL Claire", number: "22505925", class: "m2-info", grades: { projet: { examen: null, td: null, tp: null, qcm_moyenne: 19.0 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 18.5 } }, locked: {} },
        { id: 46, name: "THOMAS Henri", number: "22505926", class: "m2-info", grades: { projet: { examen: null, td: null, tp: null, qcm_moyenne: 16.5 }, algo: { examen: null, td: null, tp: null, qcm_moyenne: 17.0 } }, locked: {} },
    ]
};
