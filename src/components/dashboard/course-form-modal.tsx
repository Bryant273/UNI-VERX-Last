
'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { courseDocuments, type CourseDocument, type DocumentType } from '@/lib/course-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCourseModal } from '@/hooks/use-course-modal';

const modules = [
    { value: "Bases de Données", label: "Bases de Données" },
    { value: "Algorithmique", label: "Algorithmique" },
    { value: "Programmation", label: "Programmation" },
    { value: "Développement Web", label: "Développement Web" },
    { value: "Réseaux Informatiques", label: "Réseaux Informatiques" },
    { value: "Mathématiques", label: "Mathématiques" },
    { value: "Systèmes d'exploitation", label: "Systèmes d'exploitation" },
];


export default function CourseFormModal() {
    const { isOpen, onClose, initialData } = useCourseModal();
    const [courses, setCourses] = useState<CourseDocument[]>(courseDocuments);

    const handleSave = (formData: Omit<CourseDocument, 'id' | 'date'> & { id?: number }) => {
        if(initialData && formData.id) {
            setCourses(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData, date: new Date().toLocaleDateString('fr-FR') } : c));
        } else {
            const newCourse: CourseDocument = {
                ...formData,
                id: Math.max(...courses.map(c => c.id)) + 1,
                date: new Date().toLocaleDateString('fr-FR'),
            };
            setCourses(prev => [newCourse, ...prev]);
        }
        onClose();
    }

    if (!isOpen) return null;

    return (
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
                         documentName: formData.get('title') as string,
                         description: formData.get('description') as string,
                         type: 'pdf' as DocumentType,
                         uploader: 'Dr. Claire Dubois',
                         level: formData.get('level') as string,
                         class: formData.get('class') as string,
                         fileUrl: ''
                     }
                     handleSave(data);
                 }}>
                     <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                                <Label htmlFor="level">Niveau</Label>
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
                                <Label htmlFor="class">Filière</Label>
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
                             <Label htmlFor="module">Module</Label>
                             <Select name="module" defaultValue={initialData?.module}>
                                <SelectTrigger id="module"><SelectValue placeholder="Sélectionnez un module" /></SelectTrigger>
                                <SelectContent>
                                    {modules.map(mod => <SelectItem key={mod.value} value={mod.value}>{mod.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2">
                             <Label htmlFor="title">Titre du document</Label>
                             <Input id="title" name="title" defaultValue={initialData?.documentName || ''} required />
                         </div>
                         <div className="space-y-2">
                             <Label htmlFor="description">Description</Label>
                             <Textarea id="description" name="description" defaultValue={initialData?.description || ''} />
                         </div>
                          <div className="space-y-2">
                             <Label>Fichier</Label>
                              <div className="p-8 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez pour parcourir</p>
                            </div>
                         </div>
                     </div>
                     <DialogFooter>
                         <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
                         <Button type="submit">Enregistrer</Button>
                     </DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    )
}
