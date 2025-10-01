
'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { jsPDF as jsPDFType } from 'jspdf';
import {
  GraduationCap,
  Award,
  TrendingUp,
  Download,
  CheckCircle2,
  MessageCircle,
  Info,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { studentData } from '@/lib/static-data';
import { coursesResultsData, semesterResults } from '@/lib/results-data';
import { cn } from '@/lib/utils';
import { getLogoSvg } from '@/components/logo';


const getGradeClass = (grade: string): string => {
  if (!grade) return '';
  const numericGrade = parseFloat(grade.split('/')[0].replace(',', '.'));
  if (numericGrade >= 16) return 'text-green-600 dark:text-green-400';
  if (numericGrade >= 14) return 'text-blue-600 dark:text-blue-400';
  if (numericGrade >= 10) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

const getPdfGradeColor = (grade: string): [number, number, number] => {
    if (!grade) return [0, 0, 0]; // Black
    const numericGrade = parseFloat(grade.split('/')[0].replace(',', '.'));
    if (numericGrade >= 16) return [34, 139, 34]; // ForestGreen
    if (numericGrade >= 14) return [0, 0, 255]; // Blue
    if (numericGrade >= 10) return [255, 165, 0]; // Orange
    return [255, 0, 0]; // Red
};


const getCreditsClass = (status: 'validated' | 'failed' | 'pending') => {
    if (status === 'validated') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    if (status === 'failed') return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
}

const allCoursesForFilter = [
    ...semesterResults.s1.courses.map(c => ({...c, id: c.module.toLowerCase().replace(/ /g, '_') + '_s1', semester: 'Semestre 1'})),
    ...semesterResults.s2.courses.map(c => ({...c, id: c.module.toLowerCase().replace(/ /g, '_') + '_s2', semester: 'Semestre 2'}))
];

const groupCoursesByUE = (courses: typeof semesterResults.s1.courses) => {
    return courses.reduce((acc, course) => {
        (acc[course.ue] = acc[course.ue] || []).push(course);
        return acc;
    }, {} as { [key: string]: typeof semesterResults.s1.courses });
};


export default function ResultsPage() {
  const [displayType, setDisplayType] = useState('bulletin');
  const [semester, setSemester] = useState('annual');
  const [course, setCourse] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 0;

    // --- En-tête ---
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Bulletin de Résultats', pageWidth / 2, y + 40, { align: 'center' });
    y += 70;

    // --- Logo ---
    const logoSvgString = getLogoSvg();
    const img = new Image();
    const svgBlob = new Blob([logoSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const convertSvgToPng = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const desiredWidth = 40;
                const aspectRatio = img.width / img.height;
                canvas.width = desiredWidth;
                canvas.height = desiredWidth / aspectRatio;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
            img.src = url;
        });
    };

    try {
        const pngDataUrl = await convertSvgToPng();
        doc.addImage(pngDataUrl, 'PNG', 40, y - 20, 40, 40);
    } catch (e) {
        console.error("Failed to render SVG to PNG for PDF", e);
    }

    // --- Informations de l'étudiant ---
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const studentInfoX = 100;
    doc.text(`Nom: ${studentData.lastName}`, studentInfoX, y - 10);
    doc.text(`Prénoms: ${studentData.firstName}`, studentInfoX, y + 5);
    doc.text(`Matricule: ${studentData.id}`, studentInfoX, y + 20);
    doc.text(`Classe: ${studentData.class}`, studentInfoX + 200, y - 10);
    
    y += 40;

    // --- Table des résultats ---
    const s1Grouped = groupCoursesByUE(semesterResults.s1.courses);
    const s2Grouped = groupCoursesByUE(semesterResults.s2.courses);

    const head = [['Semestre', 'UE', 'Module', 'Note', 'Crédits validés']];
    const body: any[] = [];
    
    // Process Semestre 1
    const s1Courses = Object.values(s1Grouped).flat();
    Object.entries(s1Grouped).forEach(([ue, courses], ueIndex) => {
        courses.forEach((course, courseIndex) => {
            const row = [];
            // Semestre Cell
            if (ueIndex === 0 && courseIndex === 0) {
                row.push({ content: 'Semestre 1', rowSpan: s1Courses.length, styles: { valign: 'middle', halign: 'center' } });
            }
            // UE Cell
            if (courseIndex === 0) {
                row.push({ content: ue, rowSpan: courses.length, styles: { valign: 'middle' } });
            }
            // Other cells
            row.push(course.module);
            row.push({ content: course.grade, styles: { textColor: getPdfGradeColor(course.grade) } });
            row.push(course.creditsValidated);
            body.push(row);
        });
    });

    // Process Semestre 2
    const s2Courses = Object.values(s2Grouped).flat();
    Object.entries(s2Grouped).forEach(([ue, courses], ueIndex) => {
        courses.forEach((course, courseIndex) => {
            const row = [];
            // Semestre Cell
            if (ueIndex === 0 && courseIndex === 0) {
                row.push({ content: 'Semestre 2', rowSpan: s2Courses.length, styles: { valign: 'middle', halign: 'center' } });
            }
            // UE Cell
            if (courseIndex === 0) {
                row.push({ content: ue, rowSpan: courses.length, styles: { valign: 'middle' } });
            }
            // Other cells
            row.push(course.module);
            row.push({ content: course.grade, styles: { textColor: getPdfGradeColor(course.grade) } });
            row.push(course.creditsValidated);
            body.push(row);
        });
    });
    
    // Total row
    const totalData = semesterResults.annual;
    body.push([
        { content: 'Total Année', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', fillColor: '#F1F5F9' } },
        { content: totalData.average, styles: { fontStyle: 'bold', textColor: getPdfGradeColor(totalData.average), fillColor: '#F1F5F9' } },
        { content: totalData.credits, styles: { fontStyle: 'bold', fillColor: '#F1F5F9' } }
    ]);


    (doc as jsPDFType).autoTable({
        head: head,
        body: body,
        startY: y,
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: 'bold' },
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 6,
        },
        columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 140, fontStyle: 'bold' },
            2: { cellWidth: 'auto' },
            3: { halign: 'center', cellWidth: 60, fontStyle: 'bold' },
            4: { halign: 'center', cellWidth: 80, fontStyle: 'bold' }
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.row.raw.length > 3) { // Exclude total row
                // Apply background color to UE cells
                 if (data.column.index === 1 && data.cell.raw.rowSpan) {
                    data.cell.styles.fillColor = '#fafafa';
                }
            }
        }
    });

    // --- Pied de page ---
    y = (doc as any).lastAutoTable.finalY + 20;

    const juryComment = semesterResults.annual.juryComment;
    if (juryComment) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Commentaires du jury:", 40, y);
        y += 20;
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        const splitComment = doc.splitTextToSize(juryComment, pageWidth - 80);
        doc.text(splitComment, 40, y);
        y += (splitComment.length * 10) + 30;
    }
    
    doc.setLineWidth(1.5);
    doc.line(40, y, pageWidth - 40, y);
    y += 15;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Cachet de l'établissement :", pageWidth - 40, y, { align: 'right'});


    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Imprimé via UNI-VERX®', pageWidth / 2, pageHeight - 30, { align: 'center' });

    doc.save(`bulletin_annuel_${studentData.name.replace(' ', '_')}.pdf`);
    setIsGeneratingPdf(false);
  };


  const renderSemesterTable = (semesterKey: 's1' | 's2') => {
    const data = semesterResults[semesterKey];
    const groupedCourses = groupCoursesByUE(data.courses);

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Semestre {semesterKey === 's1' ? 1 : 2}</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">UE</TableHead>
                                <TableHead>Module</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Crédits à valider</TableHead>
                                <TableHead>Crédits validés</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(groupedCourses).map(([ue, courses]) => (
                                courses.map((course, courseIndex) => (
                                    <TableRow key={`${ue}-${course.module}`}>
                                        {courseIndex === 0 && <TableCell rowSpan={courses.length} className="font-medium align-middle text-center bg-muted/30">{ue}</TableCell>}
                                        <TableCell>{course.module}</TableCell>
                                        <TableCell className={cn("font-semibold", getGradeClass(course.grade))}>{course.grade}</TableCell>
                                        <TableCell>{course.creditsToValidate}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-0 ${getCreditsClass(course.creditsValidated > 0 ? 'validated' : 'failed')}`}>
                                                {course.creditsValidated}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2} className="text-right font-bold">Total Semestre {semesterKey === 's1' ? 1 : 2}</TableCell>
                                <TableCell className={cn("font-bold", getGradeClass(data.average))}>{data.average}</TableCell>
                                <TableCell>30</TableCell>
                                <TableCell className="font-bold">{data.credits}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
                             <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-2xl font-bold", getGradeClass(data.average))}>{data.average}</div>
                            <p className="text-xs text-muted-foreground">Mention : {data.mention}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Crédits ECTS</CardTitle>
                             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.credits}</div>
                            <p className="text-xs text-muted-foreground">{data.creditsStatus}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Classement</CardTitle>
                             <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.rank}</div>
                            <p className="text-xs text-muted-foreground">Sur {data.totalStudents} étudiants</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
  }

  const renderAnnualView = () => {
    const data = semesterResults.annual;
    const s1Grouped = groupCoursesByUE(semesterResults.s1.courses);
    const s2Grouped = groupCoursesByUE(semesterResults.s2.courses);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bulletin annuel</CardTitle>
            </CardHeader>
            <CardContent>
                <div id="annual-bulletin-table" className="overflow-x-auto mb-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Semestre</TableHead>
                                <TableHead>UE</TableHead>
                                <TableHead>Module</TableHead>
                                <TableHead>Moyenne</TableHead>
                                <TableHead>Crédits validés</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Semestre 1 */}
                            {Object.entries(s1Grouped).map(([ue, courses], ueIndex) => (
                                courses.map((course, courseIndex) => (
                                    <TableRow key={`s1-${ue}-${course.module}`}>
                                        {ueIndex === 0 && courseIndex === 0 && (
                                            <TableCell rowSpan={semesterResults.s1.courses.length} className="font-semibold align-middle text-center bg-muted/30">
                                                Semestre 1
                                            </TableCell>
                                        )}
                                        {courseIndex === 0 && (
                                            <TableCell rowSpan={courses.length} className="font-medium align-middle bg-muted/20">{ue}</TableCell>
                                        )}
                                        <TableCell>{course.module}</TableCell>
                                        <TableCell className={cn("font-semibold", getGradeClass(course.grade))}>{course.grade}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-0 ${getCreditsClass(course.creditsValidated > 0 ? 'validated' : 'failed')}`}>
                                                {course.creditsValidated}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}

                             {/* Semestre 2 */}
                             {Object.entries(s2Grouped).map(([ue, courses], ueIndex) => (
                                courses.map((course, courseIndex) => (
                                    <TableRow key={`s2-${ue}-${course.module}`}>
                                        {ueIndex === 0 && courseIndex === 0 && (
                                            <TableCell rowSpan={semesterResults.s2.courses.length} className="font-semibold align-middle text-center bg-muted/30">
                                                Semestre 2
                                            </TableCell>
                                        )}
                                        {courseIndex === 0 && (
                                            <TableCell rowSpan={courses.length} className="font-medium align-middle bg-muted/20">{ue}</TableCell>
                                        )}
                                        <TableCell>{course.module}</TableCell>
                                        <TableCell className={cn("font-semibold", getGradeClass(course.grade))}>{course.grade}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-0 ${getCreditsClass(course.creditsValidated > 0 ? 'validated' : 'failed')}`}>
                                                {course.creditsValidated}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="text-base bg-muted/80">
                                <TableCell colSpan={3} className="text-right font-extrabold">Total Année</TableCell>
                                <TableCell className={cn("font-extrabold", getGradeClass(data.average))}>{data.average}</TableCell>
                                <TableCell className="font-extrabold">{data.credits}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                     <Card className="lg:col-span-1 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center p-6">
                        <div className="text-center">
                            <CardTitle className="text-base font-medium text-center mb-1">Moyenne annuelle</CardTitle>
                            <p className={cn("text-4xl font-bold", getGradeClass(data.average))}>{data.average}</p>
                            <p className="text-sm text-muted-foreground mt-1">Mention : {data.mention}</p>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-6">
                         <div className="relative h-24 w-24 mb-3">
                            <Progress value={(parseInt(data.credits.split('/')[0]) / 60) * 100} className="absolute w-full h-full rounded-full" />
                             <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary">{Math.round((parseInt(data.credits.split('/')[0]) / 60) * 100)}%</div>
                        </div>
                        <div className="text-center">
                           <CardTitle className="text-base font-medium">Crédits validés</CardTitle>
                           <p className="text-lg font-bold">{data.credits}</p>
                           <p className="text-sm text-muted-foreground">{data.creditsStatus}</p>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-6">
                         <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                            <Award className="h-10 w-10" />
                        </div>
                        <div className="text-center">
                           <CardTitle className="text-base font-medium">Classement</CardTitle>
                           <p className="text-lg font-bold">{data.rank}</p>
                           <p className="text-sm text-muted-foreground">sur {data.totalStudents} étudiants (Top 10%)</p>
                        </div>
                    </Card>
                     <Card className="flex flex-col items-center justify-center p-6">
                        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 mb-3">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                         <div className="text-center">
                           <CardTitle className="text-base font-medium">Statut</CardTitle>
                           <p className="text-lg font-bold text-green-600">{data.status}</p>
                            <p className="text-sm text-muted-foreground">{data.statusDetails}</p>
                        </div>
                    </Card>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-base font-medium mb-2">Commentaires du jury</h4>
                    <p className="text-sm text-muted-foreground italic">
                        {data.juryComment}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
  }

  const renderCourseDetailView = () => {
    const courseData = coursesResultsData[course as keyof typeof coursesResultsData];
    if (!courseData) return <p>Veuillez sélectionner une matière.</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Détail de la matière : {courseData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Moyenne Matière</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={cn("text-2xl font-bold", getGradeClass(courseData.grade))}>{courseData.grade}</p>
                            <p className="text-xs text-muted-foreground">{courseData.semester}</p>
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Crédits ECTS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{courseData.credits}</p>
                            <p className={`text-xs mt-1 ${courseData.status === 'validated' ? 'text-green-600' : 'text-red-600'}`}>
                                {courseData.status === 'validated' ? 'Validé' : 'Non validé - Rattrapage requis'}
                            </p>
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Enseignant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold">{courseData.teacher}</p>
                            <p className="text-xs text-muted-foreground">{courseData.ue}</p>
                        </CardContent>
                     </Card>
                 </div>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Évaluation</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Coefficient</TableHead>
                                <TableHead>Commentaire</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courseData.details.map(detail => (
                                <TableRow key={detail.name}>
                                    <TableCell>{detail.name}</TableCell>
                                    <TableCell>{detail.date}</TableCell>
                                    <TableCell className={cn("font-semibold", getGradeClass(detail.grade))}>{detail.grade}</TableCell>
                                    <TableCell>x {detail.coef}</TableCell>
                                    <TableCell className="text-muted-foreground italic">"{detail.comment}"</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                         <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2} className="text-right font-bold">Moyenne finale</TableCell>
                                <TableCell className={cn("font-bold", getGradeClass(courseData.grade))}>{courseData.grade}</TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                 </div>

                 <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-base font-medium mb-2">Note de l'enseignant</h4>
                    <p className="text-sm text-muted-foreground italic">
                        {courseData.teacherComment}
                    </p>
                    <div className="mt-4 flex justify-end">
                        <Button variant="link" className="p-0 h-auto"><MessageCircle className="mr-2"/> Contacter l'enseignant</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  const renderContent = () => {
    if (displayType === 'course') {
        if (!course) {
            return (
                <Card>
                    <CardContent className="pt-6">
                         <div className="text-center p-8 border-2 border-dashed rounded-lg">
                            <Info className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">Veuillez sélectionner une matière</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Choisissez une matière dans le menu ci-dessus pour voir les détails.</p>
                        </div>
                    </CardContent>
                </Card>
            )
        }
        return renderCourseDetailView();
    }
    
    if (displayType === 'bulletin') {
        if (semester === 's1') return renderSemesterTable('s1');
        if (semester === 's2') return renderSemesterTable('s2');
        return renderAnnualView();
    }

    return null;
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{studentData.name}</h1>
                        <p className="text-sm text-muted-foreground">{studentData.class} • {studentData.id}</p>
                    </div>
                </div>
                <Button onClick={generatePdf} disabled={isGeneratingPdf || semester !== 'annual'}>
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le bulletin annuel
                    </>
                  )}
                </Button>
            </CardHeader>
        </Card>

        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="displayType" className="text-sm font-medium text-muted-foreground">Type d'affichage</label>
                        <Select value={displayType} onValueChange={setDisplayType}>
                            <SelectTrigger id="displayType">
                                <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bulletin">Bulletin complet</SelectItem>
                                <SelectItem value="course">Par matière</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {displayType === 'bulletin' ? (
                        <div>
                            <label htmlFor="semester" className="text-sm font-medium text-muted-foreground">Semestre</label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger id="semester">
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="annual">Bulletin annuel</SelectItem>
                                    <SelectItem value="s1">Semestre 1</SelectItem>
                                    <SelectItem value="s2">Semestre 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                           <label htmlFor="course" className="text-sm font-medium text-muted-foreground">Matière</label>
                           <Select value={course} onValueChange={setCourse}>
                                <SelectTrigger id="course">
                                    <SelectValue placeholder="Sélectionner une matière" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Semestre 1</SelectLabel>
                                        {allCoursesForFilter.filter(c => c.semester === 'Semestre 1').map(c => <SelectItem key={c.id} value={c.id}>{c.module}</SelectItem>)}
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Semestre 2</SelectLabel>
                                        {allCoursesForFilter.filter(c => c.semester === 'Semestre 2').map(c => <SelectItem key={c.id} value={c.id}>{c.module}</SelectItem>)}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      
        {renderContent()}
    </div>
  );
}

    