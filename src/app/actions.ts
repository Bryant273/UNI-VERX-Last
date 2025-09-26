"use server";

import { summarizeCourseMaterials } from "@/ai/flows/summarize-course-materials";
import { z } from "zod";

const summarySchema = z.object({
  courseMaterial: z.string().min(10, { message: "Course material must be at least 10 characters long." }),
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
    return { error: "Failed to generate summary. Please try again." };
  }
}
