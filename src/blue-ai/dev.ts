
import { config } from 'dotenv';
config();

import '@/blue-ai/flows/summarize-course-materials.ts';
import '@/blue-ai/flows/summarize-document-uploads.ts';
import '@/blue-ai/flows/generate-student-report.ts';
import '@/blue-ai/flows/generate-professor-report.ts';
import '@/blue-ai/flows/generate-stats-report.ts';
