
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
};

const getGradeClass = (grade?: number | null) => {
    if (grade === null || grade === undefined) return '';
    if (grade >= 16) return 'text-green-600 dark:text-green-400';
    if (grade >= 14) return 'text-blue-600 dark:text-blue-400';
    if (grade >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

const calculateSubjectAverage = (grades: any) => {
    let total = 0;
    let totalCoeff = 0;
    for (const [type, grade] of Object.entries(grades)) {
        const coeff = coefficients[type as keyof typeof coefficients] || 1;
        if (typeof grade === 'number') {
            total += grade * coeff;
            totalCoeff += coeff;
        }
    }
    return totalCoeff > 0 ? (total / totalCoeff) : 0;
}


export default function ProfessorResultsPage() {
    const [activeTab, setActiveTab] = useState('saisie');
    const [selectedClass, setSelectedClass] = useState('l3-info');
    const [selectedSubject, setSelectedSubject] = useState('bdd');
    const [selectedEvalType, setSelectedEvalType] = useState('examen');
    
    const [students, setStudents] = useState(allStudentsData[selectedClass as keyof typeof allStudentsData]);

    useEffect(() => {
        setStudents(allStudentsData[selectedClass as keyof typeof allStudentsData] || []);
    }, [selectedClass]);

    const handleGradeChange = (studentId: number, newGrade: string) => {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                const updatedGrades = { ...student.grades };
                if (!updatedGrades[selectedSubject]) {
                    updatedGrades[selectedSubject] = {};
                }
                updatedGrades[selectedSubject][selectedEvalType] = newGrade === '' ? null : parseFloat(newGrade);
                return { ...student, grades: updatedGrades };
            }
            return student;
        }));
    };
    
    const handleAbsenceChange = (studentId: number, isAbsent: boolean) => {
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                const updatedAbsence = { ...student.absence };
                updatedAbsence[`${selectedSubject}_${selectedEvalType}`] = isAbsent;
                 if (isAbsent) {
                    const updatedGrades = { ...student.grades };
                    if(updatedGrades[selectedSubject]) {
                        updatedGrades[selectedSubject][selectedEvalType] = null;
                    }
                    return { ...student, grades: updatedGrades, absence: updatedAbsence };
                }
                return { ...student, absence: updatedAbsence };
            }
            return student;
        }));
    }

    const savedCount = useMemo(() => {
        return students.filter(s => {
            const grade = s.grades[selectedSubject]?.[selectedEvalType];
            return grade !== null && grade !== undefined;
        }).length;
    }, [students, selectedSubject, selectedEvalType]);

    const stats = useMemo(() => {
        const classStudents = allStudentsData[selectedClass as keyof typeof allStudentsData];
        const averages = classStudents
            .map(s => {
                const subjectGrades = s.grades[selectedSubject];
                return subjectGrades ? calculateSubjectAverage(subjectGrades) : null;
            })
            .filter((g): g is number => g !== null);
        
        if (averages.length === 0) return { avg: 0, min: 0, max: 0 };
        
        const avg = averages.reduce((a, b) => a + b, 0) / averages.length;
        const min = Math.min(...averages);
        const max = Math.max(...averages);
        
        return { avg, min, max };
    }, [selectedClass, selectedSubject]);


    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="saisie"><Edit className="mr-2 h-4 w-4" />Saisie des notes</TabsTrigger>
                  <TabsTrigger value="resultats"><ChartBar className="mr-2 h-4 w-4" />Résultats & Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="saisie" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saisie des notes</CardTitle>
                            <CardDescription>Saisissez et modifiez les notes de vos étudiants.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div><Label>Classe</Label><Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="l3-info">L3 Informatique</SelectItem><SelectItem value="l2-info">L2 Informatique</SelectItem></SelectContent></Select></div>
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
                             <CardTitle>Notes - {students.length > 0 ? students[0].class : ''}</CardTitle>
                             <CardDescription>Matière: {selectedSubject.toUpperCase()} | Évaluation: {selectedEvalType}</CardDescription>
                             <div className="text-sm text-muted-foreground pt-2">{savedCount} / {students.length} notes saisies</div>
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
                                    {students.map(student => {
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Étudiants</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Moyenne classe</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.avg))}>{stats.avg.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Note minimale</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.min))}>{stats.min.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Note maximale</CardTitle></CardHeader><CardContent><p className={cn("text-2xl font-bold", getGradeClass(stats.max))}>{stats.max.toFixed(2)}</p></CardContent></Card>
                    </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Classement des étudiants</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rang</TableHead><TableHead>Étudiant</TableHead>
                                            <TableHead>Moyenne ({selectedSubject.toUpperCase()})</TableHead><TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students
                                            .map(s => ({ ...s, avg: calculateSubjectAverage(s.grades[selectedSubject] || {}) }))
                                            .sort((a,b) => b.avg - a.avg)
                                            .map((student, index) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-bold">{index + 1}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell className={cn("font-semibold", getGradeClass(student.avg))}>{student.avg.toFixed(2)} / 20</TableCell>
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
