'use server';
/**
 * @fileOverview An AI agent that generates a student's semester report.
 *
 * - generateStudentReport - A function that handles the report generation.
 * - GenerateStudentReportInput - The input type for the generateStudentReport function.
 * - GenerateStudentReportOutput - The return type for the generateStudentReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { studentData } from '@/lib/data';

// Mock student data - in a real app, this would come from a database.
const MOCK_STUDENT_DATA = {
    "student-alex-dupont": {
        name: "Alex Dupont",
        id: studentData.id,
        class: studentData.class,
        "Semestre 1": {
            generalAverage: 14.5,
            subjectAverages: [
                { subject: 'Advanced Calculus', average: 16 },
                { subject: 'Quantum Physics', average: 13 },
                { subject: 'World History: 20th Century', average: 15 },
            ],
            courses: { attended: 48, total: 50 },
            absenceHours: 4,
        },
        "Semestre 2": {
            generalAverage: 15.2,
            subjectAverages: [
                { subject: 'Literary Theory', average: 17 },
                { subject: 'Data Structures', average: 14 },
                { subject: 'Organic Chemistry', average: 14.5 },
            ],
            courses: { attended: 50, total: 50 },
            absenceHours: 0,
        },
    }
};

const GenerateStudentReportInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  semester: z.string().describe('The semester for which to generate the report (e.g., "Semestre 1").'),
});
export type GenerateStudentReportInput = z.infer<typeof GenerateStudentReportInputSchema>;

const GenerateStudentReportOutputSchema = z.object({
  studentName: z.string(),
  studentId: z.string(),
  studentClass: z.string(),
  semester: z.string(),
  generalAverage: z.number(),
  subjectAverages: z.array(z.object({
    subject: z.string(),
    average: z.number(),
  })),
  courses: z.object({
    attended: z.number(),
    total: z.number(),
  }),
  absenceHours: z.number(),
  comment: z.string().describe("An insightful and encouraging comment from the AI based on the student's performance."),
});
export type GenerateStudentReportOutput = z.infer<typeof GenerateStudentReportOutputSchema>;

export async function generateStudentReport(input: GenerateStudentReportInput): Promise<GenerateStudentReportOutput> {
  return generateStudentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentReportPrompt',
  input: {
    schema: z.object({
      studentName: z.string(),
      semester: z.string(),
      generalAverage: z.number(),
      subjectAverages: z.array(z.object({
        subject: z.string(),
        average: z.number(),
      })),
      absenceHours: z.number(),
    })
  },
  output: {
    schema: z.object({
        comment: z.string().describe("Rédige un commentaire encourageant et constructif pour l'étudiant en français, en analysant ses résultats. Suggère des points d'amélioration si nécessaire."),
    })
  },
  prompt: `
    Student: {{{studentName}}}
    Semester: {{{semester}}}
    Overall Average: {{{generalAverage}}}/20
    Absences: {{{absenceHours}}} hours

    Averages by subject:
    {{#each subjectAverages}}
    - {{{subject}}}: {{{average}}}/20
    {{/each}}

    Based on this data, provide a synthetic and motivational comment for the student.
    If performance is good, congratulate them.
    If there are areas for improvement, mention them constructively.
    The comment should be in French.
  `,
});

const generateStudentReportFlow = ai.defineFlow(
  {
    name: 'generateStudentReportFlow',
    inputSchema: GenerateStudentReportInputSchema,
    outputSchema: GenerateStudentReportOutputSchema,
  },
  async ({ studentId, semester }) => {
    // @ts-ignore
    const student = MOCK_STUDENT_DATA[studentId];
    // @ts-ignore
    const semesterData = student ? student[semester] : null;

    if (!student || !semesterData) {
      throw new Error(`No data found for student ${studentId} for ${semester}.`);
    }

    const promptInput = {
        studentName: student.name,
        semester: semester,
        generalAverage: semesterData.generalAverage,
        subjectAverages: semesterData.subjectAverages,
        absenceHours: semesterData.absenceHours,
    };

    const { output } = await prompt(promptInput);
    
    return {
      ...promptInput,
      ...semesterData,
      studentId: student.id,
      studentClass: student.class,
      comment: output!.comment,
    };
  }
);
