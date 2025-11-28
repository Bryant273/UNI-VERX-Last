
'use server';
/**
 * @fileOverview An AI agent that summarizes course materials.
 *
 * - summarizeCourseMaterials - A function that handles the summarization of course materials.
 * - SummarizeCourseMaterialsInput - The input type for the summarizeCourseMaterials function.
 * - SummarizeCourseMaterialsOutput - The return type for the summarizeCourseMaterials function.
 */

import {ai} from '@/blue-ai/genkit';
import {z} from 'genkit';

const SummarizeCourseMaterialsInputSchema = z.object({
  courseMaterial: z
    .string()
    .describe('The course material to summarize.'),
});
export type SummarizeCourseMaterialsInput = z.infer<typeof SummarizeCourseMaterialsInputSchema>;

const SummarizeCourseMaterialsOutputSchema = z.object({
  summary: z.string().describe('The summary of the course material.'),
});
export type SummarizeCourseMaterialsOutput = z.infer<typeof SummarizeCourseMaterialsOutputSchema>;

export async function summarizeCourseMaterials(input: SummarizeCourseMaterialsInput): Promise<SummarizeCourseMaterialsOutput> {
  return summarizeCourseMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCourseMaterialsPrompt',
  input: {schema: SummarizeCourseMaterialsInputSchema},
  output: {schema: SummarizeCourseMaterialsOutputSchema},
  prompt: `You are an expert summarizer of course materials.

  Please provide a concise and informative summary of the following course material:

  {{{courseMaterial}}}
  `,
});

const summarizeCourseMaterialsFlow = ai.defineFlow(
  {
    name: 'summarizeCourseMaterialsFlow',
    inputSchema: SummarizeCourseMaterialsInputSchema,
    outputSchema: SummarizeCourseMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
