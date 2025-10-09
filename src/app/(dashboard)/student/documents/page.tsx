
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
  personalDocuments,
  diplomaDocuments,
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

const DownloadableDocumentRow: React.FC<{ doc: Document; index: number }> = ({ doc, index }) => {
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
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const allDocuments = useMemo(() => ({
        personal: personalDocuments,
        diplomas: diplomaDocuments,
        downloads: [...universityDocuments, ...enterpriseDocuments],
    }), []);

    const filteredDocs = useMemo(() => {
        const docs = allDocuments[activeTab as keyof typeof allDocuments] || [];
        return docs.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, activeTab, allDocuments]);
    
    const handleAction = (doc: Document, action: 'view' | 'edit' | 'delete' | 'upload') => {
        setSelectedDoc(doc);
        if (action === 'upload') setUploadModalOpen(true);
        if (action === 'delete') setDeleteModalOpen(true);
        // Add logic for view and edit modals if needed
    };

    const totalDocs = personalDocuments.length + diplomaDocuments.length + universityDocuments.length + enterpriseDocuments.length;

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
            <Button onClick={() => handleAction({} as Document, 'upload')}><UploadCloud className="mr-2"/> Ajouter un document</Button>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal"><User className="mr-2"/>Personnels</TabsTrigger>
          <TabsTrigger value="diplomas"><Award className="mr-2"/>Diplômes</TabsTrigger>
          <TabsTrigger value="downloads"><Download className="mr-2"/>À télécharger</TabsTrigger>
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
        <TabsContent value="downloads">
             <Card>
                <CardContent className="p-0">
                    <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">#</TableHead>
                                <TableHead className="w-40">Type</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right w-40">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc, i) => (
                                <DownloadableDocumentRow key={doc.id} doc={doc} index={i} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedDoc?.name ? `Remplacer ${selectedDoc.name}` : 'Ajouter un document'}</DialogTitle>
                    <DialogDescription>Téléversez votre fichier pour le stocker de manière sécurisée.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-8 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez votre fichier ici ou cliquez pour parcourir.</p>
                        <Input id="file-upload" type="file" className="hidden" />
                    </div>
                     <Input placeholder="Nom du document (optionnel)" defaultValue={selectedDoc?.name}/>
                     <Input placeholder="Description (optionnel)" defaultValue={selectedDoc?.description}/>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setUploadModalOpen(false)}>Annuler</Button>
                    <Button onClick={() => setUploadModalOpen(false)}><Upload className="mr-2" /> Envoyer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent className="sm:max-w-md">
                 <DialogHeader className="items-center text-center">
                    <div className="p-3 bg-destructive/10 rounded-full w-fit">
                        <AlertTriangle className="h-8 w-8 text-destructive"/>
                    </div>
                    <DialogTitle className="text-xl">Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{selectedDoc?.name}</span> ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row justify-center sm:justify-center pt-4">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Annuler</Button>
                    <Button variant="destructive" onClick={() => setDeleteModalOpen(false)}><Trash2 className="mr-2" /> Supprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}
