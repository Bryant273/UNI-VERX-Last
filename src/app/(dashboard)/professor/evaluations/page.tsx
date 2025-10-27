
'use client';

import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  FileText,
  Clock,
  CalendarDays,
  FileUp,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Paperclip,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Info,
  Download,
  Search,
  Plus,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const statusColors: { [key: string]: string } = {
  'Terminé': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Programmé': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'En cours': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
};


export default function ProfessorEvaluationsPage() {
    const [isQcmModalOpen, setIsQcmModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [isQcmResultsModalOpen, setIsQcmResultsModalOpen] = useState(false);
    const [isAssignmentSubmissionsModalOpen, setIsAssignmentSubmissionsModalOpen] = useState(false);
    const [isEditDeadlineModalOpen, setIsEditDeadlineModalOpen] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
    
    const openModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>, data?: any) => {
        setSelectedEvaluation(data);
        modalSetter(true);
    };
    
  return (
    <div className="space-y-6">
      <Tabs defaultValue="interrogations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interrogations">
            <ClipboardList className="mr-2" /> Interrogations QCM
          </TabsTrigger>
          <TabsTrigger value="devoirs">
            <FileText className="mr-2" /> Devoirs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interrogations" className="space-y-6 mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gérer les interrogations QCM</CardTitle>
                        <CardDescription>Créez et programmez des interrogations QCM pour vos classes.</CardDescription>
                    </div>
                     <Button onClick={() => setIsQcmModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une interrogation
                    </Button>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Interrogations programmées</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Toutes les matières" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les matières</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Toutes les classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les classes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Interrogation</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Date publication</TableHead>
                                <TableHead>Étudiants</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="font-medium">QCM SQL Avancé</div>
                                    <div className="text-xs text-muted-foreground">20 questions • 15 min</div>
                                </TableCell>
                                <TableCell>Bases de Données</TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>18/05/2025 à 09:00</TableCell>
                                <TableCell>
                                    <div className="font-medium">78 / 89</div>
                                    <div className="text-xs text-muted-foreground">88% participation</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['Terminé']}>Terminé</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openModal(setIsQcmResultsModalOpen, {title: 'QCM SQL Avancé'})}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>
                                    <div className="font-medium">QCM Algorithmes de tri</div>
                                    <div className="text-xs text-muted-foreground">20 questions • 15 min</div>
                                </TableCell>
                                <TableCell>Algorithmique</TableCell>
                                <TableCell>L1 Informatique</TableCell>
                                <TableCell>20/05/2025 à 14:00</TableCell>
                                <TableCell>
                                    <div className="font-medium">0 / 31</div>
                                    <div className="text-xs text-muted-foreground">Non démarré</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['Programmé']}>Programmé</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openModal(setIsQcmResultsModalOpen, {title: 'QCM Algorithmes de tri'})}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </div>
            </Card>
        </TabsContent>

        <TabsContent value="devoirs" className="space-y-6 mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gérer les devoirs</CardTitle>
                        <CardDescription>Programmez des devoirs avec date limite pour vos classes.</CardDescription>
                    </div>
                     <Button onClick={() => setIsAssignmentModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Programmer un devoir
                    </Button>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Devoirs programmés</CardTitle>
                </CardHeader>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                             <TableRow>
                                <TableHead>Devoir</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Date limite</TableHead>
                                <TableHead>Rendus</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             <TableRow>
                                <TableCell>
                                    <div className="font-medium">TP1 - Site responsive</div>
                                    <div className="text-xs text-muted-foreground">Développement web</div>
                                </TableCell>
                                <TableCell>Développement Web</TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>
                                    <div className="font-medium text-red-600">17/05/2025</div>
                                    <div className="text-xs text-muted-foreground">23:59:59</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">67 / 89</div>
                                    <div className="text-xs text-muted-foreground">75% rendu</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['En cours']}>En cours</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openModal(setIsAssignmentSubmissionsModalOpen, {title: 'TP1 - Site responsive'})}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => openModal(setIsEditDeadlineModalOpen, {title: 'TP1 - Site responsive', deadline: '2025-05-17T23:59'})}><Clock className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </TabsContent>
      </Tabs>

      {/* --- Modals --- */}

      {/* Création QCM */}
        <Dialog open={isQcmModalOpen} onOpenChange={setIsQcmModalOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Créer une interrogation QCM</DialogTitle>
                </DialogHeader>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="space-y-2"><Label>Titre</Label><Input placeholder="Ex: QCM SQL Avancé - Chapitre 8" /></div>
                        <div className="space-y-2"><Label>Matière</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner une matière" /></SelectTrigger><SelectContent><SelectItem value="bdd">Bases de Données</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Classe</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner une classe" /></SelectTrigger><SelectContent><SelectItem value="l3-info">L3 Informatique</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Date de publication</Label><Input type="datetime-local" /></div>
                        <div className="space-y-2"><Label>Durée (minutes)</Label><Input type="number" defaultValue="15" /></div>
                    </div>
                     <div className="space-y-2 mb-6"><Label>Description/Consignes</Label><Textarea placeholder="Instructions pour les étudiants..." /></div>
                     <div className="space-y-2 mb-6">
                        <h3 className="text-lg font-semibold">Questions (50)</h3>
                        <p className="text-sm text-muted-foreground">Créez une banque de 50 questions. Le système en sélectionnera 20 au hasard pour chaque étudiant.</p>
                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                           <p className="text-muted-foreground">La section de création de questions sera implémentée ici.</p>
                        </div>
                     </div>
                     <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsQcmModalOpen(false)}>Annuler</Button>
                        <Button type="submit">Créer l'interrogation</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        
      {/* Création Devoir */}
        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
             <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Programmer un devoir</DialogTitle>
                </DialogHeader>
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="space-y-2"><Label>Titre</Label><Input placeholder="Ex: TP1 - Création d'un site responsive" /></div>
                        <div className="space-y-2"><Label>Matière</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner une matière" /></SelectTrigger><SelectContent><SelectItem value="web">Développement Web</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Classe</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner une classe" /></SelectTrigger><SelectContent><SelectItem value="l3-info">L3 Informatique</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Date de publication</Label><Input type="datetime-local" /></div>
                        <div className="space-y-2"><Label>Date limite de rendu</Label><Input type="datetime-local" /></div>
                    </div>
                    <div className="space-y-2 mb-6"><Label>Consignes</Label><Textarea rows={6} placeholder="Décrivez les consignes, les livrables attendus, les critères d'évaluation..." /></div>
                    <div className="space-y-2 mb-6">
                        <Label>Fichier sujet (optionnel)</Label>
                        <div className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez un fichier ici ou cliquez pour parcourir.</p>
                            <Input id="file-upload" type="file" className="hidden" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsAssignmentModalOpen(false)}>Annuler</Button>
                        <Button type="submit">Programmer le devoir</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        {/* Visualisation Résultats QCM */}
        <Dialog open={isQcmResultsModalOpen} onOpenChange={setIsQcmResultsModalOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Résultats - {selectedEvaluation?.title}</DialogTitle>
                </DialogHeader>
                 <div className="overflow-x-auto my-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead><TableHead>Moyenne</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell>Martin Dubois</TableCell><TableCell>16/20</TableCell></TableRow>
                            <TableRow><TableCell>Sophie Laurent</TableCell><TableCell>18/20</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsQcmResultsModalOpen(false)}>Fermer</Button>
                    <Button type="button"><Download className="mr-2 h-4 w-4" /> Télécharger</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {/* Visualisation Rendus Devoir */}
        <Dialog open={isAssignmentSubmissionsModalOpen} onOpenChange={setIsAssignmentSubmissionsModalOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Rendus - {selectedEvaluation?.title}</DialogTitle>
                </DialogHeader>
                 <div className="overflow-x-auto my-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Date de rendu</TableHead>
                                <TableHead>Fichier</TableHead>
                                <TableHead>Note (/20)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           <TableRow>
                                <TableCell>Martin Dubois</TableCell>
                                <TableCell>15/05/2025 14:30</TableCell>
                                <TableCell><Button variant="link" className="p-0 h-auto">martin_dubois_tp1.zip</Button></TableCell>
                                <TableCell><Input type="number" className="w-20" /></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                </TableCell>
                           </TableRow>
                           <TableRow>
                                <TableCell>Sophie Laurent</TableCell>
                                <TableCell>16/05/2025 09:15</TableCell>
                                <TableCell><Button variant="link" className="p-0 h-auto">sophie_laurent_tp1.zip</Button></TableCell>
                                <TableCell><Input type="number" className="w-20" defaultValue="17.5" /></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                </TableCell>
                           </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAssignmentSubmissionsModalOpen(false)}>Fermer</Button>
                    <Button type="button">Sauvegarder les notes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Modification Deadline */}
        <Dialog open={isEditDeadlineModalOpen} onOpenChange={setIsEditDeadlineModalOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Modifier la date limite</DialogTitle>
                </DialogHeader>
                <form>
                    <div className="space-y-4 my-6">
                        <div className="space-y-2">
                            <Label>Titre du devoir</Label>
                            <Input readOnly defaultValue={selectedEvaluation?.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-deadline">Nouvelle date limite</Label>
                            <Input id="new-deadline" type="datetime-local" defaultValue={selectedEvaluation?.deadline} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsEditDeadlineModalOpen(false)}>Annuler</Button>
                        <Button type="submit">Modifier</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
