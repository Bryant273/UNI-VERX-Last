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
import { teachersData, type Teacher } from '@/lib/teachers-data';
import TeacherFileModal from '@/components/secretariat/teacher-file-modal';

const ITEMS_PER_PAGE = 10;

const getFolderStatus = (teacher: Teacher) => {
    // Simple deterministic logic to avoid hydration mismatch.
    if (teacher.id % 5 === 0) return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: FileX2 };
    if (teacher.id % 3 === 0) return { label: 'Incomplet', color: 'bg-red-100 text-red-800', icon: FileX2 };
    return { label: 'Complet', color: 'bg-green-100 text-green-800', icon: FileCheck2 };
}

export default function AdminTeacherFilesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const filteredTeachers = useMemo(() => {
        return teachersData.filter(teacher => {
            const folderStatus = getFolderStatus(teacher).label;
            return (
                (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || teacher.email.toLowerCase().includes(searchTerm)) &&
                (specialtyFilter === 'all' || teacher.specialty === specialtyFilter) &&
                (statusFilter === 'all' || folderStatus === statusFilter) &&
                teacher.status !== 'sabbatical' // Assuming sabbatical is like archived
            );
        });
    }, [searchTerm, specialtyFilter, statusFilter]);

    const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
    const paginatedTeachers = useMemo(() => {
        return filteredTeachers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredTeachers, currentPage]);
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dossiers Professeurs</CardTitle>
                    <CardDescription>Gérez les documents et les dossiers de tous les enseignants de l'université.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Rechercher par nom ou email..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        </div>
                        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Toutes les spécialités"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les spécialités</SelectItem><SelectItem value="computer-science">Informatique</SelectItem><SelectItem value="mathematics">Mathématiques</SelectItem><SelectItem value="physics">Physique</SelectItem><SelectItem value="statistics">Statistiques</SelectItem></SelectContent></Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Statut dossier"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="Complet">Complet</SelectItem><SelectItem value="Incomplet">Incomplet</SelectItem><SelectItem value="En attente">En attente</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Enseignant</TableHead><TableHead>Spécialité</TableHead><TableHead>Statut du Dossier</TableHead><TableHead>Dernière Activité</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTeachers.map(teacher => {
                                const folderStatus = getFolderStatus(teacher);
                                return (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10"><AvatarImage src={teacher.avatar}/><AvatarFallback>{getInitials(teacher.name)}</AvatarFallback></Avatar>
                                            <div><p className="font-medium">{teacher.name}</p><p className="text-xs text-muted-foreground">{teacher.email}</p></div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{teacher.specialty}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={folderStatus.color}>
                                            <folderStatus.icon className="h-3 w-3 mr-1.5"/>
                                            {folderStatus.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{teacher.lastActivity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedTeacher(teacher)}>
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
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedTeachers.length} sur {filteredTeachers.length} enseignants</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <TeacherFileModal isOpen={!!selectedTeacher} teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
        </div>
    );
}