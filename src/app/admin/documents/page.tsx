
'use client';

import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  UploadCloud,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  File as FileIcon,
  X,
  FileCheck2,
  AlertCircle,
  User,
  GraduationCap,
  University,
  FileText,
  FileSpreadsheet,
  Presentation,
  Briefcase,
  Book,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  documentConfig, 
  type Document,
  type DocumentType
} from '@/lib/documents-data';

const professorDocuments: Document[] = [
    { id: 'prof-perso-1', type: 'cv', name: 'CV_Dubois_Claire_2025.pdf', description: 'Curriculum Vitae à jour', status: 'uploaded', category: 'personal', date: '15/01/2025' },
    { id: 'prof-perso-2', type: 'cni', name: 'ID_Card.pdf', description: 'Carte Nationale d\'Identité', status: 'uploaded', category: 'personal', date: '01/09/2023' },
    { id: 'prof-admin-1', type: 'contrat-stage', name: 'Contrat_de_travail.pdf', description: 'Contrat de travail principal', status: 'uploaded', category: 'administrative', date: '01/09/2012' },
    { id: 'prof-admin-2', type: 'attestation', name: 'Arrete_Nomination_HDR.pdf', description: 'Habilitation à Diriger des Recherches', status: 'uploaded', category: 'administrative', date: '20/06/2020' },
    { id: 'prof-admin-3', type: 'attestation', name: 'Attestation_Employeur.pdf', description: 'Attestation pour l\'année en cours', status: 'missing', category: 'administrative'},
    { id: 'prof-pub-1', type: 'releve-notes', name: 'Publication_ACL_2024.pdf', description: 'Article "Advanced SQL query optimization"', status: 'uploaded', category: 'professional', date: '12/12/2024' },
];

const DocumentIcon: React.FC<{ type: DocumentType }> = ({ type }) => {
  const config = documentConfig[type];
  if (!config) return <FileIcon className="h-5 w-5 text-gray-400" />;
  const { icon: Icon, color } = config;
  return <Icon className={cn("h-5 w-5", color.split(' ')[0])} />;
};

