'use server';
/**
 * @fileOverview An AI agent that analyzes statistical data and generates comments.
 *
 * - generateStatsReport - A function that handles the report generation.
 * - GenerateStatsReportInput - The input type for the generateStatsReport function.
 * - GenerateStatsReportOutput - The return type for the generateStatsReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KpiSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
});

const ChartDataItemSchema = z.object({
  name: z.string(),
  value: z.number(),
});

const EnrollmentDataItemSchema = z.object({
    year: z.string(),
    L1: z.number(),
    L2: z.number(),
    L3: z.number(),
    M1: z.number(),
    M2: z.number(),
});

const GenerateStatsReportInputSchema = z.object({
  kpis: z.array(KpiSchema).describe("Key Performance Indicators."),
  performanceData: z.array(ChartDataItemSchema).describe("Grade distribution data."),
  enrollmentData: z.array(EnrollmentDataItemSchema).describe("Enrollment evolution data."),
  demographicsData: z.array(ChartDataItemSchema).describe("Student demographics data."),
});
export type GenerateStatsReportInput = z.infer<typeof GenerateStatsReportInputSchema>;

const GenerateStatsReportOutputSchema = z.object({
  kpiSummary: z.string().describe("Analyse globale et concise des indicateurs de performance clés (KPIs) en français."),
  performanceComment: z.string().describe("Commentaire détaillé sur la répartition des notes des étudiants, en soulignant les points forts et les points faibles, en français."),
  enrollmentComment: z.string().describe("Analyse de l'évolution des inscriptions sur les dernières années, en identifiant les tendances par niveau, en français."),
  demographicsComment: z.string().describe("Commentaire sur la répartition démographique des étudiants, en français."),
  globalConclusion: z.string().describe("Une conclusion générale et une ou deux recommandations stratégiques basées sur l'ensemble des données, en français."),
});
export type GenerateStatsReportOutput = z.infer<typeof GenerateStatsReportOutputSchema>;

export async function generateStatsReport(input: GenerateStatsReportInput): Promise<GenerateStatsReportOutput> {
  return generateStatsReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStatsReportPrompt',
  input: { schema: GenerateStatsReportInputSchema },
  output: { schema: GenerateStatsReportOutputSchema },
  prompt: `En tant qu'analyste de données expert dans l'enseignement supérieur, analysez les données suivantes et fournissez des commentaires pertinents et exploitables en français.

**Indicateurs Clés de Performance (KPIs):**
{{#each kpis}}
- {{title}}: {{value}} ({{change}})
{{/each}}

**Performance des étudiants (Répartition des notes):**
{{#each performanceData}}
- Tranche "{{name}}": {{value}} étudiants
{{/each}}

**Évolution des inscriptions:**
{{#each enrollmentData}}
- Année {{year}}: L1: {{L1}}, L2: {{L2}}, L3: {{L3}}, M1: {{M1}}, M2: {{M2}}
{{/each}}

**Démographie (par région):**
{{#each demographicsData}}
- {{name}}: {{value}}%
{{/each}}

Votre analyse doit être structurée avec les sections suivantes :
1.  **kpiSummary**: Un résumé des KPIs.
2.  **performanceComment**: Analysez la répartition des notes. Y a-t-il une concentration dans la moyenne ? Un nombre élevé d'étudiants en échec ou en excellence ?
3.  **enrollmentComment**: Commentez la tendance des inscriptions. Est-elle à la hausse ou à la baisse ? Quels niveaux sont les plus dynamiques ?
4.  **demographicsComment**: Donnez une brève analyse de la répartition des étudiants.
5.  **globalConclusion**: Fournissez une conclusion synthétique et proposez une ou deux recommandations concrètes pour la direction pédagogique.
`,
});

const generateStatsReportFlow = ai.defineFlow(
  {
    name: 'generateStatsReportFlow',
    inputSchema: GenerateStatsReportInputSchema,
    outputSchema: GenerateStatsReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("La génération du rapport a échoué.");
    }
    return output;
  }
);
