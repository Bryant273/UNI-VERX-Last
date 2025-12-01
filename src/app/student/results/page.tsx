
'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { coursesResultsData, semesterResults, type CourseResult } from '@/lib/results-data';
import { studentData } from '@/lib/static-data';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type DisplayType = 'bulletin' | 'course';
type SemesterType = 'all' | 'S1' | 'S2';

const GradeBadge = ({ grade }: { grade: number }) => {
  const gradeClass =
    grade >= 16
      ? 'text-green-600 dark:text-green-400'
      : grade >= 14
      ? 'text-blue-600 dark:text-blue-400'
      : grade >= 10
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';
  return <span className={cn('font-bold', gradeClass)}>{grade.toFixed(2)}/20</span>;
};

const CourseDetailsView = ({ course }: { course: CourseResult }) => (
    <Card>
        <CardHeader>
            <CardTitle>Détail de la matière : {course.name}</CardTitle>
            <CardDescription>{course.ue} - Semestre {course.semester.slice(-1)}</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-muted/50"><CardHeader className="pb-2"><CardTitle className="text-base">Moyenne</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{course.grade}</p></CardContent></Card>
                <Card className="bg-muted/50"><CardHeader className="pb-2"><CardTitle className="text-base">Crédits</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{course.credits}</p></CardContent></Card>
                <Card className="bg-muted/50"><CardHeader className="pb-2"><CardTitle className="text-base">Enseignant</CardTitle></CardHeader><CardContent><p className="text-lg font-medium">{course.teacher}</p></CardContent></Card>
             </div>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Évaluation</TableHead><TableHead>Date</TableHead><TableHead>Note</TableHead><TableHead>Coeff.</TableHead><TableHead>Commentaire</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {course.details.map((detail, index) => (
                        <TableRow key={index}>
                            <TableCell>{detail.name}</TableCell><TableCell>{detail.date}</TableCell>
                            <TableCell>{detail.grade}</TableCell><TableCell>{detail.coef}</TableCell>
                            <TableCell className="italic text-muted-foreground">{detail.comment}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Card className="mt-6 bg-muted/30"><CardHeader><CardTitle className="text-sm">Commentaire de l'enseignant</CardTitle></CardHeader><CardContent><p className="italic">{course.teacherComment}</p></CardContent></Card>
        </CardContent>
    </Card>
);

const BulletinView = ({ semester }: { semester: SemesterType }) => {
    const data = semester === 'all' ? semesterResults.annual : semesterResults[semester.toLowerCase() as 's1' | 's2'];
    const courses = semester === 'S1' ? semesterResults.s1.courses : semester === 'S2' ? semesterResults.s2.courses : [...semesterResults.s1.courses, ...semesterResults.s2.courses];
    const isAnnual = semester === 'all';
    
    return (
        <div id="bulletin-content">
            <Card className="mb-6">
                <CardHeader><CardTitle>Synthèse {isAnnual ? "Annuelle" : `du Semestre ${semester.slice(-1)}`}</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Moyenne</p><p className="text-xl font-bold">{data.average}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Crédits</p><p className="text-xl font-bold">{data.credits}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Classement</p><p className="text-xl font-bold">{data.rank} / {data.totalStudents}</p></CardContent></Card>
                     <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Mention</p><p className="text-xl font-bold">{data.mention}</p></CardContent></Card>
                </CardContent>
                {isAnnual && (
                    <CardFooter className="flex-col items-start gap-4 border-t p-6">
                        <div>
                            <p className="font-semibold">Décision du jury</p>
                            <p className="text-sm text-muted-foreground">{data.juryComment}</p>
                        </div>
                    </CardFooter>
                )}
            </Card>
             <Card>
                <CardHeader><CardTitle>Détail des notes</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>UE</TableHead><TableHead>Module</TableHead><TableHead>Note</TableHead><TableHead>Crédits Obtenus</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course, index) => {
                                const isFailed = parseFloat(course.grade.replace(',', '.')) < 10;
                                return (
                                <TableRow key={index}>
                                    <TableCell>{course.ue}</TableCell>
                                    <TableCell className="font-medium">{course.module}</TableCell>
                                    <TableCell><Badge variant={isFailed ? "destructive" : "secondary"}>{course.grade}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {isFailed ? <XCircle className="h-4 w-4 text-red-500"/> : <CheckCircle className="h-4 w-4 text-green-500"/>}
                                            <span className={cn(isFailed ? 'text-red-500' : 'text-green-500', "font-semibold")}>
                                                {course.creditsValidated}/{course.creditsToValidate}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResultsPage() {
  const [displayType, setDisplayType] = useState<DisplayType>('bulletin');
  const [semester, setSemester] = useState<SemesterType>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleDownload = () => {
    const content = document.getElementById('resultsContainer');
    if (content) {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
        pdf.save('mes_resultats.pdf');
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <div>
                <CardTitle>Mes Résultats</CardTitle>
                <CardDescription>Consultez vos notes, bulletins et moyennes.</CardDescription>
            </div>
            <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Télécharger</Button>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={displayType} onValueChange={(v) => setDisplayType(v as DisplayType)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent><SelectItem value="bulletin">Bulletin</SelectItem><SelectItem value="course">Par matière</SelectItem></SelectContent>
                </Select>
                {displayType === 'bulletin' ? (
                     <Select value={semester} onValueChange={(v) => setSemester(v as SemesterType)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Annuel</SelectItem>
                            <SelectItem value="S1">Semestre 1</SelectItem>
                            <SelectItem value="S2">Semestre 2</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner une matière..."/></SelectTrigger>
                        <SelectContent>
                             {Object.values(coursesResultsData).map(course => (
                                 <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </CardContent>
      </Card>
      
      <div id="resultsContainer">
        {displayType === 'bulletin' && <BulletinView semester={semester} />}
        {displayType === 'course' && selectedCourse && <CourseDetailsView course={coursesResultsData[selectedCourse]} />}
        {displayType === 'course' && !selectedCourse && <p className="text-center text-muted-foreground p-8">Veuillez sélectionner une matière pour voir les détails.</p>}
      </div>
    </div>
  );
}
