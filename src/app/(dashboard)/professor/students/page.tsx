
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  BarChart2,
  CalendarCheck,
  AlertTriangle,
  Search,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  FileText,
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
import { studentsData, type Student } from '@/lib/students-data';
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
  <Card className={`text-white ${color}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-80 mt-1">{subtitle}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
          <Icon className="text-xl" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const getStatusBadge = (status: Student['status']) => {
  const statusConfig = {
    excellent:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    good: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    average:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    difficulty:
      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    absent:
      'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400',
  };
  const label = {
    excellent: 'Excellent',
    good: 'Bon',
    average: 'Moyen',
    difficulty: 'En difficulté',
    absent: 'Souvent absent',
  };
  return (
    <Badge
      variant="outline"
      className={`border-0 font-medium ${
        statusConfig[status] || statusConfig.average
      }`}
    >
      {label[status]}
    </Badge>
  );
};

export default function ProfessorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStudents = useMemo(() => {
    let filtered = [...studentsData];

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (classFilter !== 'all') {
      filtered = filtered.filter((student) => student.class === classFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'grade':
          return b.average - a.average;
        case 'attendance':
          return b.attendance - a.attendance;
        case 'class':
          return a.className.localeCompare(b.className);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, classFilter, statusFilter, sortBy]);
  
  const paginatedStudents = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return filteredStudents.slice(start, end);
  }, [filteredStudents, currentPage]);
  
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const studentsToAnalyze = classFilter === 'all' ? studentsData : studentsData.filter(s => s.class === classFilter);
    const avg = studentsToAnalyze.reduce((acc, s) => acc + s.average, 0) / (studentsToAnalyze.length || 1);
    const attendance = studentsToAnalyze.reduce((acc, s) => acc + s.attendance, 0) / (studentsToAnalyze.length || 1);
    const inDifficulty = studentsToAnalyze.filter(s => s.status === 'difficulty' || s.status === 'absent').length;
    return {
        total: studentsData.length,
        average: avg.toFixed(1),
        attendance: attendance.toFixed(1),
        inDifficulty: inDifficulty,
    };
  }, [classFilter]);

  const handlePageChange = (page: number) => {
    if(page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Étudiants"
          value={stats.total}
          subtitle="+12 ce semestre"
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Moyenne Générale"
          value={`${stats.average}/20`}
          subtitle="+0.3 vs S1"
          icon={BarChart2}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Taux de Présence"
          value={`${stats.attendance}%`}
          subtitle="Très bon"
          icon={CalendarCheck}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="En Difficulté"
          value={stats.inDifficulty}
          subtitle="Nécessite attention"
          icon={AlertTriangle}
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des étudiants</CardTitle>
          <CardDescription>
            Gérez et suivez la progression de vos étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                className="pl-10 lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  <SelectItem value="l1-info">L1 Informatique</SelectItem>
                  <SelectItem value="l2-info">L2 Informatique</SelectItem>
                  <SelectItem value="l3-info">L3 Informatique</SelectItem>
                  <SelectItem value="m1-info">M1 Informatique</SelectItem>
                  <SelectItem value="m2-info">M2 Informatique</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Trier par nom</SelectItem>
                  <SelectItem value="grade">Trier par moyenne</SelectItem>
                  <SelectItem value="attendance">Trier par présence</SelectItem>
                  <SelectItem value="class">Trier par classe</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2" /> Exporter
              </Button>
              <Button>
                <Mail className="mr-2" /> Message groupé
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Étudiant</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>Présence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell className="px-6"><Checkbox /></TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={student.photo} alt={student.name} />
                                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{student.name}</div>
                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell className={cn("font-semibold", student.average >= 16 ? 'text-green-600' : student.average >= 12 ? 'text-blue-600' : 'text-red-600')}>
                            {student.average.toFixed(1)}/20
                        </TableCell>
                        <TableCell className={cn("font-semibold", student.attendance >= 90 ? 'text-green-600' : student.attendance >= 80 ? 'text-blue-600' : 'text-red-600')}>
                            {student.attendance}%
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell className="text-right">
                           <TooltipProvider>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><UserIcon/></Button></TooltipTrigger><TooltipContent><p>Voir profil</p></TooltipContent></Tooltip>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><FileText/></Button></TooltipTrigger><TooltipContent><p>Voir bulletin</p></TooltipContent></Tooltip>
                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Mail/></Button></TooltipTrigger><TooltipContent><p>Envoyer un message</p></TooltipContent></Tooltip>
                           </TooltipProvider>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
                Affichage de {paginatedStudents.length} sur {filteredStudents.length} étudiants
            </p>
             {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft/></Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} size="icon" onClick={() => handlePageChange(i + 1)}>{i + 1}</Button>
                    ))}
                    <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight/></Button>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
