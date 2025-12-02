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
  AlertCircle
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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

const DocumentTable = ({ title, description, documents, setDocuments, canAdd = false, onAdd }: { title: string, description: string, documents: Document[], setDocuments?: React.Dispatch<React.SetStateAction<Document[]>>, canAdd?: boolean, onAdd?: () => void }) => {
    
    const handleDelete = (id: string) => {
        if(setDocuments) {
            setDocuments(docs => docs.filter(d => d.id !== id));
        }
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {canAdd && <Button onClick={onAdd}><Plus className="mr-2 h-4 w-4" /> Ajouter</Button>}
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
                                    {setDocuments && <Button variant="ghost" size="icon" onClick={() => onAdd && onAdd()}><Edit className="h-4 w-4" /></Button>}
                                    {setDocuments && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4" /></Button>}
                                    {!setDocuments && <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default function StudentDocumentsPage() {
    const [personalDocs, setPersonalDocs] = useState(initialPersonal);
    const [diplomaDocs, setDiplomaDocs] = useState(initialDiploma);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAddDocument = () => {
        setIsModalOpen(true);
    };

    const handleSaveDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would handle the file upload and data saving
        console.log("Document saved");
        setIsModalOpen(false);
        setSelectedFile(null);
    }
    
    return (
        <div className="space-y-8">
            <DocumentTable 
                title="Documents Personnels"
                description="Vos documents d'identité et personnels. Maintenez-les à jour."
                documents={personalDocs}
                setDocuments={setPersonalDocs}
                canAdd
                onAdd={handleAddDocument}
            />
            
            <DocumentTable 
                title="Diplômes et Certificats"
                description="Vos diplômes, attestations et certifications académiques ou professionnelles."
                documents={diplomaDocs}
                setDocuments={setDiplomaDocs}
                canAdd
                onAdd={handleAddDocument}
            />

            <DocumentTable 
                title="Documents Universitaires"
                description="Documents officiels fournis par l'université."
                documents={initialUniversity}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un document</DialogTitle>
                        <DialogDescription>Sélectionnez le type et téléversez votre fichier.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveDocument} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="doc-type">Type de document</Label>
                             <Select name="doc-type" required>
                                <SelectTrigger id="doc-type"><SelectValue placeholder="Sélectionnez un type..."/></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(documentConfig).map(([key, {label}]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="doc-name">Nom du document (optionnel)</Label>
                            <Input id="doc-name" name="doc-name" placeholder="Ex: Certificat Voltaire" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="doc-file">Fichier</Label>
                            {selectedFile ? (
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}><X className="h-4 w-4" /></Button>
                                </div>
                            ) : (
                                <div 
                                    className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                                    onClick={() => document.getElementById('doc-file-upload')?.click()}
                                >
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez le fichier</p>
                                    <Input id="doc-file-upload" name="doc-file" type="file" className="hidden" onChange={handleFileChange} required />
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