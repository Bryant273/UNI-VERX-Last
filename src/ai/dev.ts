import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-course-materials.ts';
import '@/ai/flows/summarize-document-uploads.ts';
import '@/ai/flows/generate-student-report.ts';
import '@/ai/flows/generate-professor-report.ts';
import '@/ai/flows/generate-stats-report.ts';
