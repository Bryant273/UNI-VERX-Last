
'use client';

import React from 'react';
import type { GenerateStudentReportOutput } from '@/ai/flows/generate-student-report';
import type { GenerateProfessorReportOutput } from '@/ai/flows/generate-professor-report';
import type { GenerateStatsReportOutput } from '@/ai/flows/generate-stats-report';
import Logo from '@/components/logo';

type ReportType = GenerateStudentReportOutput | GenerateProfessorReportOutput | GenerateStatsReportOutput;

interface AiReportPDFProps {
  report: ReportType;
  role?: 'student' | 'professor' | 'admin';
  chartsData?: any;
  year?: string;
}

const ReportSectionPDF: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6A5ACD', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>{title}</h3>
      <div style={{ fontSize: '12px', color: '#333' }}>{children}</div>
    </div>
);

const StudentReportPDF: React.FC<{ report: GenerateStudentReportOutput }> = ({ report }) => {
  const { studentName, studentId, studentClass, semester, generalAverage, subjectAverages, courses, absenceHours, comment } = report;
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6A5ACD', paddingBottom: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Rapport de Performance IA</h1>
          <div style={{ fontSize: '11px', color: '#555' }}>
            <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#000' }}>Étudiant :</strong> {studentName}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#000' }}>Matricule :</strong> {studentId}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#000' }}>Classe :</strong> {studentClass}</p>
            <p style={{ margin: 0 }}><strong style={{ color: '#000' }}>Semestre :</strong> {semester}</p>
          </div>
        </div>
        <Logo />
      </header>
      
      <main>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#555' }}>Moyenne Générale</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#6A5ACD', margin: 0 }}>{generalAverage}/20</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#555' }}>Absences</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#6A5ACD', margin: 0 }}>{absenceHours} heures</p>
          </div>
        </div>

        <ReportSectionPDF title="Moyennes par Matière">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {subjectAverages.map((subject) => (
                <tr key={subject.subject} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{subject.subject}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{subject.average}/20</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSectionPDF>

        <ReportSectionPDF title="Assiduité aux Cours">
          <p><span style={{fontWeight: 'bold'}}>{courses.attended}</span> cours suivis sur <span style={{fontWeight: 'bold'}}>{courses.total}</span> au total.</p>
        </ReportSectionPDF>

        <ReportSectionPDF title="Commentaire de l'IA">
          <p style={{ fontStyle: 'italic', lineHeight: '1.5' }}>{comment}</p>
        </ReportSectionPDF>
      </main>
    </>
  )
}

const ProfessorReportPDF: React.FC<{ report: GenerateProfessorReportOutput }> = ({ report }) => {
  const { professorName, department, semester, performanceScore, coursesTaught, studentAttendance, gradeEvolution, comment } = report;
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6A5ACD', paddingBottom: '15px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Rapport de Performance IA</h1>
          <div style={{ fontSize: '11px', color: '#555' }}>
            <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#000' }}>Professeur :</strong> {professorName}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong style={{ color: '#000' }}>Département :</strong> {department}</p>
            <p style={{ margin: 0 }}><strong style={{ color: '#000' }}>Semestre :</strong> {semester}</p>
          </div>
        </div>
        <Logo />
      </header>

      <main>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#555' }}>Score de Performance</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#6A5ACD', margin: 0 }}>{performanceScore}/100</p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#555' }}>Cours Dispensés</h4>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#6A5ACD', margin: 0 }}>{coursesTaught}</p>
          </div>
        </div>

        <ReportSectionPDF title="Présence des Étudiants">
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{studentAttendance}%</p>
        </ReportSectionPDF>

        <ReportSectionPDF title="Évolution des Notes">
          <p style={{ lineHeight: '1.5' }}>{gradeEvolution}</p>
        </ReportSectionPDF>

        <ReportSectionPDF title="Commentaire de l'IA">
          <p style={{ fontStyle: 'italic', lineHeight: '1.5' }}>{comment}</p>
        </ReportSectionPDF>
      </main>
    </>
  )
}

const StatsReportPDF: React.FC<{ report: GenerateStatsReportOutput, year: string, chartsData: any }> = ({ report, year, chartsData }) => {
    return (
        <>
             <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #6A5ACD', paddingBottom: '15px', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Analyse IA des Statistiques</h1>
                   <div style={{ fontSize: '11px', color: '#555' }}>
                    <p style={{ margin: 0 }}><strong style={{ color: '#000' }}>Année académique :</strong> {year}</p>
                  </div>
                </div>
                <Logo />
            </header>
            <main>
                <ReportSectionPDF title="Résumé des Indicateurs Clés">{report.kpiSummary}</ReportSectionPDF>
                <ReportSectionPDF title="Analyse de la Performance Étudiante">{report.performanceComment}</ReportSectionPDF>
                <ReportSectionPDF title="Analyse des Inscriptions">{report.enrollmentComment}</ReportSectionPDF>
                <ReportSectionPDF title="Analyse Démographique">{report.demographicsComment}</ReportSectionPDF>
                <ReportSectionPDF title="Conclusion & Recommandations">{report.globalConclusion}</ReportSectionPDF>
            </main>
        </>
    )
}

export default function AiReportPDF({ report, role, chartsData, year }: AiReportPDFProps) {
  const isStudentReport = (report: any): report is GenerateStudentReportOutput => role === 'student' && 'studentName' in report;
  const isProfessorReport = (report: any): report is GenerateProfessorReportOutput => role === 'professor' && 'professorName' in report;
  const isStatsReport = (report: any): report is GenerateStatsReportOutput => role === 'admin' && 'kpiSummary' in report;
  
  const renderReport = () => {
    if (isStudentReport(report)) {
      return <StudentReportPDF report={report} />;
    }
    if (isProfessorReport(report)) {
      return <ProfessorReportPDF report={report} />;
    }
    if (isStatsReport(report) && chartsData && year) {
        return <StatsReportPDF report={report} chartsData={chartsData} year={year}/>
    }
    return null;
  }

  return (
    <div
      id="ai-report-pdf-content"
      style={{
        width: '595px', // A4 width in pixels at 72 DPI
        minHeight: '842px', // A4 height
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif',
        color: '#000',
      }}
    >
      {renderReport()}

      <footer style={{ marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #ddd', fontSize: '10px', color: '#888', textAlign: 'center' }}>
        <p>Généré par UNI-VERX - Le Système Universitaire Intelligent</p>
        <p>© 2024 INNOV'KORP. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
