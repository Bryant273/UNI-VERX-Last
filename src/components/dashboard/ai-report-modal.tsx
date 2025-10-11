'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
import type { GenerateProfessorReportOutput } from '@/ai/flows/generate-professor-report';
import Logo from '@/components/logo';
import AiReportPDF from './ai-report-pdf';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: GenerateStudentReportOutput | GenerateProfessorReportOutput;
  role: 'student' | 'professor' | 'admin';
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
);

const StudentReportContent: React.FC<{ report: GenerateStudentReportOutput }> = ({ report }) => {
  const { generalAverage, subjectAverages, courses, absenceHours, comment } = report;
  return (
    <>
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
    </>
  )
};

const ProfessorReportContent: React.FC<{ report: GenerateProfessorReportOutput }> = ({ report }) => {
  const { performanceScore, coursesTaught, studentAttendance, gradeEvolution, comment } = report;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <ReportSection title="Score de Performance">
            <p className="text-3xl font-bold text-foreground">{performanceScore}/100</p>
        </ReportSection>
        <ReportSection title="Cours Dispensés">
            <p className="text-3xl font-bold text-foreground">{coursesTaught}</p>
        </ReportSection>
      </div>
       <ReportSection title="Présence des Étudiants">
          <p className="text-3xl font-bold text-foreground">{studentAttendance}%</p>
      </ReportSection>
      <ReportSection title="Évolution des Notes">
          <p>{gradeEvolution}</p>
      </ReportSection>
      <ReportSection title="Commentaire de l'IA">
          <p className="italic">{comment}</p>
      </ReportSection>
    </>
  )
};


export default function AiReportModal({ isOpen, onClose, report, role }: AiReportModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const pdfContainer = document.getElementById('pdf-container');

    if (pdfContainer) {
      const canvas = await html2canvas(pdfContainer, {
        scale: 2, 
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      const reportName = 'studentName' in report ? report.studentName : report.professorName;
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Rapport_${reportName.replace(' ', '_')}_${report.semester}.pdf`);
    }

    setIsDownloading(false);
  };
  
  const isStudentReport = (report: any): report is GenerateStudentReportOutput => role === 'student' && 'studentName' in report;

  return (
    <>
      {/* Hidden container for PDF generation */}
      <div id="pdf-container" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <AiReportPDF report={report} role={role} />
      </div>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="flex flex-row items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-2xl mb-2">Rapport de Performance IA</DialogTitle>
              <DialogDescription asChild>
                {isStudentReport(report) ? (
                  <div className='space-y-1 text-xs'>
                    <div><span className='font-semibold text-foreground'>Étudiant :</span> {report.studentName}</div>
                    <div><span className='font-semibold text-foreground'>Matricule :</span> {report.studentId}</div>
                    <div><span className='font-semibold text-foreground'>Classe :</span> {report.studentClass}</div>
                    <div><span className='font-semibold text-foreground'>Semestre :</span> {report.semester}</div>
                  </div>
                ) : (
                   <div className='space-y-1 text-xs'>
                    <div><span className='font-semibold text-foreground'>Professeur :</span> {report.professorName}</div>
                    <div><span className='font-semibold text-foreground'>Département :</span> {report.department}</div>
                    <div><span className='font-semibold text-foreground'>Semestre :</span> {report.semester}</div>
                  </div>
                )}
              </DialogDescription>
            </div>
            <Logo />
          </DialogHeader>
          <Separator />
          <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
              {isStudentReport(report) 
                ? <StudentReportContent report={report} /> 
                : <ProfessorReportContent report={report as GenerateProfessorReportOutput} />
              }
          </div>
          <Separator />
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le rapport
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
