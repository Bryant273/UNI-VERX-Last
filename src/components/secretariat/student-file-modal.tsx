'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, GraduationCap, CheckCircle, Clock, XCircle, FileText, AlertCircle, Eye, Download, Check, X, User, Briefcase, Book } from 'lucide-react';
import { getInitials } from '@/lib/messages-data';
import { studentsData, type Student } from '@/lib/students-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  documentConfig, 
  personalDocuments as allPersonal,
  diplomaDocuments as allDiploma,
  universityDocuments as allUni,
  type Document,
  type DocumentType
} from '@/lib/documents-data';

interface StudentFileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewerModal = ({ doc, onClose }: { doc: Document | null; onClose: () => void; }) => {
    if (!doc) return null;
    return (
        <Dialog open={!!doc} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{doc.name}</DialogTitle>
                    <DialogDescription>{doc.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[350px]">
                    <div className="text-center text-muted-foreground">
                        <FileText className="mx-auto h-16 w-16" />
                        <p className="mt-4 font-semibold">Prévisualisation du document</p>
                        <p className="text-sm">Le contenu de "{doc.name}" serait affiché ici.</p>
                    </div>
                </div>
                <DialogFooter>
                     <Button variant="ghost" onClick={onClose}>Fermer</Button>
                     <Button><Download className="mr-2 h-4 w-4" />Télécharger</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DocumentTabContent = ({ 
    docs, 
    onView, 
    onValidate,
    onReject
}: { 
    docs: Document[], 
    onView: (doc: Document) => void,
    onValidate: (doc: Document) => void,
    onReject: (doc: Document) => void
}) => {
    
    const getStatusConfig = (status: 'uploaded' | 'missing' | 'pending' | 'validated') => {
        switch(status) {
            case 'uploaded': return { icon: Clock, label: 'En attente de validation', color: 'bg-yellow-100 text-yellow-800' };
            case 'validated': return { icon: CheckCircle, label: 'Validé', color: 'bg-green-100 text-green-800' };
            case 'missing': return { icon: XCircle, label: 'Manquant', color: 'bg-red-100 text-red-800' };
            default: return { icon: Clock, label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
        }
    }
    
    return (
        <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
                {docs.map(doc => {
                    const status = getStatusConfig(doc.status as any); // Adapt status
                    return (
                    <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell><Badge variant="outline" className={cn("border-0", status.color)}><status.icon className="h-3 w-3 mr-1.5" />{status.label}</Badge></TableCell>
                        <TableCell className="text-right">
                           {doc.status !== 'missing' && <Button variant="ghost" size="icon" onClick={() => onView(doc)}><Eye className="h-4 w-4"/></Button>}
                           {doc.status === 'uploaded' && (
                               <>
                                <Button variant="ghost" size="icon" onClick={() => onValidate(doc)} className="text-green-600"><Check className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" onClick={() => onReject(doc)} className="text-destructive"><X className="h-4 w-4"/></Button>
                               </>
                           )}
                        </TableCell>
                    </TableRow>
                )})}
            </TableBody>
        </Table>
    );
};


export default function StudentFileModal({ student, isOpen, onClose }: StudentFileModalProps) {
  const [personalDocs, setPersonalDocs] = useState(allPersonal);
  const [academicDocs, setAcademicDocs] = useState(allDiploma);
  const [uniDocs] = useState(allUni);

  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const { toast } = useToast();

  if (!student) return null;
  
  const handleDocAction = (doc: Document, action: 'validate' | 'reject') => {
    const listSetter = doc.category === 'personal' ? setPersonalDocs : setAcademicDocs;
    const actionText = action === 'validate' ? 'validé' : 'rejeté';
    
    listSetter(prev => prev.map(d => 
        d.id === doc.id ? { ...d, status: action === 'validate' ? 'validated' : 'missing' } as Document : d
    ));

    toast({ title: 'Action effectuée', description: `Le document "${doc.name}" a été ${actionText}.`});
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4">
                <AvatarImage src={student.photo} alt={student.name} />
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">Dossier de {student.name}</DialogTitle>
                <DialogDescription>{student.className} • {student.studentId}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="personal" className="flex-1 min-h-0 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal"><User className="mr-2"/>Personnels</TabsTrigger>
              <TabsTrigger value="academic"><GraduationCap className="mr-2"/>Académiques</TabsTrigger>
              <TabsTrigger value="university"><Briefcase className="mr-2"/>Universitaires</TabsTrigger>
              <TabsTrigger value="professional"><Book className="mr-2"/>Professionnels</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto mt-4 pr-3">
              <TabsContent value="personal">
                <DocumentTabContent docs={personalDocs} onView={setViewDoc} onValidate={(d) => handleDocAction(d, 'validate')} onReject={(d) => handleDocAction(d, 'reject')} />
              </TabsContent>
              <TabsContent value="academic">
                <DocumentTabContent docs={academicDocs} onView={setViewDoc} onValidate={(d) => handleDocAction(d, 'validate')} onReject={(d) => handleDocAction(d, 'reject')} />
              </TabsContent>
              <TabsContent value="university">
                 <DocumentTabContent docs={uniDocs} onView={setViewDoc} onValidate={(d) => handleDocAction(d, 'validate')} onReject={(d) => handleDocAction(d, 'reject')} />
              </TabsContent>
              <TabsContent value="professional">
                 <p className="text-center text-muted-foreground p-8">Aucun document professionnel pour le moment.</p>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Fermer</Button>
            <Button>Contacter l'étudiant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DocumentViewerModal doc={viewDoc} onClose={() => setViewDoc(null)} />
    </>
  );
}
