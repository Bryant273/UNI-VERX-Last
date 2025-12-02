
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
  personalDocuments as initialPersonal,
  diplomaDocuments as initialDiploma,
  universityDocuments as initialUniversity,
  type Document,
  type DocumentType
} from '@/lib/documents-data';

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

        if (docToDelete.type === 'certificat' && docToDelete.id.startsWith('new-')) {
             setDocuments(docs => docs.filter(d => d.id !== docToDelete.id));
        } else {
            setDocuments(docs => docs.map(d => 
                d.id === docToDelete.id ? { ...d, status: 'missing', name: documentConfig[d.type].label, date: undefined } : d
            ));
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            {title === "Documents Universitaires" 
                                ? "Documents officiels fournis par l'université."
                                : `Vos ${title.toLowerCase()}. Maintenez-les à jour.`
                            }
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

    let previewContent;
    switch (doc.type) {
        case 'cv':
        case 'lettre-motivation':
        case 'diplome':
        case 'certificat':
        case 'attestation':
        case 'releve-notes':
        case 'certificat-scolarite':
        case 'convention-stage':
        case 'facture':
            previewContent = (
                <div className="text-center text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    <div className="w-full bg-background p-6 rounded-md shadow-sm h-[350px] flex flex-col">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                        <div className="flex-grow overflow-hidden relative">
                            <p className="text-xs text-left text-muted-foreground/50 blur-[2px] select-none">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in...
                            </p>
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                        </div>
                    </div>
                </div>
            );
            break;
        case 'cni':
        case 'photo-identite':
            previewContent = <img src={'https://placehold.co/600x400/e2e8f0/e2e8f0'} alt="Aperçu" className="rounded-lg w-full" />;
            break;
        default:
            previewContent = (
                <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <DocumentIcon type={doc.type} />
                        <p className="mt-4 font-semibold">Prévisualisation non disponible</p>
                        <p className="text-sm">Le contenu du fichier serait affiché ici.</p>
                    </div>
                </div>
            );
    }
    
    return (
        <Dialog open={!!doc} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{doc.name}</DialogTitle>
                    <DialogDescription>{doc.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center">
                    {previewContent}
                </div>
                <DialogFooter>
                     <Button variant="ghost" onClick={onClose}>Fermer</Button>
                     <Button><Download className="mr-2 h-4 w-4" />Télécharger</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function StudentDocumentsPage() {
    const [personalDocs, setPersonalDocs] = useState(initialPersonal);
    const [diplomaDocs, setDiplomaDocs] = useState(initialDiploma);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDoc, setViewDoc] = useState<Document | null>(null);
    const [modalData, setModalData] = useState<Document | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDocType, setSelectedDocType] = useState<DocumentType | ''>('');
    const { toast } = useToast();

    const handleOpenModal = (doc: Document | null = null, category: Document['category'] = 'personal') => {
        const initialDocData = doc || { category };
        setModalData(initialDocData as Document);
        setSelectedFile(null);
        setSelectedDocType(doc ? doc.type : '');
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
            name: docType === 'certificat' && customName ? customName : (selectedFile?.name || modalData?.name || 'Nouveau document'),
            description: documentConfig[docType].label,
            status: 'uploaded' as 'uploaded',
            category: category,
        };
        
        if (category === 'personal') {
            if(isEditing && personalDocs.some(d => d.id === modalData.id)) {
                setPersonalDocs(docs => docs.map(d => d.id === modalData.id ? newDocData : d));
            } else {
                setPersonalDocs(docs => [newDocData, ...docs]);
            }
        } else if (category === 'academic') {
             if(isEditing && diplomaDocs.some(d => d.id === modalData.id)) {
                setDiplomaDocs(docs => docs.map(d => d.id === modalData.id ? newDocData : d));
            } else {
                setDiplomaDocs(docs => [newDocData, ...docs]);
            }
        }
        
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
                    <CardTitle>Mes Documents</CardTitle>
                    <CardDescription>Gérez vos documents personnels, académiques et téléchargez les fichiers fournis par l'université.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal"><User className="mr-2"/>Personnels</TabsTrigger>
                    <TabsTrigger value="diplomas"><GraduationCap className="mr-2"/>Diplômes &amp; Certificats</TabsTrigger>
                    <TabsTrigger value="university"><University className="mr-2"/>Documents Universitaires</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="mt-4">
                    <DocumentTable 
                        documents={personalDocs} 
                        setDocuments={setPersonalDocs} 
                        onOpenModal={handleOpenModal}
                        onView={setViewDoc}
                        title="Documents Personnels"
                        canAdd
                    />
                </TabsContent>
                <TabsContent value="diplomas" className="mt-4">
                     <DocumentTable 
                        documents={diplomaDocs} 
                        setDocuments={setDiplomaDocs} 
                        onOpenModal={handleOpenModal}
                        onView={setViewDoc}
                        title="Diplômes & Certificats"
                        canAdd
                    />
                </TabsContent>
                <TabsContent value="university" className="mt-4">
                     <DocumentTable 
                        documents={initialUniversity}
                        onOpenModal={()=>{}}
                        onView={setViewDoc}
                        title="Documents Universitaires"
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
                             <Select name="doc-type" required defaultValue={modalData?.type || ''} onValueChange={(v) => setSelectedDocType(v as DocumentType)} disabled={!!modalData?.id && modalData.type !== 'autre-perso' && modalData.type !== 'certificat'}>
                                <SelectTrigger id="doc-type"><SelectValue placeholder="Sélectionnez un type..."/></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(documentConfig)
                                        .filter(([key, config]) => config.category === modalData?.category && config.category !== 'administrative')
                                        .map(([key, {label}]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         {(selectedDocType === 'certificat') && (
                             <div className="space-y-2">
                                <Label htmlFor="doc-name">Titre du certificat</Label>
                                <Input id="doc-name" name="doc-name" placeholder="Ex: Certification Voltaire" defaultValue={modalData?.type === 'certificat' ? modalData.name : ''} required />
                            </div>
                         )}
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
