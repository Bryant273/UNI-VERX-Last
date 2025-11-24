
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  FileText,
  BookOpen,
  Star,
  Edit,
  UserPlus
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/messages-data';
import { teachersData, getStatusConfig, getTypeConfig, getSpecialtyConfig, type Teacher } from '@/lib/teachers-data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 15;

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
}) => (
  <Card className="hover-lift">
    <CardContent className="p-5">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
                <div className="flex items-center mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                        {subtitle}
                    </span>
                </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace('text-','bg-').replace('-500','-50 dark:bg-900/20')}`}>
                <Icon className={`text-xl ${color}`} />
            </div>
        </div>
    </CardContent>
  </Card>
);

export default function AcademicAdvisorTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTeachers = useMemo(() => {
    let filtered = [...teachersData];

    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter);
    }
     if (typeFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.type === typeFilter);
    }
     if (specialtyFilter !== 'all') {
      filtered = filtered.filter((teacher) => teacher.specialty === specialtyFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, typeFilter, specialtyFilter]);
  
  const paginatedTeachers = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return filteredTeachers.slice(start, end);
  }, [filteredTeachers, currentPage]);
  
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const totalCourses = teachersData.reduce((sum, t) => sum + t.courses, 0);
    const totalPublications = teachersData.reduce((sum, t) => sum + t.publications, 0);
    const avgEvaluation = teachersData.reduce((sum, t) => sum + t.evaluation, 0) / teachersData.length;
    return {
        total: teachersData.length,
        courses: totalCourses,
        publications: totalPublications,
        evaluation: avgEvaluation.toFixed(1),
    };
  }, []);

  const handlePageChange = (page: number) => {
    if(page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total enseignants" value={stats.total} subtitle="+2 cette année" icon={Users} color="text-green-500" />
        <StatCard title="Cours dispensés" value={stats.courses} subtitle="Ce semestre" icon={BookOpen} color="text-blue-500" />
        <StatCard title="Publications totales" value={stats.publications} subtitle="+12 cette année" icon={FileText} color="text-purple-500" />
        <StatCard title="Évaluation moyenne" value={`${stats.evaluation}/5`} subtitle="Excellente" icon={Star} color="text-amber-500" />
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
            <CardTitle>Gestion des enseignants</CardTitle>
            <CardDescription>Consultez et gérez les profils des enseignants</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="searchInput" placeholder="Rechercher par nom, email, spécialité..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                 <div className="flex flex-wrap items-center gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-auto"><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="active">Actif</SelectItem><SelectItem value="sabbatical">En congé</SelectItem><SelectItem value="temporary">Temporaire</SelectItem></SelectContent>
                    </Select>
                     <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-auto"><SelectValue placeholder="Type de poste" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Tous les postes</SelectItem><SelectItem value="professor">Professeur</SelectItem><SelectItem value="associate">Maître de conf.</SelectItem><SelectItem value="lecturer">Chargé de cours</SelectItem></SelectContent>
                    </Select>
                     <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                        <SelectTrigger className="w-full sm:w-auto"><SelectValue placeholder="Spécialité" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">Toutes spécialités</SelectItem><SelectItem value="computer-science">Informatique</SelectItem><SelectItem value="mathematics">Mathématiques</SelectItem><SelectItem value="physics">Physique</SelectItem><SelectItem value="statistics">Statistiques</SelectItem></SelectContent>
                    </Select>
                    <Button variant="outline"> <Download className="mr-2 h-4 w-4" /> Exporter</Button>
                    <Button> <UserPlus className="mr-2 h-4 w-4" /> Ajouter</Button>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Teachers List Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 w-12"><Checkbox /></TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Poste & Spécialité</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Évaluation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedTeachers.map((teacher) => {
                    const statusConfig = getStatusConfig(teacher.status);
                    return (
                        <TableRow key={teacher.id} className="even:bg-muted/40 hover:bg-muted/50 cursor-pointer">
                            <TableCell className="px-6" onClick={(e) => e.stopPropagation()}><Checkbox /></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://i.pravatar.cc/100?img=${teacher.avatar}`} alt={teacher.name} />
                                        <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{teacher.name}</div>
                                        <div className="text-xs text-muted-foreground">{teacher.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{getTypeConfig(teacher.type)}</div>
                                <div className="text-sm text-muted-foreground">{getSpecialtyConfig(teacher.specialty)}</div>
                            </TableCell>
                             <TableCell>
                                <div className="text-sm">{teacher.courses} cours</div>
                                <div className="text-sm text-muted-foreground">{teacher.students} étudiants</div>
                                <div className="text-xs text-muted-foreground">{teacher.publications} publications</div>
                            </TableCell>
                             <TableCell>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400"/>
                                    <span className="font-semibold">{teacher.evaluation}/5</span>
                                </div>
                             </TableCell>
                            <TableCell><Badge variant="outline" className={cn("border-0 font-medium", statusConfig.color)}>{statusConfig.label}</Badge></TableCell>
                            <TableCell className="text-right">
                               <TooltipProvider>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><UserIcon/></Button></TooltipTrigger><TooltipContent><p>Voir profil</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Edit/></Button></TooltipTrigger><TooltipContent><p>Modifier</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Mail/></Button></TooltipTrigger><TooltipContent><p>Envoyer un message</p></TooltipContent></Tooltip>
                               </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
                Affichage de {paginatedTeachers.length} sur {filteredTeachers.length} enseignants
            </p>
             {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}

