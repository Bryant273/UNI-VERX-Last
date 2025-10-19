
'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  UploadCloud,
  X,
  Plus,
  Trash2,
  Edit,
  Info
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCourseModal } from '@/hooks/use-course-modal';

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

const modules = [
    { value: "Bases de Données", label: "Bases de Données" },
    { value: "Algorithmique", label: "Algorithmique" },
    { value: "Programmation", label: "Programmation" },
    { value: "Développement Web", label: "Développement Web" },
    { value: "Réseaux Informatiques", label: "Réseaux Informatiques" },
    { value: "Mathématiques", label: "Mathématiques" },
    { value: "Systèmes d'exploitation", label: "Systèmes d'exploitation" },
];

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

export default function ProfessorCoursesPage() {
  const [courses, setCourses] = useState<CourseDocument[]>(courseDocuments);
  const [levelFilter, setLevelFilter] = useState('L3');
  const [classFilter, setClassFilter] = useState('INFO');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalDoc, setViewModalDoc] = useState<CourseDocument | null>(null);
  const [deleteModalDoc, setDeleteModalDoc] = useState<CourseDocument | null>(null);
  const { onOpen } = useCourseModal();
  
  const filteredDocuments = useMemo(() => {
    return courses
      .filter((doc) => levelFilter === 'all' || doc.level === levelFilter)
      .filter((doc) => classFilter === 'all' || doc.class === classFilter);
  }, [courses, levelFilter, classFilter]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handleDelete = (docId: number) => {
    setCourses(prev => prev.filter(c => c.id !== docId));
    setDeleteModalDoc(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des cours</CardTitle>
          <CardDescription>Ajoutez, modifiez et consultez les documents de cours pour vos classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <Label htmlFor="selectLevel">Niveau</Label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger id="selectLevel" className="w-full sm:w-[180px]">
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
                <Label htmlFor="selectClass">Filière</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger id="selectClass" className="w-full sm:w-[180px]">
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
            <Button onClick={() => onOpen()}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
            </Button>
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
                <TableHead>#</TableHead>
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
      
      {/* View Modal */}
      {viewModalDoc && (
        <Dialog open={!!viewModalDoc} onOpenChange={() => setViewModalDoc(null)}>
            <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                     <DialogTitle className="flex items-center gap-3">
                        <FileTypeIcon type={viewModalDoc.type} showLabel />
                        <span>{viewModalDoc.documentName}</span>
                    </DialogTitle>
                     <DialogDescription>{viewModalDoc.module}</DialogDescription>
                 </DialogHeader>
                 <div className="py-4 space-y-2 text-sm">
                    <p><strong className="text-muted-foreground">Date :</strong> {viewModalDoc.date}</p>
                    <p><strong className="text-muted-foreground">Description :</strong> {viewModalDoc.description || 'N/A'}</p>
                 </div>
                 <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <FileText className="mx-auto h-16 w-16" />
                        <p className="mt-4 font-semibold">Prévisualisation non disponible</p>
                        <p className="text-sm">Le contenu du fichier serait affiché ici.</p>
                    </div>
                </div>
                 <DialogFooter>
                     <Button variant="ghost" onClick={() => setViewModalDoc(null)}>Fermer</Button>
                     <Button><Download className="mr-2 h-4 w-4" /> Télécharger</Button>
                 </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

      {/* Delete Modal */}
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

    </div>
  );
}
