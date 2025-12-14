
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Search, FolderOpen, ChevronLeft, ChevronRight, Filter, FileCheck2, FileX2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import { studentsData, type Student } from '@/lib/students-data';
import StudentFileModal from '@/components/secretariat/student-file-modal';

const ITEMS_PER_PAGE = 10;

const getFolderStatus = (student: Student) => {
    // Simple deterministic logic to avoid hydration mismatch.
    if (student.id % 5 === 0) return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: FileX2 };
    if (student.id % 3 === 0) return { label: 'Incomplet', color: 'bg-red-100 text-red-800', icon: FileX2 };
    return { label: 'Complet', color: 'bg-green-100 text-green-800', icon: FileCheck2 };
}

export default function SecretariatStudentFilesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const filteredStudents = useMemo(() => {
        return studentsData.filter(student => {
            const folderStatus = getFolderStatus(student).label;
            return (
                (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.includes(searchTerm)) &&
                (classFilter === 'all' || student.class === classFilter) &&
                (statusFilter === 'all' || folderStatus === statusFilter) &&
                student.status !== 'archived'
            );
        });
    }, [searchTerm, classFilter, statusFilter]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = useMemo(() => {
        return filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dossiers Étudiants</CardTitle>
                    <CardDescription>Gérez les documents et les dossiers de tous les étudiants de l'université.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Rechercher par nom ou matricule..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        </div>
                        <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Toutes les classes"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les classes</SelectItem><SelectItem value="l1-info">L1 Info</SelectItem><SelectItem value="l2-info">L2 Info</SelectItem><SelectItem value="l3-info">L3 Info</SelectItem></SelectContent></Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Statut dossier"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="Complet">Complet</SelectItem><SelectItem value="Incomplet">Incomplet</SelectItem><SelectItem value="En attente">En attente</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Étudiant</TableHead><TableHead>Classe</TableHead><TableHead>Statut du Dossier</TableHead><TableHead>Dernière Mise à Jour</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map(student => {
                                const folderStatus = getFolderStatus(student);
                                return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10"><AvatarImage src={student.photo}/><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                            <div><p className="font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.studentId}</p></div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.className}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={folderStatus.color}>
                                            <folderStatus.icon className="h-3 w-3 mr-1.5"/>
                                            {folderStatus.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{student.lastLogin}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                                            <FolderOpen className="mr-2 h-4 w-4"/> Gérer le dossier
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedStudents.length} sur {filteredStudents.length} étudiants</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <StudentFileModal isOpen={!!selectedStudent} student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
}