const DocumentTable = ({ 
    documents, 
    setDocuments, 
    onOpenModal, 
    title,
    canAdd = false,
    onView
}: { 
    documents: Document[], 
    setDocuments?: React.Dispatch<React.SetStateAction<Document[]>>, 
    onOpenModal: (doc?: Document | null, category?: Document['category']) => void,
    title: string,
    canAdd?: boolean,
    onView: (doc: Document) => void
}) => {
    
    const handleDelete = (docToDelete: Document) => {
        if (!setDocuments) return;
        setDocuments(docs => docs.filter(d => d.id !== docToDelete.id));
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            Maintenez vos documents à jour.
                        </CardDescription>
                    </div>
                    {canAdd && <Button onClick={() => onOpenModal(null, documents[0]?.category || 'personal')}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>}
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", documentConfig[doc.type]?.color.split(' ')[1])}>
                                            <DocumentIcon type={doc.type} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{doc.name}</p>
                                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={doc.status === 'uploaded' ? 'default' : 'destructive'} className={cn(doc.status === 'uploaded' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300')}>
                                        {doc.status === 'uploaded' ? <FileCheck2 className="mr-1.5 h-3 w-3" /> : <AlertCircle className="mr-1.5 h-3 w-3" />}
                                        {doc.status === 'uploaded' ? 'Téléversé' : 'Manquant'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {doc.status === 'missing' ? (
                                        <Button variant="outline" size="sm" onClick={() => onOpenModal(doc)}>
                                            <Plus className="mr-2 h-4 w-4"/> Ajouter
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="ghost" size="icon" onClick={() => onView(doc)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => onOpenModal(doc)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc)}><Trash2 className="h-4 w-4" /></Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const DocumentViewerModal = ({ doc, onClose }: { doc: Document | null; onClose: () => void; }) => {
    if (!doc) return null;
    return (
        <Dialog open={!!doc} onOpenChange={onClose}>
            <DialogContent>
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


export default function AdminDocumentsPage() {
    const [docs, setDocs] = useState(professorDocuments);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDoc, setViewDoc] = useState<Document | null>(null);
    const [modalData, setModalData] = useState<Document | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const handleOpenModal = (doc: Document | null = null, category: Document['category'] = 'personal') => {
        const initialDocData = doc || { category };
        setModalData(initialDocData as Document);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const docType = (formData.get('doc-type') as DocumentType) || modalData?.type;
        const customName = formData.get('doc-name') as string;

        if (!docType || (!selectedFile && modalData?.status !== 'uploaded')) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un type et un fichier.',
                variant: 'destructive'
            });
            return;
        }
        
        const category = documentConfig[docType].category;
        const isEditing = modalData && modalData.id;

        const newDocData: Document = {
            id: isEditing ? modalData.id : `new-${Date.now()}`,
            type: docType,
            name: docType === 'autre-perso' && customName ? customName : (selectedFile?.name || modalData?.name || 'Nouveau document'),
            description: documentConfig[docType].label,
            status: 'uploaded' as 'uploaded',
            category: category,
        };
        
        setDocs(prev => {
            const existing = prev.find(d => d.id === newDocData.id);
            if(existing) {
                return prev.map(d => d.id === newDocData.id ? newDocData : d);
            }
            return [newDocData, ...prev];
        });
        
        toast({
            title: isEditing ? 'Document mis à jour !' : 'Document ajouté !',
            description: `"${newDocData.name}" a été sauvegardé avec succès.`,
        })

        setIsModalOpen(false);
    }
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Documents Administratifs</CardTitle>
                    <CardDescription>Gérez les documents de l'ensemble du personnel et de l'université.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="administrative" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="administrative"><Briefcase className="mr-2"/>Administratif</TabsTrigger>
                    <TabsTrigger value="professional"><Book className="mr-2"/>Recherche & Publications</TabsTrigger>
                    <TabsTrigger value="personal"><User className="mr-2"/>Personnel</TabsTrigger>
                </TabsList>
                <TabsContent value="administrative" className="mt-4">
                    <DocumentTable 
                        documents={docs.filter(d => d.category === 'administrative')} 
                        setDocuments={setDocs} 
                        onOpenModal={handleOpenModal}
                        onView={setViewDoc}
                        title="Documents Administratifs"
                        canAdd
                    />
                </TabsContent>
                <TabsContent value="professional" className="mt-4">
                     <DocumentTable 
                        documents={docs.filter(d => d.category === 'professional')} 
                        setDocuments={setDocs} 
                        onOpenModal={handleOpenModal}
                        onView={setViewDoc}
                        title="Recherche & Publications"
                        canAdd
                    />
                </TabsContent>
                 <TabsContent value="personal" className="mt-4">
                     <DocumentTable 
                        documents={docs.filter(d => d.category === 'personal')} 
                        setDocuments={setDocs} 
                        onOpenModal={handleOpenModal}
                        onView={setViewDoc}
                        title="Documents Personnels"
                        canAdd
                    />
                </TabsContent>
            </Tabs>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{modalData?.status === 'uploaded' ? 'Modifier' : 'Ajouter'} un document</DialogTitle>
                        <DialogDescription>Sélectionnez le type et téléversez votre fichier.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveDocument} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="doc-type">Type de document</Label>
                             <Select name="doc-type" required defaultValue={modalData?.type || ''} disabled={!!modalData?.id && modalData.type !== 'autre-perso'}>
                                <SelectTrigger id="doc-type"><SelectValue placeholder="Sélectionnez un type..."/></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(documentConfig)
                                        .filter(([key, config]) => config.category === modalData?.category)
                                        .map(([key, {label}]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="doc-file">Fichier</Label>
                            {selectedFile || (modalData?.status === 'uploaded' && modalData.name) ? (
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedFile?.name || modalData?.name}</p>
                                            {selectedFile && <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => { setSelectedFile(null); if (modalData) setModalData({...modalData, name: 'Fichier à remplacer', status: 'missing' }); }}><X className="h-4 w-4" /></Button>
                                </div>
                            ) : (
                                <div 
                                    className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                                    onClick={() => document.getElementById('doc-file-upload')?.click()}
                                >
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez le fichier</p>
                                    <Input id="doc-file-upload" name="doc-file" type="file" className="hidden" onChange={handleFileChange} required={modalData?.status !== 'uploaded'} />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <DocumentViewerModal doc={viewDoc} onClose={() => setViewDoc(null)} />
        </div>
    );
}
