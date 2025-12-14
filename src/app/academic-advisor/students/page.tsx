
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  Mail,
  ChevronDown,
  ChevronsUpDown,
  Download,
  CalendarCheck,
  FileText,
  User as UserIcon,
  Pointer
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { studentsData, type Student } from '@/lib/students-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';
import StudentProfileModal from '@/components/students/student-profile-modal';

const ITEMS_PER_PAGE = 15;

const statusConfig: Record<Student['status'], { label: string; color: string }> = {
  excellent: {
    label: 'Excellent',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  },
  good: {
    label: 'Bon',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  },
  average: {
    label: 'Moyen',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  },
  difficulty: {
    label: 'En difficulté',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  },
  absent: {
    label: 'Absentéisme',
    color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  },
};

const getAverageColor = (average: number) => {
  if (average >= 16) return 'text-green-600 dark:text-green-400';
  if (average >= 14) return 'text-blue-600 dark:text-blue-400';
  if (average >= 10) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export default function AcademicAdvisorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);

  const isFiltered = searchTerm || classFilter;

  const filteredAndSortedStudents = useMemo(() => {
    if (!isFiltered) return [];

    let filtered = studentsData.filter(
      (student) =>
        (!classFilter || student.class === classFilter) &&
        (!statusFilter || student.status === statusFilter) &&
        (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'grade': return b.average - a.average;
        case 'attendance': return b.attendance - a.attendance;
        case 'class': return a.className.localeCompare(b.className);
        default: return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, classFilter, statusFilter, sortBy, isFiltered]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedStudents([]);
  }, [searchTerm, classFilter, statusFilter]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]
    );
  };
  
  const stats = useMemo(() => {
    const dataToUse = isFiltered ? filteredAndSortedStudents : studentsData;
    const validAverages = dataToUse.map(s => s.average).filter(avg => avg > 0);
    const average = validAverages.length > 0 ? (validAverages.reduce((a, b) => a + b, 0) / validAverages.length) : 0;
    return {
        total: dataToUse.length,
        average: average.toFixed(1),
        min: validAverages.length > 0 ? Math.min(...validAverages).toFixed(1) : 'N/A',
        max: validAverages.length > 0 ? Math.max(...validAverages).toFixed(1) : 'N/A',
    }
  }, [filteredAndSortedStudents, isFiltered]);


  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card><CardHeader><CardTitle className="text-sm font-medium">Total Étudiants</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.average}/20</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Note Minimale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{stats.min}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Note Maximale</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{stats.max}</p></CardContent></Card>
        </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Liste des étudiants</CardTitle>
              <CardDescription>Gérez et suivez la progression de tous les étudiants de l'université.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline"><Download className="mr-2"/>Exporter</Button>
              <Button disabled={selectedStudents.length === 0}><Mail className="mr-2"/>Message groupé</Button>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Rechercher par nom ou email..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
              </div>
              <Select value={classFilter} onValueChange={v => setClassFilter(v === 'all' ? '' : v)}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Toutes les classes"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les classes</SelectItem><SelectItem value="l1-info">L1 Info</SelectItem><SelectItem value="l2-info">L2 Info</SelectItem><SelectItem value="l3-info">L3 Info</SelectItem><SelectItem value="m1-info">M1 Info</SelectItem><SelectItem value="m2-info">M2 Info</SelectItem></SelectContent></Select>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v === 'all' ? '' : v)}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Tous les statuts"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select>
              <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full md:w-[180px]"><div className="flex items-center gap-2"><ChevronsUpDown className="h-4 w-4"/><span>Trier par</span></div></SelectTrigger><SelectContent><SelectItem value="name">Nom</SelectItem><SelectItem value="grade">Moyenne</SelectItem><SelectItem value="attendance">Présence</SelectItem><SelectItem value="class">Classe</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
        {isFiltered ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead padding="checkbox"><Checkbox checked={selectedStudents.length > 0 && selectedStudents.length === paginatedStudents.length} onCheckedChange={handleSelectAll} /></TableHead>
                    <TableHead>Étudiant</TableHead><TableHead>Classe</TableHead><TableHead>Moyenne</TableHead><TableHead>Présence</TableHead><TableHead>Statut</TableHead><TableHead>Dernière connexion</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map(student => {
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                        <TableRow key={student.id} data-state={isSelected ? 'selected' : undefined}>
                            <TableCell padding="checkbox"><Checkbox checked={isSelected} onCheckedChange={() => handleSelectStudent(student.id)}/></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar><AvatarImage src={student.photo} /><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                    <div><p className="font-medium">{student.name}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                                </div>
                            </TableCell>
                            <TableCell>{student.className}</TableCell>
                            <TableCell><p className={cn("font-semibold", getAverageColor(student.average))}>{student.average}/20</p></TableCell>
                            <TableCell>{student.attendance}%</TableCell>
                            <TableCell><Badge variant="outline" className={cn("border-0", statusConfig[student.status].color)}>{statusConfig[student.status].label}</Badge></TableCell>
                            <TableCell>{student.lastLogin}</TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><ChevronDown/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => setSelectedStudentForProfile(student)}><UserIcon className="mr-2"/>Voir le profil</DropdownMenuItem>
                                    <DropdownMenuItem><FileText className="mr-2"/>Voir le bulletin</DropdownMenuItem>
                                    <DropdownMenuItem><CalendarCheck className="mr-2"/>Historique des présences</DropdownMenuItem>
                                    <DropdownMenuItem><Mail className="mr-2"/>Envoyer un message</DropdownMenuItem>
                                </DropdownMenuContent>
                               </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
        ) : (
             <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed m-6">
                <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Consulter les dossiers étudiants</h3>
                <p className="text-muted-foreground mt-2">Veuillez utiliser la barre de recherche ou les filtres pour afficher la liste des étudiants.</p>
            </CardContent>
        )}
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
                Affichage de {paginatedStudents.length} sur {filteredAndSortedStudents.length} étudiants
            </p>
        </CardFooter>
      </Card>
      
      {selectedStudentForProfile && (
        <StudentProfileModal student={selectedStudentForProfile} onClose={() => setSelectedStudentForProfile(null)} />
      )}
    </div>
  );
}
