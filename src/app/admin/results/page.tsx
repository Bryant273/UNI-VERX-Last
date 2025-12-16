'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { allStudentsData as profAllStudentsData, getGradeClass, calculateSubjectAverage, calculateGeneralAverage } from '@/lib/results-data-prof';
import { Edit, Save, Eye, FileUp, FileDown, Lock, Unlock, TrendingUp, User, GraduationCap, X, BarChart2, Pointer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const SaisieNotesTab = () => {
    const [gradeClass, setGradeClass] = useState('');
    const [gradeSubject, setGradeSubject] = useState('');
    const [evaluationType, setEvaluationType] = useState('');
    const [currentStudents, setCurrentStudents] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const { toast } = useToast();

    const evaluationCoeff = useMemo(() => {
        if (!evaluationType) return 'N/A';
        const coefficients: Record<string, number> = { examen: 3, td: 1, tp: 2, qcm_moyenne: 2, devoir: 2, projet: 3, oral: 2 };
        return coefficients[evaluationType] || 1;
    }, [evaluationType]);

    useEffect(() => {
        if (gradeClass) {
            setCurrentStudents(profAllStudentsData[gradeClass] || []);
        } else {
            setCurrentStudents([]);
        }
    }, [gradeClass]);

    const handleGradeChange = (studentId: any, newGrade: any) => {
        setCurrentStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const updatedGrades = { ...s.grades };
                if (!updatedGrades[gradeSubject]) updatedGrades[gradeSubject] = {};
                updatedGrades[gradeSubject][evaluationType] = newGrade;
                return { ...s, grades: updatedGrades };
            }
            return s;
        }));
    };

    const handleSaveAll = () => {
        if(!gradeClass || !gradeSubject || !evaluationType) return;
        setCurrentStudents(prev => prev.map(s => {
            const grade = s.grades[gradeSubject]?.[evaluationType];
            if (grade !== null && grade !== undefined && grade !== '') {
                if (!s.locked) s.locked = {};
                s.locked[`${gradeSubject}_${evaluationType}`] = true;
            }
            return s;
        }));
        setEditMode(false);
        toast({ title: "Notes sauvegardées", description: "Toutes les notes saisies ont été sauvegardées et verrouillées." });
    };

    const savedCount = useMemo(() => {
        if(!gradeClass || !gradeSubject || !evaluationType) return 0;
        return currentStudents.filter(s => {
            const grade = s.grades[gradeSubject]?.[evaluationType];
            return grade !== null && grade !== undefined && grade !== '';
        }).length;
    }, [currentStudents, gradeSubject, evaluationType]);

    const canDisplayTable = gradeClass && gradeSubject && evaluationType;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle>Saisie des notes</CardTitle>
                            <CardDescription>Saisissez et modifiez les notes de vos étudiants.</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline"><FileUp className="mr-2 h-4 w-4" /> Import/Export</Button>
                            <Button onClick={handleSaveAll} disabled={!canDisplayTable}><Save className="mr-2 h-4 w-4" /> Sauvegarder et Verrouiller</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={gradeClass} onValueChange={setGradeClass}>
                        <SelectTrigger><SelectValue placeholder="Sélectionnez une classe..."/></SelectTrigger>
                        <SelectContent>{Object.keys(profAllStudentsData).map(c => <SelectItem key={c} value={c}>{c.replace('-',' ').toUpperCase()}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={gradeSubject} onValueChange={setGradeSubject}>
                        <SelectTrigger><SelectValue placeholder="Sélectionnez une matière..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bdd">Bases de Données</SelectItem>
                            <SelectItem value="python">Programmation Python</SelectItem>
                            <SelectItem value="algo">Algorithmique</SelectItem>
                            <SelectItem value="web">Développement Web</SelectItem>
                            <SelectItem value="projet">Projet Informatique</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={evaluationType} onValueChange={setEvaluationType}>
                        <SelectTrigger><SelectValue placeholder="Type d'évaluation..."/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="examen">Examen</SelectItem>
                            <SelectItem value="td">TD noté</SelectItem>
                            <SelectItem value="tp">TP noté</SelectItem>
                            <SelectItem value="qcm_moyenne">Moyenne QCM</SelectItem>
                        </SelectContent>
                    </Select>
                    <div><Input type="text" value={`Coefficient: ${evaluationCoeff}`} readOnly className="bg-muted/50 font-medium" /></div>
                </CardContent>
            </Card>
            
            {canDisplayTable ? (
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Notes - {gradeClass.toUpperCase()} - {gradeSubject.toUpperCase()} - {evaluationType.replace('_', ' ').toUpperCase()}</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">{savedCount} / {currentStudents.length} notes saisies</span>
                                <Button variant="secondary" size="sm" onClick={() => setEditMode(e => !e)}>{editMode ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}{editMode ? 'Quitter' : 'Modifier'}</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>Étudiant</TableHead><TableHead>N° Étudiant</TableHead><TableHead>Note (/20)</TableHead><TableHead>Absence</TableHead><TableHead>Commentaire</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {currentStudents.map(student => {
                                    const isLocked = student.locked?.[`${gradeSubject}_${evaluationType}`] && !editMode;
                                    const grade = student.grades[gradeSubject]?.[evaluationType] ?? '';
                                    return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{student.number}</TableCell>
                                        <TableCell>
                                            {evaluationType === 'qcm_moyenne' ? (
                                                <Input type="number" value={grade} readOnly className={cn("w-24 text-center bg-muted/50", grade && getGradeClass(grade))} />
                                            ) : (
                                                <Input type="number" min="0" max="20" step="0.5" defaultValue={grade} onChange={(e) => handleGradeChange(student.id, e.target.value)} disabled={isLocked} className={cn("w-24 text-center", grade && getGradeClass(grade))} />
                                            )}
                                        </TableCell>
                                        <TableCell><Checkbox disabled={isLocked} /></TableCell>
                                        <TableCell><Input placeholder="Commentaire..." disabled={isLocked} /></TableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ) : (
                 <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed">
                    <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Prêt à commencer la saisie ?</h3>
                    <p className="text-muted-foreground mt-2">Veuillez sélectionner une classe, une matière et un type d'évaluation pour commencer.</p>
                </Card>
            )}
        </div>
    );
};

const ResultatsTab = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');

     useEffect(() => {
        if (selectedClass) {
            setStudents(profAllStudentsData[selectedClass] || []);
        } else {
            setStudents([]);
        }
    }, [selectedClass]);

    const stats = useMemo(() => {
        const studentsWithAverages = students.map(s => ({
            ...s,
            average: selectedSubject === 'all' 
                ? calculateGeneralAverage(s.grades) 
                : calculateSubjectAverage(s.grades, selectedSubject)
        })).filter(s => s.average !== null);
        
        if (studentsWithAverages.length === 0) return { avg: 'N/A', min: 'N/A', max: 'N/A' };

        const avg = (studentsWithAverages.reduce((acc, s) => acc + s.average!, 0) / studentsWithAverages.length).toFixed(2);
        const min = Math.min(...studentsWithAverages.map(s => s.average!)).toFixed(2);
        const max = Math.max(...studentsWithAverages.map(s => s.average!)).toFixed(2);
        return { avg, min, max };
    }, [students, selectedSubject]);

    const rankedStudents = useMemo(() => {
        return students.map(s => ({
            ...s,
            average: selectedSubject === 'all' 
                ? calculateGeneralAverage(s.grades) 
                : calculateSubjectAverage(s.grades, selectedSubject)
        })).sort((a,b) => (b.average ?? 0) - (a.average ?? 0));
    }, [students, selectedSubject]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader><CardTitle className="text-sm font-medium">Étudiants</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Moyenne Classe</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.avg}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Note Minimale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{stats.min}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Note Maximale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{stats.max}</p></CardContent></Card>
            </div>
            <Card>
                 <CardHeader>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Classement des étudiants</CardTitle>
                            <CardDescription>Consultez les moyennes et le classement des étudiants.</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sélectionnez une classe..."/></SelectTrigger>
                                <SelectContent>{Object.keys(profAllStudentsData).map(c => <SelectItem key={c} value={c}>{c.replace('-',' ').toUpperCase()}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Toutes les matières"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les matières</SelectItem>
                                    <SelectItem value="bdd">Bases de Données</SelectItem>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="algo">Algorithmique</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                     </div>
                 </CardHeader>
                {selectedClass ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>Rang</TableHead><TableHead>Étudiant</TableHead><TableHead>Moyenne</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {rankedStudents.map((student, index) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-bold w-16 text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className={cn("font-bold", student.average !== null ? getGradeClass(student.average) : '')}>{student.average?.toFixed(2) ?? 'N/A'}</TableCell>
                                        <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed m-6">
                        <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Consulter les résultats</h3>
                        <p className="text-muted-foreground mt-2">Veuillez sélectionner une classe pour afficher le classement et les statistiques.</p>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}

export default function AdminResultsPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notes & Résultats</CardTitle>
                    <CardDescription>Saisissez les notes, consultez les résultats des étudiants et gérez les bulletins.</CardDescription>
                </CardHeader>
            </Card>
            <Tabs defaultValue="saisie">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="saisie"><Edit className="mr-2" /> Saisie des notes</TabsTrigger>
                    <TabsTrigger value="resultats"><BarChart2 className="mr-2" /> Résultats & Classement</TabsTrigger>
                </TabsList>
                <TabsContent value="saisie" className="mt-4"><SaisieNotesTab /></TabsContent>
                <TabsContent value="resultats" className="mt-4"><ResultatsTab /></TabsContent>
            </Tabs>
        </div>
    )
}
