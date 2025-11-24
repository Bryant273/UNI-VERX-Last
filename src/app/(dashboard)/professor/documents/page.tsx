
'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Upload,
  Eye,
  Trash2,
  Edit,
  UploadCloud,
  FileQuestion,
  BookOpen,
  Award,
  GraduationCap,
  User,
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
  documentConfig,
  type Document,
} from '@/lib/documents-data';

// Mock data specific to professor
const personalDocuments: Document[] = [
    { id: 'perso-1', type: 'cv', name: 'CV_Claire_Dubois_2025.pdf', description: 'CV académique et de recherche à jour.', status: 'uploaded', category: 'personal', date: '10/05/2025' },
    { id: 'perso-2', type: 'lettre-motivation', name: 'Projet_ANR_2025.docx', description: 'Proposition de projet pour l\'appel ANR 2025.', status: 'uploaded', category: 'personal', date: '08/05/2025' },
    { id: 'perso-3', type: 'autre-perso', name: 'Article_ML_Education_2024.pdf', description: 'Version finale de l\'article "Machine Learning in Education".', status: 'uploaded', category: 'personal', date: '28/02/2025' },
    
];

const diplomaDocuments: Document[] = [
    { id: 'diplo-1', type: 'diplome', name: 'Doctorat_Informatique_2012.pdf', description: 'Diplôme de Doctorat en Informatique, Université Paris-Sud.', status: 'uploaded', category: 'academic', date: '15/07/2012' },
    { id: 'diplo-2', type: 'certificat', name: 'AWS_Certified_Architect.pdf', description: 'Certification AWS Certified Solutions Architect - Associate.', status: 'uploaded', category: 'professional', date: '18/11/2023' },
    { id: 'diplo-3', type: 'attestation', name: 'Attestation_Habilitation_HDR.pdf', description: 'Attestation d\'Habilitation à Diriger des Recherches.', status: 'missing', category: 'academic' },
];

const universityDocuments: Document[] = [
    { id: 'uni-1', type: 'contrat-stage', name: 'Contrat_Enseignant_2024.pdf', description: 'Contrat d\'enseignement pour l\'année académique 2024-2025.', status: 'uploaded', category: 'administrative', date: '01/09/2024' },
    { id: 'uni-2', type: 'facture', name: 'Fiche_Paie_Fevrier_2025.pdf', description: 'Bulletin de salaire pour Février 2025.', status: 'uploaded', category: 'administrative', date: '28/02/2025' },
    { id: 'uni-3', type: 'certificat-scolarite', name: 'Certificat_Travail_2024.pdf', description: 'Certificat de travail officiel de l\'année précédente.', status: 'uploaded', category: 'administrative', date: '31/08/2024' },
];


const DocumentRow: React.FC<{
  doc: Document,
  index: number,
  onView: (doc: Document) => void,
  onEdit: (doc: Document) => void,
  onDelete: (doc: Document) => void,
  onUpload: (doc: Document) => void
}> = ({ doc, index, onView, onEdit, onDelete, onUpload }) => {
  const config = doc.type ? documentConfig[doc.type] : documentConfig['autre-perso'];
  const { icon: Icon, color, label } = config;

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


export default function ProfessorDocumentsPage() {
    const [docs, setDocs] = useState({
        personal: personalDocuments,
        diplomas: diplomaDocuments,
        university: universityDocuments,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('personal');

    const [modalState, setModalState] = useState<{
        type: 'upload' | 'delete' | 'view' | 'edit' | null;
        doc: Document | null;
    }>({ type: null, doc: null });

    const filteredDocs = useMemo(() => {
        const currentDocs = docs[activeTab as keyof typeof docs] || [];
        return currentDocs.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, activeTab, docs]);

    const handleAction = (doc: Document, type: 'upload' | 'delete' | 'view' | 'edit') => {
        setModalState({ type, doc });
    };

    const handleCloseModal = () => {
        setModalState({ type: null, doc: null });
    };

    // Simplified update logic for demonstration
    const handleUpdate = () => {
      // In a real app, you would handle file upload, deletion, etc.
      // and update the state accordingly.
      handleCloseModal();
    }

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
            <Button onClick={() => handleAction({} as Document, 'upload')}><Upload className="mr-2"/>Ajouter un document</Button>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal"><User className="mr-2"/>Personnels</TabsTrigger>
          <TabsTrigger value="diplomas"><Award className="mr-2"/>Diplômes</TabsTrigger>
          <TabsTrigger value="university"><GraduationCap className="mr-2"/>Université</TabsTrigger>
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
      </Tabs>

      {/* Modals for actions */}
      <Dialog open={modalState.type === 'upload' || modalState.type === 'edit'} onOpenChange={handleCloseModal}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{modalState.type === 'edit' ? 'Modifier le document' : 'Ajouter un document'}</DialogTitle>
                  <DialogDescription>Gérez les informations de votre document.</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                  <Input defaultValue={modalState.doc?.name} placeholder="Nom du document" />
                  <Input defaultValue={modalState.doc?.description} placeholder="Description du document" />
                  <div className="p-8 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez pour {modalState.type === 'edit' ? 'remplacer' : 'téléverser'}.</p>
                      <Input id="file-upload" type="file" className="hidden" />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={handleCloseModal}>Annuler</Button>
                  <Button onClick={handleUpdate}>{modalState.type === 'edit' ? 'Enregistrer' : 'Ajouter'}</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <Dialog open={modalState.type === 'delete'} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Confirmer la suppression</DialogTitle>
                  <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer "{modalState.doc?.name}"? Cette action est irréversible.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="ghost" onClick={handleCloseModal}>Annuler</Button>
                  <Button variant="destructive" onClick={handleUpdate}>Supprimer</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    
      <Dialog open={modalState.type === 'view'} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                  <DialogTitle>Aperçu : {modalState.doc?.name}</DialogTitle>
              </DialogHeader>
              <div className="py-4 my-4 bg-muted/50 rounded-lg flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-muted-foreground">
                      <FileText className="mx-auto h-16 w-16" />
                      <p className="mt-4 font-semibold">Prévisualisation non disponible</p>
                      <p className="text-sm">Le contenu serait affiché ici.</p>
                  </div>
              </div>
              <DialogFooter>
                   <Button variant="ghost" onClick={handleCloseModal}>Fermer</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}
