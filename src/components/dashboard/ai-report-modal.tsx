'use client';

import React from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { GenerateStudentReportOutput } from '@/ai/flows/generate-student-report';
import Logo from '@/components/logo';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: GenerateStudentReportOutput;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
);

export default function AiReportModal({ isOpen, onClose, report }: AiReportModalProps) {
  const { generalAverage, subjectAverages, courses, absenceHours, comment } = report;

  const handleDownload = () => {
    // In a real app, this would generate a PDF. For now, it's a placeholder.
    alert('La fonctionnalité de téléchargement sera bientôt disponible !');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pr-6">
          <div>
            <DialogTitle className="text-2xl">Rapport de Performance IA</DialogTitle>
            <DialogDescription>
              Rapport pour {report.studentName} - {report.semester}
            </DialogDescription>
          </div>
          <Logo />
        </DialogHeader>
        <Separator />
        <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <ReportSection title="Moyenne Générale">
                    <p className="text-3xl font-bold text-foreground">{generalAverage}/20</p>
                </ReportSection>
                <ReportSection title="Absences">
                    <p className="text-3xl font-bold text-foreground">{absenceHours} heures</p>
                </ReportSection>
            </div>
          
            <ReportSection title="Moyennes par Matière">
                <ul className="space-y-2">
                {subjectAverages.map((subject) => (
                    <li key={subject.subject} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                    <span>{subject.subject}</span>
                    <span className="font-semibold">{subject.average}/20</span>
                    </li>
                ))}
                </ul>
            </ReportSection>

            <ReportSection title="Assiduité aux Cours">
                <p><span className='font-bold text-foreground'>{courses.attended}</span> cours suivis sur <span className='font-bold text-foreground'>{courses.total}</span> au total.</p>
            </ReportSection>

            <ReportSection title="Commentaire de l'IA">
                <p className="italic">{comment}</p>
            </ReportSection>
        </div>
        <Separator />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger le rapport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
