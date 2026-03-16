export type EventType = 'CM' | 'TD' | 'TP' | 'EXAM' | 'OTHER';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'LECTURE_HALL' | 'CLASSROOM' | 'LAB';
  building: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  specialties: string[];
}

export interface UniversityModule {
  id: string;
  code: string;
  name: string;
  credits: number;
  departmentId: string;
  status?: 'Active' | 'Inactive';
}

export interface UniversityClass {
  id: string;
  name: string;
  level: string;
  departmentId: string;
  studentCount: number;
}

export interface TimetableEvent {
  id: string;
  day: string;
  time: string;
  classId: string;
  moduleId: string;
  teacherId: string;
  roomId: string;
  type: EventType;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  faculty: string;
  headId: string;
  status: 'Active' | 'Inactive';
}

export interface UniversityUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  program: string;
  department: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface EnrolledStudent extends UniversityUser {
  studentNumber: string;
  currentLevel: string;
  currentProgram: string;
  gpa: number;
  canProgress: boolean;
  fileStatus: 'Complet' | 'Incomplet' | 'En attente';
}

export interface TeacherFile extends UniversityUser {
  specialty: string;
  fileStatus: 'Complet' | 'Incomplet' | 'En attente';
  lastActivity: string;
}

export interface ScholarshipPayment {
  id: string;
  studentId: string;
  name: string;
  studentNumber: string;
  class: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'late';
  lastPaymentDate?: string;
  avatar?: string;
}

export interface AcademicEvent {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  type: 'vacances' | 'examen' | 'rentree' | 'ferie';
}

// --- Phase 4: Financial & Reporting ---

export type BudgetItemType = 'income' | 'expense';
export type IncomeCategory = 'tuition' | 'fees' | 'donation' | 'other';
export type ExpenseCategory = 'salaries' | 'supplies' | 'maintenance' | 'utilities' | 'marketing' | 'other';

export interface BudgetItem {
  id: string;
  category: IncomeCategory | ExpenseCategory;
  categoryLabel: string;
  type: BudgetItemType;
  amount: number;
  year: number;
}

export type ReportType = 'attendance' | 'grades' | 'progress' | 'activities' | 'custom' | 'comparative';
export type ReportStatus = 'available' | 'processing';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  period: string;
  generatedAt: string;
  size: string;
  status: ReportStatus;
}

export type TicketStatus = 'open' | 'pending' | 'closed';
export type TicketDepartment = 'scolarite' | 'technique' | 'pedagogique';

export interface TicketMessage {
  author: string;
  date: string;
  content: string;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  department: TicketDepartment;
  date: string;
  lastUpdate: string;
  status: TicketStatus;
  author: string;
  messages: TicketMessage[];
}
// --- Phase 5: Additional Roles ---

export interface CourseResultDetail {
  name: string;
  date: string;
  grade: number;
  coef: number;
  comment: string;
}

export interface CourseResult {
  id: string;
  name: string;
  grade: number;
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

export interface SemesterResult {
  average: number;
  mention: string;
  credits: string;
  creditsStatus: string;
  rank: string;
  totalStudents: number;
  courses: CourseResult[];
  groupedCourses: Record<string, CourseResult[]>;
}

export interface AnnualResult {
  average: number;
  mention: string;
  credits: string;
  creditsStatus: string;
  rank: string;
  totalStudents: number;
  status: string;
  statusDetails: string;
  juryComment: string;
}

export interface ProfessorStudentGrade {
  id: number;
  name: string;
  number: string;
  class: string;
  grades: Record<string, Record<string, number | null>>;
  locked: Record<string, boolean>;
}
