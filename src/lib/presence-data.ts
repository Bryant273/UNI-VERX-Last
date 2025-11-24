

export interface Presence {
    id: number;
    date: string;
    course: string;
    type: string;
    salle: string;
    status: 'present' | 'absent' | 'late' | 'justified';
    time: string;
    arrivalTime: string | null;
    justification: string | null;
}

export const allPresenceData: Presence[] = [
    { id: 1, date: '2025-05-20', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 2, date: '2025-05-19', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:55', justification: null },
    { id: 3, date: '2025-05-17', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'late', time: '08:00-10:00', arrivalTime: '08:15', justification: null },
    { id: 4, date: '2025-05-16', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '13:50', justification: null },
    { id: 5, date: '2025-05-15', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'absent', time: '16:00-18:00', arrivalTime: null, justification: null },
    { id: 6, date: '2025-05-14', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'absent', time: '14:00-16:00', arrivalTime: null, justification: null },
    { id: 7, date: '2025-05-13', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'present', time: '10:00-12:00', arrivalTime: '09:58', justification: null },
    { id: 8, date: '2025-05-10', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '14:02', justification: null },
    { id: 9, date: '2025-05-09', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'justified', time: '14:00-16:00', arrivalTime: null, justification: 'Mission officielle' },
    { id: 10, date: '2025-05-08', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:52', justification: null },
    { id: 11, date: '2025-05-07', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'present', time: '08:00-10:00', arrivalTime: '07:55', justification: null },
    { id: 12, date: '2025-05-06', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'present', time: '16:00-18:00', arrivalTime: '15:58', justification: null },
    { id: 13, date: '2025-05-03', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'present', time: '14:00-16:00', arrivalTime: '13:57', justification: null },
    { id: 14, date: '2025-05-02', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '14:00', justification: null },
    { id: 15, date: '2025-04-30', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'present', time: '10:00-12:00', arrivalTime: '09:58', justification: null },
    { id: 16, date: '2025-04-29', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '13:55', justification: null },
    { id: 17, date: '2025-04-26', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '10:01', justification: null },
    { id: 18, date: '2025-04-25', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'present', time: '08:00-10:00', arrivalTime: '07:58', justification: null },
    { id: 19, date: '2025-04-24', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'present', time: '16:00-18:00', arrivalTime: '16:02', justification: null },
    { id: 20, date: '2025-04-23', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 21, date: '2025-04-22', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'present', time: '14:00-16:00', arrivalTime: '14:05', justification: null },
    { id: 22, date: '2025-04-19', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'present', time: '10:00-12:00', arrivalTime: '09:55', justification: null },
    { id: 23, date: '2025-04-18', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 24, date: '2025-04-17', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:58', justification: null },
    { id: 25, date: '2025-04-16', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '14:01', justification: null },
    { id: 26, date: '2025-04-15', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'present', time: '08:00-10:00', arrivalTime: '07:59', justification: null },
    { id: 27, date: '2025-04-12', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'present', time: '16:00-18:00', arrivalTime: '15:57', justification: null },
    { id: 28, date: '2025-04-11', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'present', time: '14:00-16:00', arrivalTime: '13:59', justification: null },
    { id: 29, date: '2025-04-10', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'present', time: '10:00-12:00', arrivalTime: '10:00', justification: null },
    { id: 30, date: '2025-04-09', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '13:55', justification: null },
    { id: 31, date: '2025-03-28', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '14:00', justification: null },
    { id: 32, date: '2025-03-27', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:57', justification: null },
    { id: 33, date: '2025-03-26', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'present', time: '08:00-10:00', arrivalTime: '08:02', justification: null },
    { id: 34, date: '2025-03-25', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'present', time: '16:00-18:00', arrivalTime: '15:59', justification: null },
    { id: 35, date: '2025-03-24', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 36, date: '2025-03-21', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 37, date: '2025-03-20', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'justified', time: '10:00-12:00', arrivalTime: null, justification: 'Formation continue' },
    { id: 38, date: '2025-03-19', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '13:57', justification: null },
    { id: 39, date: '2025-03-18', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:59', justification: null },
    { id: 40, date: '2025-03-17', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '14:02', justification: null },
    { id: 41, date: '2025-03-14', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'present', time: '08:00-10:00', arrivalTime: '07:58', justification: null },
    { id: 42, date: '2025-03-13', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'late', time: '16:00-18:00', arrivalTime: '16:10', justification: null },
    { id: 43, date: '2025-03-12', course: 'Programmation Python L2', type: 'Cours magistral', salle: 'Amphi A', status: 'absent', time: '14:00-16:00', arrivalTime: null, justification: null },
    { id: 44, date: '2025-03-11', course: 'Algorithmique L1', type: 'TD', salle: 'Salle 204', status: 'present', time: '10:00-12:00', arrivalTime: '09:58', justification: null },
    { id: 45, date: '2025-03-10', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '13:59', justification: null },
    { id: 46, date: '2025-03-07', course: 'Bases de Données L3', type: 'Cours magistral', salle: 'Amphi B', status: 'present', time: '14:00-16:00', arrivalTime: '13:58', justification: null },
    { id: 47, date: '2025-03-06', course: 'Programmation Python L2', type: 'TP', salle: 'Labo 105', status: 'present', time: '10:00-12:00', arrivalTime: '09:55', justification: null },
    { id: 48, date: '2025-03-05', course: 'Algorithmique L1', type: 'Cours magistral', salle: 'Salle 203', status: 'absent', time: '08:00-10:00', arrivalTime: null, justification: null },
    { id: 49, date: '2025-03-04', course: 'Bases de Données L3', type: 'TD', salle: 'Salle 105', status: 'present', time: '16:00-18:00', arrivalTime: '15:58', justification: null },
    { id: 50, date: '2025-03-03', course: 'Projet Informatique M1', type: 'Encadrement', salle: 'Salle projet', status: 'present', time: '14:00-16:00', arrivalTime: '14:01', justification: null }
];
