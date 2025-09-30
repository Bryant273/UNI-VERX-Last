'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  File as FileIcon,
  FileText,
  FileCode2,
  FileSpreadsheet,
  FileArchive,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Loader2,
  Video,
  Play,
  Pause,
  Rewind,
  FastForward,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { courseDocuments, type CourseDocument, type DocumentType } from '@/lib/course-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const ITEMS_PER_PAGE = 5;

const documentTypeConfig: Record<
  DocumentType,
  { icon: LucideIcon; color: string; label: string }
> = {
  pdf: { icon: FileText, color: 'text-red-500', label: 'PDF' },
  docx: { icon: FileIcon, color: 'text-blue-500', label: 'Word' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', label: 'Excel' },
  pptx: { icon: FileCode2, color: 'text-orange-500', label: 'PowerPoint' },
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
      {showLabel && <span>{label}</span>}
    </div>
  );
};

const ExcelPreview = () => (
    <div className="p-4 bg-white dark:bg-gray-800 h-full">
        <Tabs defaultValue="Feuil1">
            <TabsList>
                <TabsTrigger value="Feuil1">Feuil1</TabsTrigger>
                <TabsTrigger value="Feuil2">Feuil2</TabsTrigger>
                <TabsTrigger value="Stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="Feuil1" className="bg-white dark:bg-gray-800">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            {['', 'A', 'B', 'C', 'D'].map(h => <th key={h} className="border border-gray-300 dark:border-gray-600 p-2 font-semibold bg-gray-100 dark:bg-gray-700">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map(row => (
                            <tr key={row}>
                                <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold bg-gray-100 dark:bg-gray-700">{row}</td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2">Donnée {row}-1</td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2">Donnée {row}-2</td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2">Donnée {row}-3</td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2">Donnée {row}-4</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TabsContent>
            <TabsContent value="Feuil2">Contenu de la feuille 2.</TabsContent>
            <TabsContent value="Stats">Graphiques et statistiques ici.</TabsContent>
        </Tabs>
    </div>
);

const PowerPointPreview = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-800 p-4">
            <div className="w-full aspect-video bg-white dark:bg-black flex flex-col items-center justify-center text-center p-8 shadow-2xl mb-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Titre de la Diapositive</h2>
                <ul className="mt-4 text-left list-disc list-inside text-gray-600 dark:text-gray-300">
                    <li>Premier point important.</li>
                    <li>Deuxième point à considérer.</li>
                    <li>Troisième élément clé.</li>
                </ul>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <SkipBack />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-12 w-12" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={28}/> : <Play size={28}/>}
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <SkipForward />
                </Button>
            </div>
        </div>
    );
};

