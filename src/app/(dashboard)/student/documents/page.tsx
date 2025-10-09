
'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Award,
  Download,
  Search,
  Upload,
  User,
  Home,
  Building,
  Briefcase,
  GraduationCap,
  Eye,
  Trash2,
  Edit,
  UploadCloud,
  X,
  FileQuestion,
  BookOpen,
  FileCheck2,
  FileArchive,
  ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  personalDocuments as initialPersonal,
  diplomaDocuments as initialDiplomas,
  universityDocuments,
  enterpriseDocuments,
  documentConfig,
  type Document,
  type DocumentType
} from '@/lib/documents-data';

const DocumentRow: React.FC<{
  doc: Document,
  index: number,
  onView: (doc: Document) => void,
  onEdit: (doc: Document) => void,
  onDelete: (doc: Document) => void,
  onUpload: (doc: Document) => void
}> = ({ doc, index, onView, onEdit, onDelete, onUpload }) => {
  const { icon: Icon, color, label } = documentConfig[doc.type];

  return (
    <TableRow>
      <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`border-0 ${color}`}>
          <Icon className="h-3.5 w-3.5 mr-2" />
          {label}
        </Badge>
      </TableCell>
      <TableCell className="font-semibold">{doc.name}</TableCell>
      <TableCell className="text-muted-foreground">{doc.description}</TableCell>
      <TableCell className="text-right">
        {doc.status === 'uploaded' ? (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => onView(doc)}><Eye className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(doc)}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(doc)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onUpload(doc)}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Téléverser
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const DownloadableDocumentRow: React.FC<{ doc: Document; index: number, onView: (doc: Document) => void }> = ({ doc, index, onView }) => {
    const { icon: Icon, color, label } = documentConfig[doc.type];
  
    return (
      <TableRow>
        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
        <TableCell>
          <Badge variant="outline" className={`border-0 ${color}`}>
            <Icon className="h-3.5 w-3.5 mr-2" />
            {label}
          </Badge>
        </TableCell>
        <TableCell className="font-semibold">{doc.name}</TableCell>
        <TableCell className="text-muted-foreground">{doc.description}</TableCell>
        <TableCell className="text-right space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onView(doc)}><Eye className="h-4 w-4" /></Button>
            <Button size="sm" asChild>
                <a href="#" download>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
                </a>
            </Button>
        </TableCell>
      </TableRow>
    );
};


