
'use client';

import React, { useState, useTransition } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { getAiStudentReport, getAiProfessorReport } from '@/server/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GenerateStudentReportOutput } from '@/blue-ai/flows/generate-student-report';
import type { GenerateProfessorReportOutput } from '@/blue-ai/flows/generate-professor-report';
import AiReportModal from './ai-report-modal';

interface AiReportCardProps {
  role: 'student' | 'professor' | 'admin';
}

export default function AiReportCard({ role }: AiReportCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<GenerateStudentReportOutput | GenerateProfessorReportOutput | null>(null);
  const [semester, setSemester] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReport(null);

    if (!semester) {
      setError('Veuillez sélectionner un semestre.');
      return;
    }

    const formData = new FormData();
    formData.append('semester', semester);

    startTransition(async () => {
      const action = role === 'student' ? getAiStudentReport : getAiProfessorReport;
      const result = await action(null, formData);

      if (result.error) {
        setError(result.error);
      } else if (result.report) {
        setReport(result.report);
        setIsModalOpen(true);
      }
    });
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rapport de Performance IA</CardTitle>
                <CardDescription>
                  Générez un rapport personnalisé basé sur l'IA.
                </CardDescription>
              </div>
              <BrainCircuit className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSemester} value={semester}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semestre 1">Semestre 1</SelectItem>
                <SelectItem value="Semestre 2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !semester}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Générer le rapport'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {report && (
        <AiReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          report={report}
          role={role}
        />
      )}
    </>
  );
}