const ArchivePreview: React.FC<{doc: CourseDocument}> = ({doc}) => (
    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
        <FileArchive className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aperçu non disponible pour les archives</h3>
        <p className="text-sm text-muted-foreground mb-4">
            Ce fichier est une archive (.zip) et ne peut pas être prévisualisé directement.
        </p>
        <Button asChild>
            <a href={doc.fileUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Télécharger l'archive
            </a>
        </Button>
    </div>
);

const VideoPreview: React.FC<{ doc: CourseDocument }> = ({ doc }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressContainerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [duration, setDuration] = useState('00:00');
    const [controlsVisible, setControlsVisible] = useState(true);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setProgress((video.currentTime / video.duration) * 100);
            setCurrentTime(formatTime(video.currentTime));
        };

        const setVideoDuration = () => {
             if (video.duration && isFinite(video.duration)) {
                setDuration(formatTime(video.duration));
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', setVideoDuration);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handlePause);


        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', setVideoDuration);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handlePause);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    };

    const handleSeek = (amount: number) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + amount));
        }
    };
    
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const progressContainer = progressContainerRef.current;
        const video = videoRef.current;
        if (video && progressContainer) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * video.duration;
            video.currentTime = newTime;
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden relative group">
            <video ref={videoRef} src={doc.fileUrl} className="w-full h-full object-contain" onClick={togglePlay}/>

             <div className={cn(
                "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
                "opacity-0 group-hover:opacity-100",
                isPlaying && "opacity-0"
             )}>
                <div className="space-y-2">
                    <div ref={progressContainerRef} className="w-full cursor-pointer py-2" onClick={handleProgressClick}>
                       <Progress value={progress} className="h-1.5" />
                    </div>
                    <div className="flex justify-between items-center text-white">
                        <span className="text-xs font-mono">{currentTime}</span>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => handleSeek(-5)}>
                                <Rewind />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-14 w-14" onClick={togglePlay}>
                                {isPlaying ? <Pause size={32}/> : <Play size={32}/>}
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => handleSeek(5)}>
                                <FastForward />
                            </Button>
                        </div>
                        <span className="text-xs font-mono">{duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDocument, setPreviewDocument] = useState<CourseDocument | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const modules = useMemo(() => 
    ['all', ...Array.from(new Set(courseDocuments.map((doc) => doc.module)))]
  , []);

  const documentTypes = useMemo(() => 
    ['all', ...Array.from(new Set(courseDocuments.map((doc) => doc.type)))]
  , []);

  const filteredDocuments = useMemo(() => {
    return courseDocuments
      .filter((doc) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((doc) => moduleFilter === 'all' || doc.module === moduleFilter)
      .filter((doc) => typeFilter === 'all' || doc.type === typeFilter);
  }, [searchTerm, moduleFilter, typeFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreview = (doc: CourseDocument) => {
    setPreviewDocument(doc);
    setIsPreviewLoading(true);
    // Simulate loading
    setTimeout(() => setIsPreviewLoading(false), 1000);
  };
  
  const handleClosePreview = () => {
    setPreviewDocument(null);
    if(isFullScreen) {
        setIsFullScreen(false);
    }
  }

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <Button
                key={i}
                variant={currentPage === i ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(i)}
                className="h-8 w-8"
            >
                {i}
            </Button>
        );
    }
    return pages;
  };
  
  const renderPreviewContent = (doc: CourseDocument) => {
    switch (doc.type) {
      case 'pdf':
      case 'docx':
        return <iframe src={doc.fileUrl} className="w-full h-full" title={doc.documentName} />;
      case 'pptx':
        return <PowerPointPreview />;
      case 'xlsx':
        return <ExcelPreview />;
      case 'zip':
        return <ArchivePreview doc={doc} />;
      case 'mp4':
        return <VideoPreview doc={doc} />;
      default:
        return (
          <div className="text-center p-8">
            <FileIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aperçu non disponible</h3>
            <p className="text-sm text-muted-foreground">Ce type de fichier ne peut pas être prévisualisé.</p>
          </div>
        );
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tous les modules" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module === 'all' ? 'Tous les modules' : module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'Tous les types' : documentTypeConfig[type as DocumentType]?.label || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Mis en ligne par</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((doc, index) => (
                <TableRow key={doc.id} className="even:bg-muted/40">
                  <TableCell className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell className="font-medium">{doc.module}</TableCell>
                  <TableCell>{doc.documentName}</TableCell>
                  <TableCell>{doc.uploader}</TableCell>
                  <TableCell className="flex justify-center"><FileTypeIcon type={doc.type} /></TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <CardContent className="p-4 flex items-center justify-between">
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
            {renderPagination()}
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
        </CardContent>
      </Card>

      {previewDocument && (
        <Dialog open={!!previewDocument} onOpenChange={(open) => !open && handleClosePreview()}>
          <DialogContent className={cn(
                "flex flex-col p-0 transition-all duration-300",
                isFullScreen 
                    ? "w-screen h-screen max-w-full" 
                    : "sm:max-w-4xl h-[90vh]"
            )}>
            <DialogHeader className="p-4 flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileTypeIcon type={previewDocument.type} showLabel />
                {previewDocument.documentName}
              </DialogTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
                                {isFullScreen ? <Minimize className="h-5 w-5"/> : <Maximize className="h-5 w-5" />}
                                <span className="sr-only">{isFullScreen ? 'Réduire' : 'Agrandir'}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{isFullScreen ? 'Réduire' : 'Agrandir'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </DialogHeader>
            <div className="flex-1 rounded-lg bg-muted/50 flex items-center justify-center relative overflow-hidden">
                {isPreviewLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Chargement de l'aperçu...</p>
                    </div>
                ) : (
                    renderPreviewContent(previewDocument)
                )}
            </div>
            <DialogFooter className="mt-auto p-4 border-t">
                <Button variant="ghost" onClick={handleClosePreview}>Fermer</Button>
                <Button asChild>
                    <a href={previewDocument.fileUrl} download>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                    </a>
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    