export default function DocumentsPage() {
    const [personalDocs, setPersonalDocs] = useState(initialPersonal);
    const [diplomaDocs, setDiplomaDocs] = useState(initialDiplomas);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const [modalState, setModalState] = useState<{
        type: 'upload' | 'delete' | 'view' | 'edit' | null;
        doc: Document | null;
    }>({ type: null, doc: null });

    const allDocuments = useMemo(() => ({
        personal: personalDocs,
        diplomas: diplomaDocs,
        university: universityDocuments,
        enterprise: enterpriseDocuments,
    }), [personalDocs, diplomaDocs]);

    const filteredDocs = useMemo(() => {
        const docs = allDocuments[activeTab as keyof typeof allDocuments] || [];
        return docs.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, activeTab, allDocuments]);

    const handleAction = (doc: Document, type: 'upload' | 'delete' | 'view' | 'edit') => {
        setModalState({ type, doc });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, doc: null });
    };

    const handleDelete = () => {
        if (!modalState.doc) return;
        const { id, category } = modalState.doc;
        
        const updateDocs = (setter: React.Dispatch<React.SetStateAction<Document[]>>) => {
            setter(prevDocs => prevDocs.map(d => d.id === id ? { ...d, status: 'missing' } : d));
        };

        if (category === 'personal') updateDocs(setPersonalDocs);
        if (category === 'academic' && personalDocs.find(d => d.id === id)) updateDocs(setPersonalDocs);
        if (category === 'academic' && diplomaDocs.find(d => d.id === id)) updateDocs(setDiplomaDocs);
        if (category === 'professional' && diplomaDocs.find(d => d.id === id)) updateDocs(setDiplomaDocs);
        
        handleCloseModal();
    };
    
    const handleUpload = (newDocData: Partial<Document>) => {
         const docToUpdate = modalState.doc || newDocData;
         if (!docToUpdate || !docToUpdate.id) return;
         
         const updateDoc = (d: Document) => ({
             ...d,
             status: 'uploaded' as 'uploaded',
             name: newDocData.name || d.name,
             description: newDocData.description || d.description,
             date: new Date().toLocaleDateString('fr-FR')
         });

         const updateDocs = (setter: React.Dispatch<React.SetStateAction<Document[]>>) => {
            setter(prevDocs => prevDocs.map(d => d.id === docToUpdate.id ? updateDoc(d) : d));
         };
         
         if (docToUpdate.category === 'personal') updateDocs(setPersonalDocs);
         if (docToUpdate.category === 'academic' && initialPersonal.find(d => d.id === docToUpdate.id)) updateDocs(setPersonalDocs);
         if (docToUpdate.category === 'academic' && initialDiplomas.find(d => d.id === docToUpdate.id)) updateDocs(setDiplomaDocs);
         if (docToUpdate.category === 'professional' && initialDiplomas.find(d => d.id === docToUpdate.id)) updateDocs(setDiplomaDocs);
        
         handleCloseModal();
    }
    
    const handleEdit = (editedDoc: Document) => {
        const { id, name, description, category } = editedDoc;

        const updateDocs = (setter: React.Dispatch<React.SetStateAction<Document[]>>) => {
            setter(prevDocs => prevDocs.map(d => d.id === id ? { ...d, name, description } : d));
        };
        
        if (category === 'personal') updateDocs(setPersonalDocs);
        if (category === 'academic' && diplomaDocs.find(d => d.id === id)) updateDocs(setDiplomaDocs);
        if (category === 'professional' && diplomaDocs.find(d => d.id === id)) updateDocs(setDiplomaDocs);
        
        handleCloseModal();
    };

    const totalDocs = personalDocs.length + diplomaDocs.length + universityDocuments.length + enterpriseDocuments.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Mes Documents</CardTitle>
            <CardDescription>Gérez tous vos documents importants en un seul endroit.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher un document..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal"><User className="mr-2"/>Personnels</TabsTrigger>
          <TabsTrigger value="diplomas"><Award className="mr-2"/>Diplômes</TabsTrigger>
          <TabsTrigger value="university"><GraduationCap className="mr-2"/>Université</TabsTrigger>
          <TabsTrigger value="enterprise"><Building className="mr-2"/>Entreprise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-40">Type</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-40">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc, i) => <DocumentRow key={doc.id} doc={doc} index={i} onUpload={(d) => handleAction(d, 'upload')} onView={(d) => handleAction(d, 'view')} onEdit={(d) => handleAction(d, 'edit')} onDelete={(d) => handleAction(d, 'delete')} />)}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="diplomas">
             <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-40">Type</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-40">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc, i) => <DocumentRow key={doc.id} doc={doc} index={i} onUpload={(d) => handleAction(d, 'upload')} onView={(d) => handleAction(d, 'view')} onEdit={(d) => handleAction(d, 'edit')} onDelete={(d) => handleAction(d, 'delete')} />)}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="university">
             <Card>
                <CardContent className="p-0">
                    <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-40">Type</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-56">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc, i) => (
                                <DownloadableDocumentRow key={doc.id} doc={doc} index={i} onView={(d) => handleAction(d, 'view')} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="enterprise">
             <Card>
                <CardContent className="p-0">
                    <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-40">Type</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-56">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc, i) => (
                                <DownloadableDocumentRow key={doc.id} doc={doc} index={i} onView={(d) => handleAction(d, 'view')} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

        {/* Upload Modal */}
        <Dialog open={modalState.type === 'upload'} onOpenChange={handleCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modalState.doc?.name ? `Remplacer ${modalState.doc.name}` : 'Ajouter un document'}</DialogTitle>
                    <DialogDescription>Téléversez votre fichier pour le stocker de manière sécurisée.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-8 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez votre fichier ici ou cliquez pour parcourir.</p>
                        <Input id="file-upload" type="file" className="hidden" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleCloseModal}>Annuler</Button>
                    <Button onClick={() => handleUpload({})}><Upload className="mr-2" /> Envoyer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={modalState.type === 'delete'} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                 <DialogHeader className="items-center text-center">
                    <div className="p-3 bg-destructive/10 rounded-full w-fit">
                        <AlertTriangle className="h-8 w-8 text-destructive"/>
                    </div>
                    <DialogTitle className="text-xl">Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{modalState.doc?.name}</span> ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row justify-center sm:justify-center pt-4">
                    <Button variant="outline" onClick={handleCloseModal}>Annuler</Button>
                    <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2" /> Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      
        {/* View Modal */}
        <Dialog open={modalState.type === 'view'} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-xl">
                 <DialogHeader>
                    <DialogTitle>Aperçu : {modalState.doc?.name}</DialogTitle>
                    <DialogDescription>{modalState.doc?.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <FileText className="mx-auto h-16 w-16" />
                        <p className="mt-4 font-semibold">Prévisualisation non disponible</p>
                        <p className="text-sm">Le contenu du fichier serait affiché ici.</p>
                    </div>
                </div>
                <DialogFooter>
                     <Button variant="ghost" onClick={handleCloseModal}>Fermer</Button>
                     <Button asChild>
                        <a href="#" download={modalState.doc?.name}>
                            <Download className="mr-2" />
                            Télécharger
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={modalState.type === 'edit'} onOpenChange={handleCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier : {modalState.doc?.name}</DialogTitle>
                </DialogHeader>
                 <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const updatedDoc = {
                         ...modalState.doc!,
                         name: formData.get('docName') as string,
                         description: formData.get('docDescription') as string,
                     };
                     handleEdit(updatedDoc);
                 }}>
                    <div className="py-4 space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="docName">Nom du document</label>
                                <Input id="docName" name="docName" defaultValue={modalState.doc?.name} />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="docDescription">Description</label>
                                <Input id="docDescription" name="docDescription" defaultValue={modalState.doc?.description} />
                            </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" type="button" onClick={handleCloseModal}>Annuler</Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    </div>
  );
}
