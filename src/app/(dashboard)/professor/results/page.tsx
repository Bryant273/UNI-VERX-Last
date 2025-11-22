
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Edit,
  ChartBar,
  Upload,
  DownloadCloud,
  Save,
  Eye,
  ChevronsUpDown,
  Download,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/messages-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const coefficients = {
    'examen': 3, 'td': 1, 'tp': 2, 'devoir': 2, 'projet': 3, 'oral': 2
};

const allStudentsData = {
    'l3-info': [
        { id: 1, name: "DUPONT Sarah", number: "22505876", class: "l3-info", grades: { bdd: { examen: 15, td: 17 }, python: { examen: 14 }, algo: { examen: 18 } }, absence: {} },
        { id: 2, name: "MARTIN Thomas", number: "22505877", class: "l3-info", grades: { bdd: { examen: 12 }, python: { examen: 15 }, algo: { examen: 13.5 } }, absence: {} },
        { id: 3, name: "BERNARD Emma", number: "22505878", class: "l3-info", grades: { bdd: { examen: 18.5 }, python: { examen: 17.5 }, algo: { examen: 19.5 } }, absence: {} },
    ],
    'l2-info': [
        { id: 4, name: "SIMON Julie", number: "22505903", class: "l2-info", grades: { bdd: { examen: 15.5 }, python: { examen: 17 }, algo: { examen: 16 } }, absence: {} },
        { id: 5, name: "DURAND Marc", number: "22505904", class: "l2-info", grades: { bdd: { examen: 13 }, python: { examen: 14.5 }, algo: { examen: 12.5 } }, absence: {} },
    ],
    'l1-info': [
        { id: 6, name: "PETIT Chloe", number: "22506001", class: "l1-info", grades: { algo: { examen: 11.5 }, python: { examen: 12 } }, absence: {} },
    ],
};

