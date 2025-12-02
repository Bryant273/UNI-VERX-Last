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

const DocumentTable = ({ documents, setDocuments, onAdd, canAdd = false }: { documents: Document[], setDocuments?: React.Dispatch<React.SetStateAction<Document[]>>, onAdd?: (doc?: Document) => void, canAdd?: boolean }) => {
    
    const handleDelete = (id: string) => {
        if(setDocuments) {
            setDocuments(docs => docs.filter(d => d.id !== id));
        }
    }
    
    return (
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
                                <div className={cn("flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", documentConfig[doc.type]?.color)}>
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
                            <Button variant="ghost" size="icon" disabled={doc.status === 'missing'}><Eye className="h-4 w-4" /></Button>
                            {setDocuments && onAdd && <Button variant="ghost" size="icon" onClick={() => onAdd(doc)}><Edit className="h-4 w-4" /></Button>}
                            {setDocuments && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4" /></Button>}
                            {!setDocuments && <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function StudentDocumentsPage() {
    const [personalDocs, setPersonalDocs] = useState(initialPersonal);
    const [diplomaDocs, setDiplomaDocs] = useState(initialDiploma);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<Document | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDocType, setSelectedDocType] = useState<DocumentType | ''>('');
    const { toast } = useToast();

    const handleOpenModal = (doc: Document | null = null, defaultType: Document['category'] = 'personal') => {
        setModalData(doc);
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
        const docType = formData.get('doc-type') as DocumentType;
        const customName = formData.get('doc-name') as string;

        if (!docType || (!selectedFile && !modalData)) {
            toast({
                title: 'Erreur',
                description: 'Veuillez sélectionner un type et un fichier.',
                variant: 'destructive'
            });
            return;
        }

        const newDocData = {
            id: modalData ? modalData.id : `doc-${Date.now()}`,
            type: docType,
            name: docType === 'certificat' && customName ? customName : (selectedFile?.name || modalData?.name || 'Nouveau document'),
            description: documentConfig[docType].label,
            status: 'uploaded' as 'uploaded' | 'missing',
            date: new Date().toLocaleDateString('fr-FR')
        };
        
        const category = documentConfig[docType].category;
        
        if (category === 'personal') {
            if(modalData) {
                setPersonalDocs(docs => docs.map(d => d.id === modalData.id ? {...d, ...newDocData} : d));
            } else {
                setPersonalDocs(docs => [{...newDocData, category: 'personal'}, ...docs]);
            }
        } else if (category === 'academic') {
             if(modalData) {
                setDiplomaDocs(docs => docs.map(d => d.id === modalData.id ? {...d, ...newDocData} : d));
            } else {
                setDiplomaDocs(docs => [{...newDocData, category: 'academic'}, ...docs]);
            }
        }
        
        toast({
            title: modalData ? 'Document mis à jour !' : 'Document ajouté !',
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
                    <Card>
                        <CardHeader>
                             <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Documents Personnels</CardTitle>
                                    <CardDescription>Vos documents d'identité et personnels. Maintenez-les à jour.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenModal(null, 'personal')}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <DocumentTable documents={personalDocs} setDocuments={setPersonalDocs} onAdd={(doc) => handleOpenModal(doc)} canAdd />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="diplomas" className="mt-4">
                     <Card>
                        <CardHeader>
                             <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Diplômes &amp; Certificats</CardTitle>
                                    <CardDescription>Vos diplômes, attestations et certifications académiques ou professionnelles.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenModal(null, 'academic')}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <DocumentTable documents={diplomaDocs} setDocuments={setDiplomaDocs} onAdd={(doc) => handleOpenModal(doc)} canAdd />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="university" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Documents Universitaires</CardTitle>
                            <CardDescription>Documents officiels fournis par l'université.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <DocumentTable documents={initialUniversity} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{modalData ? 'Modifier' : 'Ajouter'} un document</DialogTitle>
                        <DialogDescription>Sélectionnez le type et téléversez votre fichier.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveDocument} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="doc-type">Type de document</Label>
                             <Select name="doc-type" required defaultValue={modalData?.type || ''} onValueChange={(v) => setSelectedDocType(v as DocumentType)}>
                                <SelectTrigger id="doc-type"><SelectValue placeholder="Sélectionnez un type..."/></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(documentConfig).filter(([key]) => key !== 'contrat-stage' && key !== 'guide-accueil' && key !== 'facture' && key !== 'releve-notes' && key !== 'certificat-scolarite' && key !== 'convention-stage' ).map(([key, {label}]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         {selectedDocType === 'certificat' && (
                             <div className="space-y-2">
                                <Label htmlFor="doc-name">Titre du certificat</Label>
                                <Input id="doc-name" name="doc-name" placeholder="Ex: Certification Voltaire" defaultValue={modalData?.type === 'certificat' ? modalData.name : ''} required />
                            </div>
                         )}
                        <div className="space-y-2">
                             <Label htmlFor="doc-file">Fichier</Label>
                            {selectedFile || modalData?.name ? (
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedFile?.name || modalData?.name}</p>
                                            {selectedFile && <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => { setSelectedFile(null); if (modalData) setModalData({...modalData, name: 'Fichier à remplacer'}); }}><X className="h-4 w-4" /></Button>
                                </div>
                            ) : (
                                <div 
                                    className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                                    onClick={() => document.getElementById('doc-file-upload')?.click()}
                                >
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez le fichier</p>
                                    <Input id="doc-file-upload" name="doc-file" type="file" className="hidden" onChange={handleFileChange} required={!modalData} />
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
        </div>
    );
}
