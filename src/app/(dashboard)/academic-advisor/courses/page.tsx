
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Book,
  Clock,
  CheckCircle,
  Globe,
  X,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  UploadCloud,
  Paperclip,
  File as FileIcon,
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileCode2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { allCoursesData, type AdvisorCourse } from '@/lib/advisor-data';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<AdvisorCourse['status'], { text: string; icon: LucideIcon; color: string; }> = {
  pending: { text: 'En attente', icon: Clock, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
  approved: { text: 'Approuvé', icon: Check, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  published: { text: 'Publié', icon: Globe, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
  rejected: { text: 'Rejeté', icon: X, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
};

const extensionConfig: Record<string, { icon: LucideIcon, color: string }> = {
  pdf: { icon: FileText, color: 'text-red-500' },
  docx: { icon: FileCode2, color: 'text-blue-500' },
  doc: { icon: FileCode2, color: 'text-blue-500' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500' },
  pptx: { icon: FileCode2, color: 'text-orange-500' },
  zip: { icon: FileArchive, color: 'text-purple-500' },
  default: { icon: FileIcon, color: 'text-gray-500' },
};

const FileTypeIcon = ({ extension }: { extension: string }) => {
  const config = extensionConfig[extension] || extensionConfig.default;
  const { icon: Icon, color } = config;
  return (
    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-muted`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
  );
};

export default function AdvisorCoursesPage() {
  const [courses, setCourses] = useState<AdvisorCourse[]>(allCoursesData);
  const [filteredCourses, setFilteredCourses] = useState<AdvisorCourse[]>(allCoursesData);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Data for modals
  const [editingCourse, setEditingCourse] = useState<AdvisorCourse | null>(null);
  const [viewingCourse, setViewingCourse] = useState<AdvisorCourse | null>(null);
  const [validationState, setValidationState] = useState<{ course: AdvisorCourse, action: 'approve' | 'reject' } | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<AdvisorCourse | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileDropZoneRef = useRef<HTMLDivElement>(null);


  const uniqueTeachers = useMemo(() => ['all', ...Array.from(new Set(allCoursesData.map(c => c.teacher)))], [courses]);
  const uniqueLevels = useMemo(() => ['all', ...Array.from(new Set(allCoursesData.map(c => c.level)))], [courses]);
  const uniqueClasses = useMemo(() => ['all', ...Array.from(new Set(allCoursesData.map(c => c.class)))], [courses]);
  
  // Filtering Logic
  useEffect(() => {
    let tempCourses = [...courses];
    if (teacherFilter !== 'all') tempCourses = tempCourses.filter(c => c.teacher === teacherFilter);
    if (levelFilter !== 'all') tempCourses = tempCourses.filter(c => c.level === levelFilter);
    if (classFilter !== 'all') tempCourses = tempCourses.filter(c => c.class === classFilter);
    if (statusFilter !== 'all') tempCourses = tempCourses.filter(c => c.status === statusFilter);
    setFilteredCourses(tempCourses);
    setCurrentPage(1);
  }, [teacherFilter, levelFilter, classFilter, statusFilter, courses]);
  
  // Pagination Logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  // Modal Handlers
  const handleOpenCourseModal = (course: AdvisorCourse | null) => {
    setEditingCourse(course);
    setSelectedFile(null);
    setIsCourseModalOpen(true);
  };
  
  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleOpenViewModal = (course: AdvisorCourse) => {
    setViewingCourse(course);
    setIsViewModalOpen(true);
  };

  const handleOpenValidateModal = (course: AdvisorCourse, action: 'approve' | 'reject') => {
    setValidationState({ course, action });
    setIsValidateModalOpen(true);
  };
  
  const handleOpenDeleteModal = (course: AdvisorCourse) => {
    setDeletingCourse(course);
    setIsDeleteModalOpen(true);
  };

  // CRUD Operations
  const handleSaveCourse = (formData: Omit<AdvisorCourse, 'id' | 'date'>) => {
    if (editingCourse) {
      // Update
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      // Create
      const newCourse: AdvisorCourse = {
        id: Math.max(...courses.map(c => c.id)) + 1,
        date: new Date().toLocaleDateString('fr-FR'),
        ...formData
      };
      setCourses([newCourse, ...courses]);
    }
    handleCloseCourseModal();
  };
  
  const handleConfirmValidation = () => {
    if (!validationState) return;
    setCourses(courses.map(c => c.id === validationState.course.id ? { ...c, status: validationState.action === 'approve' ? 'approved' : 'rejected' } : c));
    setIsValidateModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingCourse) return;
    setCourses(courses.filter(c => c.id !== deletingCourse.id));
    setIsDeleteModalOpen(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };


  return (
    <div className="space-y-6">
      {/* Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des cours</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{courses.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-500">{courses.filter(c => c.status === 'pending').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">{courses.filter(c => c.status === 'published').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enseignants actifs</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-purple-500">{uniqueTeachers.length - 1}</div></CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                <SelectTrigger className="w-full md:w-auto"><SelectValue placeholder="Tous les enseignants" /></SelectTrigger>
                <SelectContent>{uniqueTeachers.map(t => <SelectItem key={t} value={t}>{t === 'all' ? 'Tous les enseignants' : t}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-auto"><SelectValue placeholder="Tous les niveaux" /></SelectTrigger>
                <SelectContent>{uniqueLevels.map(l => <SelectItem key={l} value={l}>{l === 'all' ? 'Tous les niveaux' : l}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-full md:w-auto"><SelectValue placeholder="Toutes les filières" /></SelectTrigger>
                <SelectContent>{uniqueClasses.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Toutes les filières' : c}</SelectItem>)}</SelectContent>
              </Select>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-auto"><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.text}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <Button variant="outline" className="w-full lg:w-auto"><Filter className="mr-2 h-4 w-4" />Filtrer</Button>
              <Button className="w-full lg:w-auto" onClick={() => handleOpenCourseModal(null)}><Plus className="mr-2 h-4 w-4" />Ajouter un cours</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Niveau/Filière</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCourses.map((course) => {
                const status = statusConfig[course.status];
                return (
                  <TableRow key={course.id}>
                    <TableCell>{course.date}</TableCell>
                    <TableCell>{course.teacher}</TableCell>
                    <TableCell>{course.level} {course.class}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileTypeIcon extension={course.extension} />
                        <span>{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-0 ${status.color}`}><status.icon className="mr-1.5 h-3 w-3" />{status.text}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenViewModal(course)}><Eye className="h-4 w-4" /></Button>
                      {course.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="text-green-500" onClick={() => handleOpenValidateModal(course, 'approve')}><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleOpenValidateModal(course, 'reject')}><X className="h-4 w-4" /></Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleOpenCourseModal(course)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleOpenDeleteModal(course)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">Affichage de {paginatedCourses.length} sur {filteredCourses.length} documents</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
        </CardFooter>
      </Card>

      {/* Modals */}
      <Dialog open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingCourse ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data: any = Object.fromEntries(formData.entries());
            data.extension = selectedFile?.name.split('.').pop() || editingCourse?.extension || '';
            handleSaveCourse(data);
          }}>
            <div className="space-y-4 py-4">
                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teacher">Enseignant</Label>
                    <Select name="teacher" defaultValue={editingCourse?.teacher}>
                      <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                      <SelectContent>{uniqueTeachers.slice(1).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                   <div>
                    <Label htmlFor="module">Module</Label>
                    <Select name="module" defaultValue={editingCourse?.module}>
                      <SelectTrigger id="module"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="Bases de Données">Bases de Données</SelectItem>
                          <SelectItem value="Algorithmique">Algorithmique</SelectItem>
                          <SelectItem value="Programmation">Programmation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select name="level" defaultValue={editingCourse?.level}>
                      <SelectTrigger id="level"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                      <SelectContent>{uniqueLevels.slice(1).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="class">Filière</Label>
                    <Select name="class" defaultValue={editingCourse?.class}>
                      <SelectTrigger id="class"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                      <SelectContent>{uniqueClasses.slice(1).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Titre du document</Label>
                  <Input id="title" name="title" defaultValue={editingCourse?.title} />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingCourse?.description} />
                </div>

                <div>
                    <Label>Document</Label>
                    <div ref={fileDropZoneRef}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary">
                        <div className="space-y-1 text-center">
                            {selectedFile ? (
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-5 w-5 text-gray-500" />
                                  <span className="font-medium">{selectedFile.name}</span>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}><X className="h-4 w-4 text-red-500"/></button>
                                </div>
                            ) : (
                                <>
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour sélectionner</p>
                                </>
                            )}
                        </div>
                    </div>
                    <input ref={fileInputRef} id="file-upload" name="file" type="file" className="sr-only" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                </div>
                 <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select name="status" defaultValue={editingCourse?.status || 'pending'}>
                      <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(statusConfig).map(([key, config]) => <SelectItem key={key} value={key}>{config.text}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseCourseModal}>Annuler</Button>
              <Button type="submit">{editingCourse ? 'Sauvegarder' : 'Enregistrer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{viewingCourse?.title}</DialogTitle>
                <DialogDescription>{viewingCourse?.module} - {viewingCourse?.level} {viewingCourse?.class}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <p><strong>Enseignant:</strong> {viewingCourse?.teacher}</p>
                <p><strong>Date:</strong> {viewingCourse?.date}</p>
                <p className="flex items-center gap-2"><strong>Statut:</strong> <Badge variant="outline" className={`border-0 ${statusConfig[viewingCourse?.status || 'pending'].color}`}><statusConfig[viewingCourse?.status || 'pending'].icon className="mr-1.5 h-3 w-3" />{statusConfig[viewingCourse?.status || 'pending'].text}</Badge></p>
                <p><strong>Description:</strong> {viewingCourse?.description || 'N/A'}</p>
            </div>
             <div className="my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[200px]">
                <div className="text-center text-muted-foreground">
                    <FileIcon className="mx-auto h-16 w-16" />
                    <p className="mt-4 font-semibold">Aperçu non disponible</p>
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>Fermer</Button>
                <Button><Download className="mr-2 h-4 w-4"/>Télécharger</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isValidateModalOpen} onOpenChange={setIsValidateModalOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>{validationState?.action === 'approve' ? 'Valider' : 'Rejeter'} le document</DialogTitle>
                  <DialogDescription>Êtes-vous sûr de vouloir {validationState?.action === 'approve' ? 'valider' : 'rejeter'} "{validationState?.course.title}" ?</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                  <Label htmlFor="validation-comment">Commentaire (optionnel)</Label>
                  <Textarea id="validation-comment" placeholder="Ajouter un commentaire..."/>
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsValidateModalOpen(false)}>Annuler</Button>
                  <Button variant={validationState?.action === 'approve' ? 'default' : 'destructive'} onClick={handleConfirmValidation}>{validationState?.action === 'approve' ? 'Valider' : 'Rejeter'}</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                      <div className="p-3 bg-destructive/10 rounded-full w-fit mx-auto my-4"><AlertTriangle className="h-8 w-8 text-destructive"/></div>
                      Êtes-vous sûr de vouloir supprimer "{deletingCourse?.title}"? Cette action est irréversible.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-row justify-center sm:justify-center pt-4">
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}><Trash2 className="mr-2"/>Supprimer</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}
