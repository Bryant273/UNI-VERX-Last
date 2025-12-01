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
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { coursesResultsData, semesterResults, type CourseResult } from '@/lib/results-data';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { studentData } from '@/lib/static-data';

type DisplayType = 'bulletin' | 'course';
type SemesterType = 'all' | 'S1' | 'S2';


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

const SemesterTable = ({ semester, data }: { semester: string, data: any }) => {
    const ueEntries = Object.entries(data.groupedCourses);
    let totalRows = 0;
    ueEntries.forEach(([_, courses]) => totalRows += (courses as CourseResult[]).length);


    return (
        ueEntries.map(([ue, courses], ueIndex) => {
            const ueCourses = courses as CourseResult[];
            const ueRowSpan = ueCourses.length;
            return ueCourses.map((course, courseIndex) => {
                const isFailed = parseFloat(course.grade.replace(',', '.')) < 10;
                return (
                    <TableRow key={course.id}>
                        {ueIndex === 0 && courseIndex === 0 && (
                            <TableCell rowSpan={totalRows} className="align-middle text-center font-semibold text-muted-foreground" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                                {semester}
                            </TableCell>
                        )}
                        {courseIndex === 0 && (
                            <TableCell rowSpan={ueRowSpan} className="font-semibold align-middle">{ue}</TableCell>
                        )}
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell><Badge variant={isFailed ? "destructive" : "secondary"}>{course.grade}/20</Badge></TableCell>
                        <TableCell className="text-center">{course.creditsToValidate}</TableCell>
                        <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                                {isFailed ? <XCircle className="h-4 w-4 text-red-500"/> : <CheckCircle className="h-4 w-4 text-green-500"/>}
                                <span className={cn(isFailed ? 'text-red-500' : 'text-green-500', "font-semibold")}>
                                    {course.creditsValidated}
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            });
        })
    );
};

const BulletinView = ({ semester }: { semester: SemesterType }) => {
    const isAnnual = semester === 'all';
    
    return (
        <div id="bulletin-content">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-center mb-6">BULLETIN DE NOTES - ANNÉE 2024-2025</h3>
                
                <Table className="border mb-8">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Semestre</TableHead>
                            <TableHead className="w-[200px]">UE</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead className="w-[100px]">Moyenne</TableHead>
                            <TableHead className="w-[150px]">Crédits à valider</TableHead>
                            <TableHead className="w-[150px]">Crédits validés</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(semester === 'all' || semester === 'S1') && (
                            <SemesterTable semester="SEMESTRE 1" data={semesterResults.s1} />
                        )}
                        {(semester === 'all' || semester === 'S2') && (
                            <SemesterTable semester="SEMESTRE 2" data={semesterResults.s2} />
                        )}
                    </TableBody>
                </Table>
                
                {isAnnual && (
                    <>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl p-6 flex flex-col items-center justify-center">
                                <div className="text-center mb-3">
                                    <div className="font-medium text-muted-foreground mb-1">Moyenne annuelle</div>
                                    <div className="text-3xl font-bold text-primary">{semesterResults.annual.average}/20</div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-3 text-center">
                                    <span className="font-medium text-primary">Mention :</span> {semesterResults.annual.mention}
                                </div>
                            </div>
                            
                            <div className="bg-card shadow-sm rounded-xl p-6 flex flex-col items-center justify-center border">
                                <div className="text-center">
                                    <div className="font-medium text-muted-foreground mb-1">Crédits validés</div>
                                    <div className="text-lg font-bold">{semesterResults.annual.credits}</div>
                                    <div className="text-sm text-amber-600 mt-1">{semesterResults.annual.creditsStatus}</div>
                                </div>
                            </div>
                            
                            <div className="bg-card shadow-sm rounded-xl p-6 flex flex-col items-center justify-center border">
                                <div className="text-center">
                                    <div className="font-medium text-muted-foreground mb-1">Classement</div>
                                    <div className="text-lg font-bold">{semesterResults.annual.rank} / {semesterResults.annual.totalStudents}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Top 10%</div>
                                </div>
                            </div>
                            
                            <div className="bg-card shadow-sm rounded-xl p-6 flex flex-col items-center justify-center border">
                                <div className="text-center">
                                    <div className="font-medium text-muted-foreground mb-1">Décision</div>
                                    <div className="text-lg font-bold text-green-600">{semesterResults.annual.status}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{semesterResults.annual.statusDetails}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                            <h4 className="text-base font-medium text-foreground mb-2">Commentaires du jury</h4>
                            <p className="text-sm text-muted-foreground italic">
                                {semesterResults.annual.juryComment}
                            </p>
                        </div>
                         <div className="flex justify-between items-end mt-16">
                            <div>
                                <p className="text-sm text-muted-foreground">Fait le, {new Date().toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold">Le Directeur des Études</p>
                                <div className="mt-8 border-t-2 w-48 mx-auto"></div>
                                <p className="text-xs text-muted-foreground mt-2">(Cachet et Signature)</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default function ResultsPage() {
  const [displayType, setDisplayType] = useState<DisplayType>('bulletin');
  const [semester, setSemester] = useState<SemesterType>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleDownload = () => {
    const content = document.getElementById('bulletin-content');
    if (content) {
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;
        
        let finalWidth, finalHeight;
        
        if (canvasAspectRatio > pdfAspectRatio) {
            finalWidth = pdfWidth;
            finalHeight = pdfWidth / canvasAspectRatio;
        } else {
            finalHeight = pdfHeight;
            finalWidth = pdfHeight * canvasAspectRatio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('mes_resultats.pdf');
      });
    }
  };
  
  const { name, id, ufr, level, speciality } = studentData;
  const [firstName, lastName] = name.split(' ');

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
                                 <SelectItem key={course.id} value={course.id}>{course.name} ({course.semester.replace('Semestre ', 'S')})</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Informations de l'étudiant</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="font-medium text-muted-foreground">Nom</p><p>{lastName}</p></div>
            <div><p className="font-medium text-muted-foreground">Prénom</p><p>{firstName}</p></div>
            <div><p className="font-medium text-muted-foreground">Matricule</p><p>{id}</p></div>
            <div><p className="font-medium text-muted-foreground">UFR</p><p>{ufr}</p></div>
            <div><p className="font-medium text-muted-foreground">Niveau</p><p>{level}</p></div>
            <div><p className="font-medium text-muted-foreground">Spécialité</p><p>{speciality}</p></div>
        </CardContent>
      </Card>

      <div id="resultsContainer">
        {displayType === 'bulletin' && <BulletinView semester={semester} />}
        {displayType === 'course' && selectedCourse && <CourseDetailsView course={coursesResultsData[selectedCourse]} />}
        {displayType === 'course' && !selectedCourse && (
             <Card className="text-center text-muted-foreground p-8">
                <CardContent>Veuillez sélectionner une matière pour voir les détails.</CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
