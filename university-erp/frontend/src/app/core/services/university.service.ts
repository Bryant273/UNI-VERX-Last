import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  UniversityUser, 
  Department, 
  UniversityModule, 
  UniversityClass, 
  Room, 
  TimetableEvent,
  AcademicEvent,
  StudentEnrollment,
  EnrolledStudent,
  TeacherFile,
  ScholarshipPayment,
  BudgetItem,
  Report,
  Ticket,
  CourseResult, 
  SemesterResult, 
  AnnualResult, 
  ProfessorStudentGrade
} from '../models/university.model';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private usersSubject = new BehaviorSubject<UniversityUser[]>([]);
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  private modulesSubject = new BehaviorSubject<UniversityModule[]>([]);
  private classesSubject = new BehaviorSubject<UniversityClass[]>([]);
  private academicEventsSubject = new BehaviorSubject<AcademicEvent[]>([]);
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  private eventsSubject = new BehaviorSubject<TimetableEvent[]>([]);

  // Phase 3 Subjects
  private enrollmentsSubject = new BehaviorSubject<StudentEnrollment[]>([]);
  private enrolledStudentsSubject = new BehaviorSubject<EnrolledStudent[]>([]);
  private teacherFilesSubject = new BehaviorSubject<TeacherFile[]>([]);
  private scholarshipsSubject = new BehaviorSubject<ScholarshipPayment[]>([]);

  // Phase 4 Subjects
  private budgetSubject = new BehaviorSubject<BudgetItem[]>([]);
  private reportsSubject = new BehaviorSubject<Report[]>([]);
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private studentResultsSubject = new BehaviorSubject<{ s1: SemesterResult; s2: SemesterResult; annual: AnnualResult } | null>(null);
  private professorStudentsSubject = new BehaviorSubject<Record<string, ProfessorStudentGrade[]>>({});

  constructor() {
    this.initializeMockData();
    // Initialize Phase 5 Mock Data
    this.initializeRoleSpecificMockData();
  }

  // --- Users ---
  getUsers(): Observable<UniversityUser[]> { return this.usersSubject.asObservable(); }
  
  // --- Departments ---
  getDepartments(): Observable<Department[]> { return this.departmentsSubject.asObservable(); }


  // --- Academic Events ---
  getAcademicEvents(): Observable<AcademicEvent[]> { return this.academicEventsSubject.asObservable(); }

  // --- Phase 3 Getters ---
  getEnrollments(): Observable<StudentEnrollment[]> { return this.enrollmentsSubject.asObservable(); }
  getEnrolledStudents(): Observable<EnrolledStudent[]> { return this.enrolledStudentsSubject.asObservable(); }
  getTeacherFiles(): Observable<TeacherFile[]> { return this.teacherFilesSubject.asObservable(); }
  getScholarships(): Observable<ScholarshipPayment[]> { return this.scholarshipsSubject.asObservable(); }

  // --- Phase 4 Getters ---
  getBudgets(): Observable<BudgetItem[]> { return this.budgetSubject.asObservable(); }
  getReports(): Observable<Report[]> { return this.reportsSubject.asObservable(); }
  getTickets(): Observable<Ticket[]> { return this.ticketsSubject.asObservable(); }
  getStudentResults(): Observable<{ s1: SemesterResult; s2: SemesterResult; annual: AnnualResult } | null> { return this.studentResultsSubject.asObservable(); }
  getProfessorStudents(): Observable<Record<string, ProfessorStudentGrade[]>> { return this.professorStudentsSubject.asObservable(); }

  // --- Roles ---
  getRoles(): string[] {
    return [
      'ADMIN',
      'RECTORATE',
      'SECRETARIAT',
      'ACADEMIC ADVISOR',
      'PROFESSOR',
      'STUDENT',
      'ERP PROVIDER'
    ];
  }

  getUserCountByRole(role: string): Observable<number> {
    return this.usersSubject.pipe(
      map((users: UniversityUser[]) => users.filter((u: UniversityUser) => u.role.toUpperCase() === role.toUpperCase()).length)
    );
  }

  // --- Faculties ---
  getFaculties(): string[] {
    return [
      'Sciences & Technologie',
      'Ingénierie',
      'Économie',
      'Lettres & Langues',
      'Médecine'
    ];
  }

  getProfessorName(id: string): Observable<string> {
    return this.usersSubject.pipe(
      map((users: UniversityUser[]) => {
        const prof = users.find((u: UniversityUser) => u.id === id || u.id === `prof-${id}`);
        return prof ? prof.name : id;
      })
    );
  }

  getDepartmentName(id: string): Observable<string> {
    return this.departmentsSubject.pipe(
      map((depts: Department[]) => {
        const dept = depts.find((d: Department) => d.id === id);
        return dept ? dept.name : id;
      })
    );
  }

  getModuleName(id: string): Observable<string> {
    return this.modulesSubject.pipe(
      map((modules: UniversityModule[]) => {
        const module = modules.find((m: UniversityModule) => m.id === id);
        return module ? module.name : id;
      })
    );
  }

  // --- Classes ---
  getClasses(): Observable<UniversityClass[]> { return this.classesSubject.asObservable(); }

  // --- Modules ---
  getModules(): Observable<UniversityModule[]> { return this.modulesSubject.asObservable(); }
  getModulesByDepartment(deptId: string): Observable<UniversityModule[]> {
    return this.modulesSubject.pipe(
      map((modules: UniversityModule[]) => modules.filter((m: UniversityModule) => m.departmentId === deptId))
    );
  }

  // --- Stats Utility ---
  getStats(): Observable<{ students: number; professors: number; courses: number }> {
    return this.usersSubject.pipe(
      map((users: UniversityUser[]) => {
        const students = users.filter((u: UniversityUser) => u.role.toUpperCase() === 'STUDENT').length;
        const professors = users.filter((u: UniversityUser) => u.role.toUpperCase() === 'PROFESSOR').length;
        return { students, professors, courses: this.modulesSubject.value.length };
      })
    );
  }

  // --- Rooms ---
  getRooms(): Observable<Room[]> { return this.roomsSubject.asObservable(); }

  // --- Events (Timetable) ---
  getEventsByClass(classId: string): Observable<TimetableEvent[]> {
    return this.eventsSubject.pipe(
      map((events: TimetableEvent[]) => events.filter((e: TimetableEvent) => e.classId === classId))
    );
  }

  saveEvent(event: TimetableEvent): Observable<TimetableEvent> {
    const current = this.eventsSubject.value;
    const index = current.findIndex((e: TimetableEvent) => e.id === event.id);
    if (index > -1) {
      current[index] = event;
    } else {
      current.push({ ...event, id: `evt-${Date.now()}` });
    }
    this.eventsSubject.next([...current]);
    return of(event);
  }

  private initializeMockData() {
    this.usersSubject.next([
      { id: '1', name: 'Admin User', email: 'admin@university.edu', role: 'ADMIN', status: 'Active', createdAt: '2024-01-01' },
      { id: '2', name: 'Dr. Jane Smith', email: 'jane.smith@university.edu', role: 'PROFESSOR', department: 'Computer Science', status: 'Active', createdAt: '2024-01-05' }
    ]);

    this.departmentsSubject.next([
      { id: 'cs', name: 'Informatique', faculty: 'Sciences & Technologie', headId: 'prof-1', status: 'Active' },
      { id: 'ee', name: 'Génie Électrique', faculty: 'Ingénierie', headId: 'prof-2', status: 'Active' }
    ]);

    this.modulesSubject.next([
      { id: 'm1', code: 'CS101', name: 'Introduction à l\'IA', credits: 4, departmentId: 'cs' },
      { id: 'm2', code: 'PHY302', name: 'Mécanique Quantique', credits: 3, departmentId: 'phy' },
      { id: 'm3', code: 'ECO201', name: 'Microéconomie', credits: 3, departmentId: 'eco' }
    ]);

    this.classesSubject.next([
      { id: 'l3-info', name: 'L3 Informatique', level: 'Licence 3', departmentId: 'cs', studentCount: 120 },
      { id: 'm1-cyber', name: 'M1 Cybersécurité', level: 'Master 1', departmentId: 'cs', studentCount: 45 }
    ]);

    this.roomsSubject.next([
      { id: 'a1', name: 'Amphi A', capacity: 250, type: 'LECTURE_HALL', building: 'Bâtiment A', status: 'AVAILABLE' },
      { id: 'lab-1', name: 'Labo 101', capacity: 30, type: 'LAB', building: 'Bâtiment C', status: 'AVAILABLE' }
    ]);

    this.academicEventsSubject.next([
      { id: 1, title: 'Rentrée Universitaire', startDate: new Date('2024-09-02'), endDate: new Date('2024-09-02'), type: 'rentree' },
      { id: 2, title: 'Vacances de la Toussaint', startDate: new Date('2024-10-26'), endDate: new Date('2024-11-03'), type: 'vacances' },
      { id: 4, title: 'Examens du Semestre 1', startDate: new Date('2025-01-13'), endDate: new Date('2025-01-24'), type: 'examen' }
    ]);

    this.eventsSubject.next([
      { id: 'e1', moduleId: 'CS101', classId: 'l3-info', roomId: 'Amphi A', teacherId: 'prof-1', day: 'Lundi', time: '08:30 - 10:00', type: 'CM' },
      { id: 'e2', moduleId: 'CS101', classId: 'l3-info', roomId: 'Labo 101', teacherId: 'prof-1', day: 'Mardi', time: '10:30 - 12:00', type: 'TD' },
      { id: 'e3', moduleId: 'PHY302', classId: 'l3-info', roomId: 'Amphi A', teacherId: 'prof-2', day: 'Mercredi', time: '13:30 - 15:00', type: 'CM' }
    ]);

    this.enrollmentsSubject.next([
      { id: '1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', level: 'L1', program: 'Informatique', department: 'CS', dateSubmitted: '2024-08-15', status: 'pending' },
      { id: '2', firstName: 'Marie', lastName: 'Curie', email: 'marie.curie@email.com', level: 'L1', program: 'Physique', department: 'PHY', dateSubmitted: '2024-08-16', status: 'pending' }
    ]);

    this.enrolledStudentsSubject.next([
      { id: 's1', name: 'Alice Johnson', email: 'alice.j@uni.edu', role: 'student', studentNumber: '2023001', currentLevel: 'L1', currentProgram: 'Informatique', gpa: 15.5, canProgress: true, fileStatus: 'Complet', status: 'Active', createdAt: '2023-09-01' }
    ]);

    this.initializePhase4MockData();
  }

  private initializePhase4MockData() {
    this.budgetSubject.next([
      { id: 'inc-1-2025', category: 'tuition', categoryLabel: 'Frais de scolarité', type: 'income', amount: 350000000, year: 2025 },
      { id: 'inc-2-2025', category: 'fees', categoryLabel: 'Frais annexes (inscriptions, certifications)', type: 'income', amount: 25000000, year: 2025 },
      { id: 'exp-1-2025', category: 'salaries', categoryLabel: 'Masse salariale (enseignants et admin)', type: 'expense', amount: 220000000, year: 2025 },
      { id: 'exp-2-2025', category: 'utilities', categoryLabel: 'Chares (eau, électricité, internet)', type: 'expense', amount: 45000000, year: 2025 }
    ]);

    this.reportsSubject.next([
      { id: 'rep-001', type: 'attendance', title: 'Rapport de présences', description: 'BDD L3 - Toutes les classes', period: 'Mars 2025', generatedAt: 'Il y a 2 heures', size: '2.3 Mo', status: 'available' },
      { id: 'rep-002', type: 'grades', title: 'Rapport de notes', description: 'Examen BDD - L3 Informatique', period: 'Session Mars', generatedAt: 'Aujourd\'hui', size: '1.8 Mo', status: 'available' }
    ]);

    this.ticketsSubject.next([
      {
        id: 'T-8563', subject: 'Problème d\'accès au cours de BDD', department: 'technique', date: '18/05/2025', lastUpdate: '2025-05-18T10:00:00Z', status: 'open', author: 'Jean Dupont',
        messages: [{ author: 'Jean Dupont', date: '2025-05-18T10:00:00Z', content: 'Bonjour, je n\'arrive pas à accéder aux documents du cours de Bases de Données.' }]
      }
    ]);
  }

  private initializeRoleSpecificMockData() {
    const s1Courses: CourseResult[] = [
      { id: '1', name: 'Algorithmique avancée', grade: 17.5, credits: '6/6', creditsToValidate: 6, creditsValidated: 6, semester: 'S1', teacher: 'Prof. Dubois', ue: 'UE: Programmation', status: 'validated', details: [], teacherComment: '' },
      { id: '2', name: 'Bases de données', grade: 18, credits: '5/5', creditsToValidate: 5, creditsValidated: 5, semester: 'S1', teacher: 'Prof. Leclerc', ue: 'UE: Systèmes et Réseaux', status: 'validated', details: [], teacherComment: '' },
      { id: '3', name: 'Réseaux', grade: 14.5, credits: '5/5', creditsToValidate: 5, creditsValidated: 5, semester: 'S1', teacher: 'Prof. Rivière', ue: 'UE: Systèmes et Réseaux', status: 'validated', details: [], teacherComment: '' }
    ];

    const s2Courses: CourseResult[] = [
      { id: '4', name: 'Développement web', grade: 18.5, credits: '4/4', creditsToValidate: 4, creditsValidated: 4, semester: 'S2', teacher: 'Prof. Girard', ue: 'UE: Développement Avancé', status: 'validated', details: [], teacherComment: '' },
      { id: '5', name: 'Intelligence artificielle', grade: 9.5, credits: '0/6', creditsToValidate: 6, creditsValidated: 0, semester: 'S2', teacher: 'Prof. Martin', ue: 'UE: Technologies Avancées', status: 'failed', details: [], teacherComment: '' }
    ];

    const groupCoursesByUE = (courses: CourseResult[]) => {
      return courses.reduce((acc, course) => {
        (acc[course.ue] = acc[course.ue] || []).push(course);
        return acc;
      }, {} as Record<string, CourseResult[]>);
    };

    this.studentResultsSubject.next({
      s1: { average: 15.5, mention: 'Bien', credits: '30', creditsStatus: 'Tous crédits validés', rank: '4ème', totalStudents: 67, courses: s1Courses, groupedCourses: groupCoursesByUE(s1Courses) },
      s2: { average: 14.6, mention: 'Bien', credits: '24', creditsStatus: '6 crédits à rattraper', rank: '7ème', totalStudents: 65, courses: s2Courses, groupedCourses: groupCoursesByUE(s2Courses) },
      annual: {
        average: 15.05, mention: 'Bien', credits: '54/60', creditsStatus: '6 crédits à rattraper', rank: '6ème', totalStudents: 65, status: 'Admis(e)', statusDetails: 'Seuil requis de 50/60 atteint',
        juryComment: "Excellente année avec des résultats solides. L'étudiant(e) a montré de très bonnes aptitudes."
      }
    });

    this.professorStudentsSubject.next({
      'l3-info': [
        { id: 1, name: 'DUPONT Sarah', number: '22505876', class: 'l3-info', grades: { bdd: { examen: 15, td: 18, tp: 17, qcm_moyenne: 16.5 } }, locked: {} },
        { id: 2, name: 'MARTIN Thomas', number: '22505877', class: 'l3-info', grades: { bdd: { examen: 11, td: 14, tp: 13, qcm_moyenne: 12.5 } }, locked: {} }
      ]
    });
  }
}