const getGradeClass = (grade?: number | null) => {
    if (grade === null || grade === undefined) return '';
    if (grade >= 16) return 'text-green-600 dark:text-green-400';
    if (grade >= 14) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

const calculateSubjectAverage = (grades: any) => {
    if (!grades) return null;
    let total = 0;
    let totalCoeff = 0;
    for (const [type, grade] of Object.entries(grades)) {
        const coeff = coefficients[type as keyof typeof coefficients] || 1;
        if (typeof grade === 'number') {
            total += grade * coeff;
            totalCoeff += coeff;
        }
    }
    return totalCoeff > 0 ? (total / totalCoeff) : null;
}

const calculateGeneralAverage = (studentGrades: any) => {
    let total = 0;
    let count = 0;
    if (!studentGrades) return null;

    Object.keys(studentGrades).forEach(subject => {
        const avg = calculateSubjectAverage(studentGrades[subject]);
        if (avg !== null) {
            total += avg;
            count++;
        }
    });

    return count > 0 ? total / count : null;
};


export default function ProfessorResultsPage() {
    const [activeTab, setActiveTab] = useState('saisie');
    
    // State for Saisie tab
    const [selectedClass, setSelectedClass] = useState('l3-info');
    const [selectedSubject, setSelectedSubject] = useState('bdd');
    const [selectedEvalType, setSelectedEvalType] = useState('examen');
    
    // State for Résultats tab
    const [resultClassFilter, setResultClassFilter] = useState('all');
    const [resultSubjectFilter, setResultSubjectFilter] = useState('all');
    const [resultSortFilter, setResultSortFilter] = useState('rank');

    const [studentsData, setStudentsData] = useState(allStudentsData);

    const studentsForSaisie = studentsData[selectedClass as keyof typeof studentsData] || [];

    const handleGradeChange = (studentId: number, newGrade: string) => {
        setStudentsData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const student = newData[selectedClass as keyof typeof newData]?.find((s: any) => s.id === studentId);
            if (student) {
                 if (!student.grades[selectedSubject]) {
                    student.grades[selectedSubject] = {};
                }
                student.grades[selectedSubject][selectedEvalType] = newGrade === '' ? null : parseFloat(newGrade);
            }
            return newData;
        });
    };
    
    const handleAbsenceChange = (studentId: number, isAbsent: boolean) => {
        setStudentsData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const student = newData[selectedClass as keyof typeof newData]?.find((s: any) => s.id === studentId);
            if (student) {
                if (!student.absence) student.absence = {};
                student.absence[`${selectedSubject}_${selectedEvalType}`] = isAbsent;
                 if (isAbsent) {
                    if(!student.grades[selectedSubject]) student.grades[selectedSubject] = {};
                    student.grades[selectedSubject][selectedEvalType] = null;
                }
            }
            return newData;
        });
    }

    const savedCount = useMemo(() => {
        return studentsForSaisie.filter(s => {
            const grade = s.grades[selectedSubject]?.[selectedEvalType];
            return grade !== null && grade !== undefined;
        }).length;
    }, [studentsForSaisie, selectedSubject, selectedEvalType]);
    
    const studentsForResults = useMemo(() => {
        let students = (resultClassFilter === 'all')
            ? Object.values(studentsData).flat()
            : studentsData[resultClassFilter as keyof typeof studentsData] || [];

        let studentsWithAverages = students.map(student => {
             const average = resultSubjectFilter === 'all'
                ? calculateGeneralAverage(student.grades)
                : calculateSubjectAverage(student.grades[resultSubjectFilter]);
            return {
                ...student,
                average: average || 0,
                formattedAverage: average ? average.toFixed(2) : 'N/A'
            };
        });

        switch (resultSortFilter) {
            case 'rank':
            case 'average_desc':
                studentsWithAverages.sort((a, b) => b.average - a.average);
                break;
            case 'average_asc':
                studentsWithAverages.sort((a, b) => a.average - b.average);
                break;
            case 'alphabetical':
                studentsWithAverages.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return studentsWithAverages;
    }, [studentsData, resultClassFilter, resultSubjectFilter, resultSortFilter]);


    const stats = useMemo(() => {
        const validAverages = studentsForResults
            .map(s => s.average)
            .filter((g): g is number => g > 0);
        
        if (validAverages.length === 0) return { count: studentsForResults.length, avg: 0, min: 0, max: 0 };
        
        const avg = validAverages.reduce((a, b) => a + b, 0) / validAverages.length;
        const min = Math.min(...validAverages);
        const max = Math.max(...validAverages);
        
        return { count: studentsForResults.length, avg, min, max };
    }, [studentsForResults]);


    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="saisie"><Edit className="mr-2 h-4 w-4" />Saisie des notes</TabsTrigger>
                  <TabsTrigger value="resultats"><ChartBar className="mr-2 h-4 w-4" />Résultats &amp; Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="saisie" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saisie des notes</CardTitle>
                            <CardDescription>Saisissez et modifiez les notes de vos étudiants.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div><Label>Classe</Label><Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="l1-info">L1 Informatique</SelectItem><SelectItem value="l2-info">L2 Informatique</SelectItem><SelectItem value="l3-info">L3 Informatique</SelectItem></SelectContent></Select></div>
                                <div><Label>Matière</Label><Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="bdd">Bases de Données</SelectItem><SelectItem value="python">Programmation Python</SelectItem><SelectItem value="algo">Algorithmique</SelectItem></SelectContent></Select></div>
                                <div><Label>Type d'évaluation</Label><Select value={selectedEvalType} onValueChange={setSelectedEvalType}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.keys(coefficients).map(k => <SelectItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</SelectItem>)}</SelectContent></Select></div>
                                <div><Label>Coefficient</Label><Input readOnly value={coefficients[selectedEvalType as keyof typeof coefficients]} /></div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                             <Button variant="outline"><ChevronsUpDown className="mr-2"/>Import/Export</Button>
                             <Button><Save className="mr-2"/>Sauvegarder tout</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                             <CardTitle>Notes - {studentsForSaisie.length > 0 ? selectedClass.toUpperCase().replace('-', ' ') : ''}</CardTitle>
                             <CardDescription>Matière: {selectedSubject.toUpperCase()} | Évaluation: {selectedEvalType}</CardDescription>
                             <div className="text-sm text-muted-foreground pt-2">{savedCount} / {studentsForSaisie.length} notes saisies</div>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Étudiant</TableHead><TableHead>N° Étudiant</TableHead>
                                        <TableHead>Note (/20)</TableHead><TableHead>Absence</TableHead>
                                        <TableHead>Commentaire</TableHead><TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentsForSaisie.map(student => {
                                        const grade = student.grades[selectedSubject]?.[selectedEvalType];
                                        const isAbsent = student.absence[`${selectedSubject}_${selectedEvalType}`] || false;
                                        return (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                         <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://i.pravatar.cc/40?u=${student.id}`} />
                                                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{student.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.number}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number" 
                                                        className={cn("w-24", getGradeClass(grade))}
                                                        value={grade ?? ''}
                                                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                        disabled={isAbsent}
                                                        placeholder="-"
                                                    />
                                                </TableCell>
                                                <TableCell><Checkbox checked={isAbsent} onCheckedChange={(checked) => handleAbsenceChange(student.id, !!checked)} /></TableCell>
                                                <TableCell><Input placeholder="Optionnel..."/></TableCell>
                                                <TableCell><Button variant="ghost" size="icon"><Eye/></Button></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
                
                <TabsContent value="resultats" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                             <CardTitle>Statistiques globales du professeur</CardTitle>
                             <CardDescription>Vue d'ensemble de la performance de vos étudiants.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><Label>Filtrer par Classe</Label><Select value={resultClassFilter} onValueChange={setResultClassFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les classes</SelectItem><SelectItem value="l1-info">L1 Informatique</SelectItem><SelectItem value="l2-info">L2 Informatique</SelectItem><SelectItem value="l3-info">L3 Informatique</SelectItem></SelectContent></Select></div>
                                <div><Label>Filtrer par Matière</Label><Select value={resultSubjectFilter} onValueChange={setResultSubjectFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Moyenne générale</SelectItem><SelectItem value="bdd">Bases de Données</SelectItem><SelectItem value="python">Programmation Python</SelectItem><SelectItem value="algo">Algorithmique</SelectItem></SelectContent></Select></div>
                                <div><Label>Trier par</Label><Select value={resultSortFilter} onValueChange={setResultSortFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="rank">Classement</SelectItem><SelectItem value="average_desc">Moyenne (décroissant)</SelectItem><SelectItem value="average_asc">Moyenne (croissant)</SelectItem><SelectItem value="alphabetical">Ordre alphabétique</SelectItem></SelectContent></Select></div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Étudiants</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.count}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Moyenne Globale</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.avg))}>{stats.avg.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Note minimale</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.min))}>{stats.min.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Note maximale</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.max))}>{stats.max.toFixed(2)}</p></CardContent></Card>
                    </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Classement des étudiants</CardTitle>
                            <CardDescription>
                                {resultClassFilter === 'all' ? 'Toutes classes confondues' : `Classe: ${resultClassFilter.toUpperCase().replace('-', ' ')}`}
                                {' | '}
                                {resultSubjectFilter === 'all' ? 'Moyenne générale' : `Matière: ${resultSubjectFilter.toUpperCase()}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rang</TableHead><TableHead>Étudiant</TableHead>
                                            <TableHead>Moyenne</TableHead><TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentsForResults.map((student, index) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-bold">{resultSortFilter.startsWith('average') || resultSortFilter === 'rank' ? index + 1 : '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarImage src={`https://i.pravatar.cc/40?u=${student.id}`} />
                                                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <span className="font-medium">{student.name}</span>
                                                            <p className="text-xs text-muted-foreground">{student.class.toUpperCase().replace('-', ' ')}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={cn("font-semibold", getGradeClass(student.average))}>{student.formattedAverage} / 20</TableCell>
                                                <TableCell><Button variant="outline" size="sm"><Eye className="mr-2"/>Voir détails</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
