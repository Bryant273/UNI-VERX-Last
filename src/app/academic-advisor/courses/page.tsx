
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
  BookOpen,
  LayoutGrid,
  Pointer
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { semesterResults } from '@/lib/results-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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


const CoursesTab = () => {
    const [courses, setCourses] = useState(coursesWithStatus);
    const [levelFilter, setLevelFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [teacherFilter, setTeacherFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { onOpen } = useCourseModal();
    const [actionState, setActionState] = useState<{type: 'delete' | 'validate' | 'reject' | null, course: any}>({type: null, course: null});

    const isFiltered = levelFilter || classFilter || statusFilter || teacherFilter;

    const filteredCourses = useMemo(() => {
        if (!isFiltered) return [];
        return courses.filter(c => 
            (!levelFilter || c.level === levelFilter) &&
            (!classFilter || c.class === classFilter) &&
            (!statusFilter || c.status === statusFilter) &&
            (!teacherFilter || c.uploader === teacherFilter)
        );
    }, [courses, levelFilter, classFilter, statusFilter, teacherFilter, isFiltered]);

    const paginatedCourses = useMemo(() => {
        return filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredCourses, currentPage]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

    const uniqueTeachers = useMemo(() => ['', ...Array.from(new Set(courses.map(c => c.uploader)))], [courses]);

    const handleAction = (course: any, type: 'delete' | 'validate' | 'reject') => {
        setActionState({ type, course });
    };
    
    const handleConfirmAction = () => {
        console.log(`Action: ${actionState.type} on course ${actionState.course.id}`);
        setActionState({type: null, course: null});
    }

    return (
        <div className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Gestion des documents de cours</CardTitle>
                            <CardDescription>Validez, modifiez et gérez les documents de cours de toute l'université.</CardDescription>
                        </div>
                        <Button onClick={() => onOpen()}>
                            <Plus className="mr-2" /> Ajouter un document
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Select value={teacherFilter} onValueChange={setTeacherFilter}><SelectTrigger><SelectValue placeholder="Tous les enseignants"/></SelectTrigger><SelectContent>{uniqueTeachers.map(t => <SelectItem key={t} value={t}>{t === '' ? 'Tous les enseignants' : t}</SelectItem>)}</SelectContent></Select>
                        <Select value={levelFilter} onValueChange={setLevelFilter}><SelectTrigger><SelectValue placeholder="Tous les niveaux"/></SelectTrigger><SelectContent><SelectItem value="">Tous les niveaux</SelectItem><SelectItem value="L1">Licence 1</SelectItem><SelectItem value="L2">Licence 2</SelectItem><SelectItem value="L3">Licence 3</SelectItem><SelectItem value="M1">Master 1</SelectItem><SelectItem value="M2">Master 2</SelectItem></SelectContent></Select>
                        <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger><SelectValue placeholder="Toutes les filières"/></SelectTrigger><SelectContent><SelectItem value="">Toutes les filières</SelectItem><SelectItem value="INFO">Informatique</SelectItem><SelectItem value="MATH">Mathématiques</SelectItem><SelectItem value="PHYS">Physique</SelectItem><SelectItem value="ELEC">Électronique</SelectItem></SelectContent></Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Tous les statuts"/></SelectTrigger><SelectContent><SelectItem value="">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([key, {text}]) => <SelectItem key={key} value={key}>{text}</SelectItem>)}</SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            {isFiltered ? (
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
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed">
                    <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Consulter les cours</h3>
                    <p className="text-muted-foreground mt-2">Veuillez sélectionner au moins un filtre pour afficher la liste des documents de cours.</p>
                </Card>
            )}
            
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
    )
}

const ProgrammesTab = () => {
    const [semesterFilter, setSemesterFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);

    const isFiltered = semesterFilter && classFilter;

    const programData = useMemo(() => {
        if (!isFiltered) return {};

        let courses = [];
        if (semesterFilter === 's1' || semesterFilter === 'annual') {
            courses.push(...semesterResults.s1.courses);
        }
        if (semesterFilter === 's2' || semesterFilter === 'annual') {
            courses.push(...semesterResults.s2.courses);
        }
        
        return courses.reduce((acc, course) => {
            if (!acc[course.ue]) {
                acc[course.ue] = [];
            }
            acc[course.ue].push(course);
            return acc;
        }, {} as Record<string, typeof semesterResults.s1.courses>);
    }, [semesterFilter, classFilter, isFiltered]);
    
    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding new module");
        setIsAddModuleModalOpen(false);
    }

    return (
        <div className="space-y-6 mt-6">
             <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Maquettes des Programmes</CardTitle>
                            <CardDescription>Consultez les Unités d'Enseignement (UE) et les modules par semestre et par filière.</CardDescription>
                        </div>
                         <div className="flex flex-wrap items-center gap-3">
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Sélectionnez une filière" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="info-l3">Info L3</SelectItem>
                                    <SelectItem value="math-l2">Math L2</SelectItem>
                                </SelectContent>
                             </Select>
                             <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Sélectionnez un semestre" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="annual">Annuel</SelectItem>
                                    <SelectItem value="s1">Semestre 1</SelectItem>
                                    <SelectItem value="s2">Semestre 2</SelectItem>
                                </SelectContent>
                             </Select>
                             <Button onClick={() => setIsAddModuleModalOpen(true)}><Plus className="mr-2 h-4 w-4"/> Ajouter un module</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                    <p className="text-sm font-medium">Exportation</p>
                    <p className="text-xs text-muted-foreground">Téléchargez la maquette pour la filière et la période sélectionnée.</p>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exporter la maquette (.pdf)</Button>
                </CardFooter>
            </Card>

            {isFiltered ? (
                <Accordion type="multiple" defaultValue={Object.keys(programData)} className="w-full space-y-4">
                    {Object.entries(programData).map(([ue, courses]) => (
                        <AccordionItem key={ue} value={ue} className="border-0">
                            <Card>
                                <AccordionTrigger className="p-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-primary/10 rounded-lg text-primary"><BookOpen /></div>
                                        <div>
                                            <h3 className="text-base font-semibold text-left">{ue}</h3>
                                            <p className="text-sm text-muted-foreground text-left">{courses.length} modules</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Module</TableHead>
                                                    <TableHead>Crédits</TableHead>
                                                    <TableHead>Syllabus</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {courses.map(course => (
                                                    <TableRow key={course.id}>
                                                        <TableCell className="font-medium">{course.module}</TableCell>
                                                        <TableCell>{course.creditsToValidate}</TableCell>
                                                        <TableCell>
                                                            <Button variant="link" className="p-0 h-auto">
                                                                Voir le syllabus
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit/></Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2/></Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed">
                    <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Consulter les programmes</h3>
                    <p className="text-muted-foreground mt-2">Veuillez sélectionner une filière et un semestre pour afficher la maquette du programme.</p>
                </Card>
            )}

             <Dialog open={isAddModuleModalOpen} onOpenChange={setIsAddModuleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un nouveau module</DialogTitle>
                        <DialogDescription>Remplissez les informations pour créer un nouveau module dans la maquette.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddModule} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="module-name">Nom du module</Label>
                            <Input id="module-name" placeholder="Ex: Systèmes d'Exploitation Avancés"/>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="module-ue">Unité d'Enseignement (UE)</Label>
                            <Select>
                                <SelectTrigger id="module-ue"><SelectValue placeholder="Sélectionnez une UE" /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(programData).map(ue => <SelectItem key={ue} value={ue}>{ue}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="module-credits">Crédits ECTS</Label>
                            <Input id="module-credits" type="number" placeholder="Ex: 6"/>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="module-syllabus">Syllabus (PDF)</Label>
                             <div className="p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-xs text-muted-foreground">Cliquez ou glissez-déposez le fichier</p>
                                <Input id="module-syllabus" type="file" className="hidden" />
                             </div>
                        </div>
                         <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModuleModalOpen(false)}>Annuler</Button>
                            <Button type="submit">Ajouter le module</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default function AcademicAdvisorCoursesPage() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total des cours</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">247</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">En attente</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">15</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Publiés</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">218</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Enseignants actifs</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-purple-600">23</p></CardContent></Card>
        </div>

        <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courses"><LayoutGrid className="mr-2" />Gestion des cours</TabsTrigger>
                <TabsTrigger value="programmes"><BookOpen className="mr-2" />Programmes &amp; Maquettes</TabsTrigger>
            </TabsList>
            <TabsContent value="courses">
                <CoursesTab />
            </TabsContent>
            <TabsContent value="programmes">
                <ProgrammesTab />
            </TabsContent>
        </Tabs>
    </div>
  );
}
