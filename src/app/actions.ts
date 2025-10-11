"use server";

import { summarizeCourseMaterials } from "@/ai/flows/summarize-course-materials";
import { generateStudentReport } from "@/ai/flows/generate-student-report";
import { generateProfessorReport } from "@/ai/flows/generate-professor-report";
import { z } from "zod";

const summarySchema = z.object({
  courseMaterial: z.string().min(10, { message: "Le matériel de cours doit contenir au moins 10 caractères." }),
});

export async function getSummary(prevState: any, formData: FormData) {
  const validatedFields = summarySchema.safeParse({
    courseMaterial: formData.get("courseMaterial"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.courseMaterial?.[0]
    };
  }
  
  try {
    const result = await summarizeCourseMaterials({ courseMaterial: validatedFields.data.courseMaterial });
    return { summary: result.summary };
  } catch (error) {
    console.error(error);
    return { error: "La génération du résumé a échoué. Veuillez réessayer." };
  }
}

const reportSchema = z.object({
  semester: z.string(),
});

export async function getAiStudentReport(prevState: any, formData: FormData) {
  const validatedFields = reportSchema.safeParse({
    semester: formData.get("semester"),
  });

  if (!validatedFields.success) {
    return {
      error: "Veuillez sélectionner un semestre.",
    };
  }

  try {
    const result = await generateStudentReport({
      studentId: "student-alex-dupont", // This would be dynamic in a real app
      semester: validatedFields.data.semester,
    });
    return { report: result };
  } catch (error) {
    console.error(error);
    return { error: "Échec de la génération du rapport. Veuillez réessayer." };
  }
}


export async function getAiProfessorReport(prevState: any, formData: FormData) {
  const validatedFields = reportSchema.safeParse({
    semester: formData.get("semester"),
  });

  if (!validatedFields.success) {
    return {
      error: "Veuillez sélectionner un semestre.",
    };
  }

  try {
    const result = await generateProfessorReport({
      professorId: "prof-evelyne-dubois", // This would be dynamic in a real app
      semester: validatedFields.data.semester,
    });
    return { report: result };
  } catch (error) {
    console.error(error);
    return { error: "Échec de la génération du rapport. Veuillez réessayer." };
  }
}
