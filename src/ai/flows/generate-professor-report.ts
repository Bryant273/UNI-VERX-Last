'use server';
/**
 * @fileOverview An AI agent that generates a professor's semester performance report.
 *
 * - generateProfessorReport - A function that handles the report generation.
 * - GenerateProfessorReportInput - The input type for the generateProfessorReport function.
 * - GenerateProfessorReportOutput - The return type for the generateProfessorReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock professor data - in a real app, this would come from a database.
const MOCK_PROFESSOR_DATA = {
    "prof-evelyne-dubois": {
        name: "Dr. Évelyne Dubois",
        department: "Informatique",
        "Semestre 1": {
            coursesTaught: 5,
            studentAttendance: 94.5,
            gradeEvolution: "Augmentation de 8% de la moyenne des étudiants entre le partiel et l'examen final.",
        },
        "Semestre 2": {
            coursesTaught: 4,
            studentAttendance: 96.2,
            gradeEvolution: "Maintien d'un taux de réussite élevé (92%) sur l'ensemble des modules.",
        },
    }
};

const GenerateProfessorReportInputSchema = z.object({
  professorId: z.string().describe("The ID of the professor."),
  semester: z.string().describe('The semester for which to generate the report (e.g., "Semestre 1").'),
});
export type GenerateProfessorReportInput = z.infer<typeof GenerateProfessorReportInputSchema>;

const GenerateProfessorReportOutputSchema = z.object({
  professorName: z.string(),
  department: z.string(),
  semester: z.string(),
  coursesTaught: z.number(),
  studentAttendance: z.number(),
  gradeEvolution: z.string(),
  performanceScore: z.number().describe("Un score de performance global sur 100."),
  comment: z.string().describe("An insightful and constructive comment from the AI based on the professor's performance, in French."),
});
export type GenerateProfessorReportOutput = z.infer<typeof GenerateProfessorReportOutputSchema>;

export async function generateProfessorReport(input: GenerateProfessorReportInput): Promise<GenerateProfessorReportOutput> {
  return generateProfessorReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfessorReportPrompt',
  input: {
    schema: z.object({
      professorName: z.string(),
      semester: z.string(),
      coursesTaught: z.number(),
      studentAttendance: z.number(),
      gradeEvolution: z.string(),
    })
  },
  output: {
    schema: z.object({
        performanceScore: z.number().describe("Calcule un score de performance sur 100 basé sur les données fournies. Le taux de présence et une évolution positive des notes sont les facteurs les plus importants."),
        comment: z.string().describe("Rédige un commentaire encourageant et constructif en français pour le professeur, en analysant ses résultats. Suggère des points d'amélioration si nécessaire et souligne les points forts."),
    })
  },
  prompt: `
    Professor: {{{professorName}}}
    Semester: {{{semester}}}
    Courses Taught: {{{coursesTaught}}}
    Average Student Attendance: {{{studentAttendance}}}%
    Student Grade Evolution: {{{gradeEvolution}}}

    Based on this data, provide a synthetic and motivational comment for the professor and calculate a performance score.
    Highlight strengths like high attendance and positive grade trends.
    If there are areas for improvement, mention them constructively.
    The comment should be in French.
  `,
});

const generateProfessorReportFlow = ai.defineFlow(
  {
    name: 'generateProfessorReportFlow',
    inputSchema: GenerateProfessorReportInputSchema,
    outputSchema: GenerateProfessorReportOutputSchema,
  },
  async ({ professorId, semester }) => {
    // @ts-ignore
    const professor = MOCK_PROFESSOR_DATA[professorId];
    // @ts-ignore
    const semesterData = professor ? professor[semester] : null;

    if (!professor || !semesterData) {
      throw new Error(`No data found for professor ${professorId} for ${semester}.`);
    }

    const promptInput = {
        professorName: professor.name,
        semester: semester,
        coursesTaught: semesterData.coursesTaught,
        studentAttendance: semesterData.studentAttendance,
        gradeEvolution: semesterData.gradeEvolution,
    };

    const { output } = await prompt(promptInput);
    
    return {
      ...promptInput,
      ...semesterData,
      department: professor.department,
      performanceScore: output!.performanceScore,
      comment: output!.comment,
    };
  }
);
