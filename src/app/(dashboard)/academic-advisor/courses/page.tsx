
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  File as FileIcon,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileArchive,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Video,
  Play,
  Pause,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  UploadCloud,
  X,
  Plus,
  Trash2,
  Edit,
  Info,
  Check,
  XCircle,
  Clock,
  Globe,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { courseDocuments, type CourseDocument, type DocumentType } from '@/lib/course-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useCourseModal } from '@/hooks/use-course-modal';

const ITEMS_PER_PAGE = 10;

const documentTypeConfig: Record<
  DocumentType,
  { icon: LucideIcon; color: string; label: string }
> = {
  pdf: { icon: FileText, color: 'text-red-500', label: 'PDF' },
  docx: { icon: FileIcon, color: 'text-blue-500', label: 'Word' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', label: 'Excel' },
  pptx: { icon: Presentation, color: 'text-orange-500', label: 'PowerPoint' },
  zip: { icon: FileArchive, color: 'text-purple-500', label: 'Archive' },
  mp4: { icon: Video, color: 'text-indigo-500', label: 'Vidéo' },
};

const FileTypeIcon: React.FC<{ type: DocumentType }> = ({ type }) => {
    const config = documentTypeConfig[type] || { icon: FileIcon, color: 'text-gray-500' };
    return <config.icon className={`h-5 w-5 ${config.color}`} />;
};

const statusConfig = {
    published: { text: 'Publié', icon: Globe, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    approved: { text: 'Approuvé', icon: Check, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    pending: { text: 'En attente', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    rejected: { text: 'Rejeté', icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
};

// Add a status to the mock data for demonstration
const coursesWithStatus = courseDocuments.map((doc, index) => ({
    ...doc,
    status: ['published', 'approved', 'pending', 'rejected'][index % 4] as keyof typeof statusConfig
}));


export default function AcademicAdvisorCoursesPage() {
  const [courses, setCourses] = useState(coursesWithStatus);
  const [levelFilter, setLevelFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { onOpen } = useCourseModal();
  const [actionState, setActionState] = useState<{type: 'delete' | 'validate' | 'reject' | null, course: any}>({type: null, course: null});

  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
        (levelFilter === 'all' || c.level === levelFilter) &&
        (classFilter === 'all' || c.class === classFilter) &&
        (statusFilter === 'all' || c.status === statusFilter) &&
        (teacherFilter === 'all' || c.uploader === teacherFilter)
    );
  }, [courses, levelFilter, classFilter, statusFilter, teacherFilter]);

  const paginatedCourses = useMemo(() => {
      return filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const uniqueTeachers = useMemo(() => ['all', ...Array.from(new Set(courses.map(c => c.uploader)))], [courses]);

  const stats = useMemo(() => ({
    total: courses.length,
    pending: courses.filter(c => c.status === 'pending').length,
    published: courses.filter(c => c.status === 'published').length,
    teachers: uniqueTeachers.length - 1
  }), [courses, uniqueTeachers]);

  const handleAction = (course: any, type: 'delete' | 'validate' | 'reject') => {
    setActionState({ type, course });
  };
  
  const handleConfirmAction = () => {
      // In a real app, you would perform the action here
      console.log(`Action: ${actionState.type} on course ${actionState.course.id}`);
      setActionState({type: null, course: null});
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total des cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">En attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Publiés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{stats.published}</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Enseignants actifs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-purple-600">{stats.teachers}</p></CardContent></Card>
        </div>

        <Card>
            <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Gestion des cours</CardTitle>
                        <CardDescription>Validez, modifiez et gérez les documents de cours de toute l'université.</CardDescription>
                    </div>
                    <Button onClick={() => onOpen()}>
                        <Plus className="mr-2" /> Ajouter un cours
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Select value={teacherFilter} onValueChange={setTeacherFilter}><SelectTrigger><SelectValue placeholder="Tous les enseignants"/></SelectTrigger><SelectContent>{uniqueTeachers.map(t => <SelectItem key={t} value={t}>{t === 'all' ? 'Tous les enseignants' : t}</SelectItem>)}</SelectContent></Select>
                    <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger><SelectValue placeholder="Tous les niveaux"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les niveaux</SelectItem><SelectItem value="L1">Licence 1</SelectItem><SelectItem value="L2">Licence 2</SelectItem><SelectItem value="L3">Licence 3</SelectItem><SelectItem value="M1">Master 1</SelectItem><SelectItem value="M2">Master 2</SelectItem></SelectContent></Select>
                    <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger><SelectValue placeholder="Toutes les filières"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les filières</SelectItem><SelectItem value="INFO">Informatique</SelectItem><SelectItem value="MATH">Mathématiques</SelectItem><SelectItem value="PHYS">Physique</SelectItem><SelectItem value="ELEC">Électronique</SelectItem></SelectContent></Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Tous les statuts"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([key, {text}]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}</SelectContent></Select>
                </div>
            </CardContent>
        </Card>

        <Card>
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Publication</TableHead>
                            <TableHead>Enseignant</TableHead>
                            <TableHead>Niveau/Filière</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCourses.map((course) => {
                            const status = statusConfig[course.status];
                            return (
                                <TableRow key={course.id} className="even:bg-muted/40">
                                    <TableCell className="text-sm text-muted-foreground">{course.date}</TableCell>
                                    <TableCell className="font-medium">{course.uploader}</TableCell>
                                    <TableCell>{course.level} {course.class}</TableCell>
                                    <TableCell>{course.module}</TableCell>
                                    <TableCell><div className="flex items-center gap-2"><FileTypeIcon type={course.type} /> <span>{course.documentName}</span></div></TableCell>
                                    <TableCell><Badge variant="outline" className={cn("border-0", status.color)}><status.icon className="mr-1.5 h-3.5 w-3.5" />{status.text}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye/></Button></TooltipTrigger><TooltipContent><p>Voir</p></TooltipContent></Tooltip>
                                            {course.status === 'pending' && (
                                                <>
                                                 <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleAction(course, 'validate')}><Check/></Button></TooltipTrigger><TooltipContent><p>Valider</p></TooltipContent></Tooltip>
                                                 <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleAction(course, 'reject')} className="text-destructive hover:text-destructive"><XCircle/></Button></TooltipTrigger><TooltipContent><p>Rejeter</p></TooltipContent></Tooltip>
                                                </>
                                            )}
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => onOpen(course)}><Edit/></Button></TooltipTrigger><TooltipContent><p>Modifier</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleAction(course, 'delete')} className="text-destructive hover:text-destructive"><Trash2/></Button></TooltipTrigger><TooltipContent><p>Supprimer</p></TooltipContent></Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
             </div>
             <CardFooter className="p-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Affichage de {paginatedCourses.length} sur {filteredCourses.length} cours</p>
                {totalPages > 1 && (
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                        <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                )}
             </CardFooter>
        </Card>

        {/* Action confirmation modals */}
        <Dialog open={!!actionState.type} onOpenChange={() => setActionState({type: null, course: null})}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmer l'action</DialogTitle>
                    <DialogDescription>
                       {actionState.type === 'delete' && `Êtes-vous sûr de vouloir supprimer le document "${actionState.course?.documentName}" ?`}
                       {actionState.type === 'validate' && `Êtes-vous sûr de vouloir valider le document "${actionState.course?.documentName}" ?`}
                       {actionState.type === 'reject' && `Êtes-vous sûr de vouloir rejeter le document "${actionState.course?.documentName}" ?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setActionState({type: null, course: null})}>Annuler</Button>
                    <Button 
                        variant={actionState.type === 'delete' || actionState.type === 'reject' ? 'destructive' : 'default'}
                        onClick={handleConfirmAction}
                    >
                       {actionState.type === 'delete' && 'Supprimer'}
                       {actionState.type === 'validate' && 'Valider'}
                       {actionState.type === 'reject' && 'Rejeter'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
