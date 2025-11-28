
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { studentData } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCourseModal } from '@/hooks/use-course-modal';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const ITEMS_PER_PAGE = 5;

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

const FileTypeIcon: React.FC<{ type: DocumentType, showLabel?: boolean }> = ({ type, showLabel = false }) => {
  const config = documentTypeConfig[type] || { icon: FileIcon, color: 'text-gray-500', label: 'Fichier' };
  const { icon: Icon, color, label } = config;
  const colorBg = color.replace('text-', 'bg-').replace('-500', '-500/10');
  
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${colorBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      {showLabel && <span className="font-semibold">{label}</span>}
    </div>
  );
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const DocumentViewer = ({ doc }: { doc: CourseDocument }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => setProgress((video.currentTime / video.duration) * 100);
        const setVideoDuration = () => setDuration(video.duration);

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoDuration);

         const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        
        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoDuration);
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current?.paused) {
            videoRef.current?.play();
            setIsPlaying(true);
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            const newTime = (value[0] / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
        }
    };
    
    const handleVolumeChange = (value: number[]) => {
        if(videoRef.current) {
            setVolume(value[0]);
            videoRef.current.volume = value[0];
        }
    };
    
    const toggleFullScreen = (elementRef: React.RefObject<HTMLElement>) => {
        const element = elementRef.current;
        if (!element) return;

        if (!document.fullscreenElement) {
            element.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    if (doc.type === 'mp4') {
        return (
            <div ref={viewerRef} className="relative group bg-black rounded-lg">
                <video ref={videoRef} src={doc.fileUrl} className="w-full rounded-lg" onClick={togglePlay} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="icon" onClick={togglePlay} className="h-16 w-16 text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    </Button>
                </div>
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                        <span className="text-white text-xs">{formatTime(videoRef.current?.currentTime || 0)}</span>
                        <Slider value={[progress]} onValueChange={handleSeek} className="w-full" />
                        <span className="text-white text-xs">{formatTime(duration)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20"><span className="sr-only">Play/Pause</span>{isPlaying ? <Pause /> : <Play />}</Button>
                             <div className="flex items-center gap-2 text-white">
                                <Button variant="ghost" size="icon" onClick={() => handleVolumeChange([volume > 0 ? 0 : 1])} className="text-white hover:bg-white/20">{volume === 0 ? <VolumeX/> : <Volume2/>}</Button>
                                <Slider value={[volume]} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-24" />
                             </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleFullScreen(viewerRef)} className="text-white hover:bg-white/20">
                            <span className="sr-only">Fullscreen</span>
                            {isFullScreen ? <Minimize/> : <Maximize/>}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    
    let previewContent;
    switch (doc.type) {
        case 'pdf':
        case 'docx':
            previewContent = (
                 <div className="text-center text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    <div ref={viewerRef} className="w-full bg-background p-6 rounded-md shadow-sm h-[350px] flex flex-col">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <span className="text-sm font-medium">{doc.documentName}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => toggleFullScreen(viewerRef)}>
                                            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Plein écran</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex-grow overflow-hidden relative">
                             <p className="text-xs text-left text-muted-foreground/50 blur-[2px] select-none">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in...
                            </p>
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                        </div>
                    </div>
                    <p className="mt-4 font-semibold text-foreground">Prévisualisation du document</p>
                    <p className="text-sm">Le contenu serait affiché ici.</p>
                </div>
            );
            break;
        case 'xlsx':
             previewContent = (
                 <div className="text-center text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    <div ref={viewerRef} className="w-full bg-background p-4 rounded-md shadow-sm h-[350px] flex flex-col">
                        <div className="flex justify-between items-center pb-2 mb-2">
                             <h4 className="font-semibold">Aperçu Tableur</h4>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => toggleFullScreen(viewerRef)}>
                                            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Plein écran</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex-grow border rounded-md p-2 overflow-hidden relative">
                            <FileSpreadsheet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-green-500/10"/>
                            <p className="text-sm text-left text-muted-foreground/50 blur-sm select-none">
                                | A | B | C | D |<br/>
                                1 | Data | Value | Date |<br/>
                                2 | Item 1 | 123 | 2025-05-10 |<br/>
                                3 | Item 2 | 456 | 2025-05-11 |<br/>
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center border-t mt-2 pt-2">
                           <Button variant="ghost" size="sm" className="bg-primary/10 h-7">Feuille 1</Button>
                           <Button variant="ghost" size="sm" className="h-7">Feuille 2</Button>
                           <Button variant="ghost" size="sm" className="h-7">Feuille 3</Button>
                        </div>
                    </div>
                    <p className="mt-4 text-sm">Le contenu serait affiché ici.</p>
                </div>
             );
            break;
        case 'pptx':
            previewContent = (
                 <div className="text-center text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    <div ref={viewerRef} className="w-full bg-background p-4 rounded-md shadow-sm h-[350px] flex flex-col">
                         <div className="flex justify-between items-center pb-2">
                             <h4 className="font-semibold">Aperçu Présentation</h4>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => toggleFullScreen(viewerRef)}>
                                            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Plein écran</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                         <div className="flex-grow border rounded-md p-2 flex items-center justify-center relative bg-slate-900 overflow-hidden">
                            <Presentation className="h-24 w-24 text-orange-500/30"/>
                             <p className="absolute text-xl font-bold text-white z-10">Titre de la Diapositive</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-center gap-4 mt-4">
                           <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                           <span className="text-sm font-medium">1 / 15</span>
                           <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                    <p className="mt-4 text-sm">Le contenu serait affiché ici.</p>
                </div>
            );
            break;
        default:
            previewContent = (
                <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <FileTypeIcon type={doc.type} />
                        <p className="mt-4 font-semibold">Prévisualisation non disponible</p>
                        <p className="text-sm">Le contenu du fichier serait affiché ici.</p>
                    </div>
                </div>
            );
    }
    
    return <div className="py-4">{previewContent}</div>;
};


export default function ProfessorCoursesPage() {
  const role = 'professor';

  const [courses, setCourses] = useState<CourseDocument[]>(courseDocuments);
  const [levelFilter, setLevelFilter] = useState('L3');
  const [classFilter, setClassFilter] = useState('INFO');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalDoc, setViewModalDoc] = useState<CourseDocument | null>(null);
  const [deleteModalDoc, setDeleteModalDoc] = useState<CourseDocument | null>(null);
  const { isOpen, onClose, onOpen, initialData } = useCourseModal();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
        setSelectedFile(null);
    }
  }, [isOpen]);
  
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
        setSelectedFile(files[0]);
    }
  };

  const studentCourses = useMemo(() => {
    const studentLevel = studentData.level.split(' ')[1]; // "L1", "M1", etc.
    const studentMajor = 'INFO'; // This should come from student data
    return courses
      .filter((doc) => doc.level === studentLevel)
      .filter((doc) => doc.class === studentMajor);
  }, [courses]);

  const filteredDocuments = useMemo(() => {
    let documents = role === 'student' ? studentCourses : courses;
    
    if (role === 'student') {
        if (moduleFilter !== 'all') {
            documents = documents.filter((doc) => doc.module === moduleFilter);
        }
    } else {
        documents = documents
            .filter((doc) => levelFilter === 'all' || doc.level === levelFilter)
            .filter((doc) => classFilter === 'all' || doc.class === classFilter);
    }
    return documents;
  }, [courses, studentCourses, levelFilter, classFilter, moduleFilter, role]);

  const studentModules = useMemo(() => {
    const modules = new Set(studentCourses.map(doc => doc.module));
    return ['all', ...Array.from(modules)];
  }, [studentCourses]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleDelete = (docId: number) => {
    setCourses(prev => prev.filter(c => c.id !== docId));
    setDeleteModalDoc(null);
  }
  
  const handleSave = (formData: Omit<CourseDocument, 'id' | 'date'> & { id?: number }) => {
    if (initialData && formData.id) {
      // This is an edit
      setCourses(prev => prev.map(c => 
        c.id === formData.id 
          ? { ...c, ...formData, date: new Date().toLocaleDateString('fr-FR') } 
          : c
      ));
    } else {
      // This is a new course
      const newCourse: CourseDocument = {
        ...formData,
        id: Math.max(...courses.map(c => c.id), 0) + 1,
        date: new Date().toLocaleDateString('fr-FR'),
      };
      setCourses(prev => [newCourse, ...prev]);
    }
    onClose();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {role === 'student' ? 'Mes Cours' : 'Gestion des cours'}
          </CardTitle>
          <CardDescription>
            {role === 'student' 
              ? 'Retrouvez ici tous les documents et supports partagés par vos enseignants.'
              : 'Ajoutez, modifiez et consultez les documents de cours pour vos classes.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {role === 'student' ? (
                <div>
                  <label htmlFor="selectModule" className="text-sm font-medium">Module</label>
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger id="selectModule" className="w-full sm:w-[240px] mt-1">
                      <SelectValue placeholder="Tous les modules" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentModules.map(mod => (
                        <SelectItem key={mod} value={mod}>
                          {mod === 'all' ? 'Tous les modules' : mod}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div>
                  <label htmlFor="selectLevel" className="text-sm font-medium">Niveau</label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger id="selectLevel" className="w-full sm:w-[180px] mt-1">
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem value="L1">Licence 1</SelectItem>
                      <SelectItem value="L2">Licence 2</SelectItem>
                      <SelectItem value="L3">Licence 3</SelectItem>
                      <SelectItem value="M1">Master 1</SelectItem>
                      <SelectItem value="M2">Master 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="selectClass" className="text-sm font-medium">Filière</label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger id="selectClass" className="w-full sm:w-[180px] mt-1">
                      <SelectValue placeholder="Toutes les filières" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les filières</SelectItem>
                      <SelectItem value="INFO">Informatique</SelectItem>
                      <SelectItem value="MATH">Mathématiques</SelectItem>
                      <SelectItem value="PHYS">Physique</SelectItem>
                      <SelectItem value="ELEC">Électronique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {role !== 'student' && (
                <Button onClick={() => onOpen()}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
                </Button>
            )}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <Info className="text-blue-600 dark:text-blue-400 mr-2 h-5 w-5" />
              <span className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">{filteredDocuments.length} documents</span> correspondent à votre sélection.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Date de mise en ligne</TableHead>
                <TableHead>Nom du module</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((doc, index) => (
                <TableRow key={doc.id} className="even:bg-muted/40">
                  <TableCell className="font-medium text-muted-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.date}</TableCell>
                  <TableCell className="font-medium">{doc.module}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <FileTypeIcon type={doc.type} />
                       <span>{doc.documentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setViewModalDoc(doc)}><Eye className="h-4 w-4" /></Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Voir</p></TooltipContent>
                        </Tooltip>
                        {role !== 'student' && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => onOpen(doc)}><Edit className="h-4 w-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Modifier</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteModalDoc(doc)}><Trash2 className="h-4 w-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Supprimer</p></TooltipContent>
                                </Tooltip>
                            </>
                        )}
                     </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
           <p className="text-sm text-muted-foreground">
             Affichage de {paginatedDocuments.length} sur {filteredDocuments.length} documents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} size="icon" onClick={() => setCurrentPage(i+1)} className="h-8 w-8">{i + 1}</Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {viewModalDoc && (
        <Dialog open={!!viewModalDoc} onOpenChange={() => setViewModalDoc(null)}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileTypeIcon type={viewModalDoc.type} showLabel />
                <span>{viewModalDoc.documentName}</span>
              </DialogTitle>
              <DialogDescription>{viewModalDoc.module}</DialogDescription>
            </DialogHeader>
            
            <DocumentViewer doc={viewModalDoc} />

            <DialogFooter>
              <Button variant="ghost" onClick={() => setViewModalDoc(null)}>Fermer</Button>
              <Button asChild>
                <a href={viewModalDoc.fileUrl} download>
                  <Download className="mr-2 h-4 w-4" /> Télécharger
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {deleteModalDoc && (
        <Dialog open={!!deleteModalDoc} onOpenChange={() => setDeleteModalDoc(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer le document "{deleteModalDoc.documentName}"? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setDeleteModalDoc(null)}>Annuler</Button>
                    <Button variant="destructive" onClick={() => handleDelete(deleteModalDoc.id)}>Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

       <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-xl">
             <DialogHeader>
                <DialogTitle>{initialData ? 'Modifier le cours' : 'Ajouter un cours'}</DialogTitle>
                <DialogDescription>Remplissez les informations ci-dessous.</DialogDescription>
             </DialogHeader>
             <form onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const data = {
                     id: initialData?.id,
                     module: formData.get('module') as string,
                     documentName: selectedFile?.name || initialData?.documentName || 'Nouveau document',
                     description: formData.get('description') as string,
                     type: (selectedFile?.name.split('.').pop() as DocumentType) || initialData?.type || 'pdf',
                     uploader: 'Dr. Claire Dubois',
                     level: formData.get('level') as string,
                     class: formData.get('class') as string,
                     fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : (initialData?.fileUrl || '#')
                 }
                 handleSave(data);
             }}>
                 <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                            <label htmlFor="level" className="text-sm font-medium">Niveau</label>
                            <Select name="level" defaultValue={initialData?.level || 'L3'}>
                                <SelectTrigger id="level"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L1">Licence 1</SelectItem>
                                    <SelectItem value="L2">Licence 2</SelectItem>
                                    <SelectItem value="L3">Licence 3</SelectItem>
                                    <SelectItem value="M1">Master 1</SelectItem>
                                    <SelectItem value="M2">Master 2</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                       <div className="space-y-2">
                            <label htmlFor="class" className="text-sm font-medium">Filière</label>
                            <Select name="class" defaultValue={initialData?.class || 'INFO'}>
                                <SelectTrigger id="class"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INFO">Informatique</SelectItem>
                                    <SelectItem value="MATH">Mathématiques</SelectItem>
                                    <SelectItem value="PHYS">Physique</SelectItem>
                                    <SelectItem value="ELEC">Électronique</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                    </div>
                     <div className="space-y-2">
                         <label htmlFor="module" className="text-sm font-medium">Module</label>
                         <Select name="module" defaultValue={initialData?.module}>
                            <SelectTrigger id="module"><SelectValue placeholder="Sélectionnez un module" /></SelectTrigger>
                            <SelectContent>
                                {['Bases de Données', 'Algorithmique', 'Programmation', 'Développement Web', 'Réseaux Informatiques', 'Mathématiques', 'Systèmes d\'exploitation'].map(mod => <SelectItem key={mod} value={mod}>{mod}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                      <div className="space-y-2">
                         <label htmlFor="description" className="text-sm font-medium">Description</label>
                         <Textarea id="description" name="description" defaultValue={initialData?.description || ''} placeholder="Brève description du contenu du document..." />
                     </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Fichier</label>
                         {selectedFile || initialData?.documentName ? (
                            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{selectedFile?.name || initialData?.documentName}</p>
                                        {selectedFile && <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                         ) : (
                            <div 
                                className="p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                                onClick={() => document.getElementById('file-upload-modal')?.click()}
                            >
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-xs text-muted-foreground">Cliquez ou glissez-déposez</p>
                                <Input id="file-upload-modal" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                            </div>
                         )}
                     </div>
                 </div>
                 <DialogFooter>
                     <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
                     <Button type="submit">Enregistrer</Button>
                 </DialogFooter>
             </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
