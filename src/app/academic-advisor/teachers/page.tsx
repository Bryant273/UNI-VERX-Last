
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
  BookOpen,
  MessageSquare,
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
import { teachersData, getStatusConfig, getSpecialtyConfig, getTypeConfig, type Teacher } from '@/lib/teachers-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 15;

export default function AcademicAdvisorTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  const isFiltered = searchTerm || specialtyFilter || statusFilter;

  const filteredAndSortedTeachers = useMemo(() => {
    if (!isFiltered) return [];

    let filtered = teachersData.filter(
      (teacher) =>
        (!specialtyFilter || teacher.specialty === specialtyFilter) &&
        (!statusFilter || teacher.status === statusFilter) &&
        (teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'evaluation': return b.evaluation - a.evaluation;
        case 'courses': return b.courses - a.courses;
        case 'specialty': return a.specialty.localeCompare(b.specialty);
        default: return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, specialtyFilter, statusFilter, sortBy, isFiltered]);

  const totalPages = Math.ceil(filteredAndSortedTeachers.length / ITEMS_PER_PAGE);
  const paginatedTeachers = filteredAndSortedTeachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedTeachers([]);
  }, [searchTerm, specialtyFilter, statusFilter]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedTeachers(paginatedTeachers.map(t => t.id));
    } else {
      setSelectedTeachers([]);
    }
  };

  const handleSelectTeacher = (id: number) => {
    setSelectedTeachers(prev => 
      prev.includes(id) ? prev.filter(teacherId => teacherId !== id) : [...prev, id]
    );
  };
  
  const stats = useMemo(() => {
    const dataToUse = isFiltered ? filteredAndSortedTeachers : teachersData;
    const total = dataToUse.length;
    const active = dataToUse.filter(t => t.status === 'active').length;
    const avgEvaluation = (dataToUse.reduce((acc, t) => acc + t.evaluation, 0) / total).toFixed(2);
    const totalPublications = dataToUse.reduce((acc, t) => acc + t.publications, 0);
    return { total, active, avgEvaluation, totalPublications };
  }, [filteredAndSortedTeachers, isFiltered]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card><CardHeader><CardTitle className="text-sm font-medium">Total Enseignants</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Enseignants Actifs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.active}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Évaluation Moyenne</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{stats.avgEvaluation}/5</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm font-medium">Total Publications</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-purple-600">{stats.totalPublications}</p></CardContent></Card>
        </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Liste des enseignants</CardTitle>
              <CardDescription>Gérez et suivez le corps professoral de l'université.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline"><Download className="mr-2"/>Exporter</Button>
              <Button disabled={selectedTeachers.length === 0}><Mail className="mr-2"/>Message groupé</Button>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Rechercher par nom ou email..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Spécialité" /></SelectTrigger><SelectContent><SelectItem value="">Toutes les spécialités</SelectItem><SelectItem value="computer-science">Informatique</SelectItem><SelectItem value="mathematics">Mathématiques</SelectItem><SelectItem value="physics">Physique</SelectItem><SelectItem value="statistics">Statistiques</SelectItem></SelectContent></Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Statut"/></SelectTrigger><SelectContent><SelectItem value="">Tous les statuts</SelectItem><SelectItem value="active">Actif</SelectItem><SelectItem value="sabbatical">En congé</SelectItem><SelectItem value="temporary">Temporaire</SelectItem></SelectContent></Select>
              <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full md:w-[180px]"><div className="flex items-center gap-2"><ChevronsUpDown className="h-4 w-4"/><span>Trier par</span></div></SelectTrigger><SelectContent><SelectItem value="name">Nom</SelectItem><SelectItem value="evaluation">Évaluation</SelectItem><SelectItem value="courses">Nb. cours</SelectItem><SelectItem value="specialty">Spécialité</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
        {isFiltered ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead padding="checkbox"><Checkbox checked={selectedTeachers.length > 0 && selectedTeachers.length === paginatedTeachers.length} onCheckedChange={handleSelectAll} /></TableHead>
                    <TableHead>Enseignant</TableHead><TableHead>Spécialité</TableHead><TableHead>Cours</TableHead><TableHead>Publications</TableHead><TableHead>Évaluation</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeachers.map(teacher => {
                    const isSelected = selectedTeachers.includes(teacher.id);
                    const statusConfig = getStatusConfig(teacher.status);
                    return (
                        <TableRow key={teacher.id} data-state={isSelected ? 'selected' : undefined}>
                            <TableCell padding="checkbox"><Checkbox checked={isSelected} onCheckedChange={() => handleSelectTeacher(teacher.id)}/></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar><AvatarImage src={`https://i.pravatar.cc/100?img=${teacher.avatar}`} /><AvatarFallback>{getInitials(teacher.name)}</AvatarFallback></Avatar>
                                    <div><p className="font-medium">{teacher.name}</p><p className="text-xs text-muted-foreground">{teacher.email}</p></div>
                                </div>
                            </TableCell>
                            <TableCell>{getSpecialtyConfig(teacher.specialty)}</TableCell>
                            <TableCell>{teacher.courses}</TableCell>
                            <TableCell>{teacher.publications}</TableCell>
                            <TableCell><p className="font-semibold">{teacher.evaluation}/5</p></TableCell>
                            <TableCell><Badge variant="outline" className={cn("border-0", statusConfig.color)}>{statusConfig.label}</Badge></TableCell>
                            <TableCell className="text-right">
                               <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><ChevronDown/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><UserIcon className="mr-2"/>Voir le profil</DropdownMenuItem>
                                    <DropdownMenuItem><BookOpen className="mr-2"/>Voir les cours</DropdownMenuItem>
                                    <DropdownMenuItem><FileText className="mr-2"/>Consulter le dossier</DropdownMenuItem>
                                    <DropdownMenuItem><MessageSquare className="mr-2"/>Envoyer un message</DropdownMenuItem>
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
                <h3 className="text-xl font-semibold">Consulter les dossiers enseignants</h3>
                <p className="text-muted-foreground mt-2">Veuillez utiliser la barre de recherche ou les filtres pour afficher la liste des enseignants.</p>
            </CardContent>
        )}
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
                Affichage de {paginatedTeachers.length} sur {filteredAndSortedTeachers.length} enseignants
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
