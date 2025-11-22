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
  Ban,
  Users,
  UserPlus
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const statusColors: { [key: string]: string } = {
  'Terminé': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Programmé': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'En cours': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
};

const studentsList = [
    { id: 'etu-1', name: 'Alice Martin' }, { id: 'etu-2', name: 'Bob Leclerc' },
    { id: 'etu-3', name: 'Claire Dubois' }, { id: 'etu-4', name: 'David Garcia' },
    { id: 'etu-5', name: 'Eva Simon' }, { id: 'etu-6', name: 'Fabien Rousseau' },
    { id: 'etu-7', name: 'Grace Lambert' }, { id: 'etu-8', name: 'Hugo Bernard' },
    { id: 'etu-9', name: 'Ines Boyer' }, { id: 'etu-10', name: 'Julien Petit' },
    { id: 'etu-11', name: 'Karine Moreau' }, { id: 'etu-12', name: 'Louis Chevalier' },
];


export default function ProfessorEvaluationsPage() {
    const [isQcmModalOpen, setIsQcmModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [isGroupTdModalOpen, setIsGroupTdModalOpen] = useState(false);
    const [groupTdStep, setGroupTdStep] = useState(1);
    const [isQcmResultsModalOpen, setIsQcmResultsModalOpen] = useState(false);
    const [isAssignmentSubmissionsModalOpen, setIsAssignmentSubmissionsModalOpen] = useState(false);
    const [isEditDeadlineModalOpen, setIsEditDeadlineModalOpen] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
    const [selectedClassForTd, setSelectedClassForTd] = useState<string | null>(null);

    const [availableStudents, setAvailableStudents] = useState(studentsList);
    const [currentGroup, setCurrentGroup] = useState<typeof studentsList>([]);
    const [groups, setGroups] = useState<{name: string, members: typeof studentsList}[]>([]);
    const [groupName, setGroupName] = useState('');
    
    const openModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>, data?: any) => {
        setSelectedEvaluation(data);
        modalSetter(true);
    };

    const handleStudentToggle = (student: typeof studentsList[0], list: 'available' | 'group') => {
        if (list === 'available') {
            setAvailableStudents(prev => prev.filter(s => s.id !== student.id));
            setCurrentGroup(prev => [...prev, student]);
        } else {
            setCurrentGroup(prev => prev.filter(s => s.id !== student.id));
            setAvailableStudents(prev => [...prev, student].sort((a,b) => a.name.localeCompare(b.name)));
        }
    }

    const handleCreateGroup = () => {
        if (!groupName || currentGroup.length === 0) return;
        setGroups(prev => [...prev, { name: groupName, members: currentGroup }]);
        setCurrentGroup([]);
        setGroupName('');
    };
    
  return (
    <div className="space-y-6">
      <Tabs defaultValue="interrogations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interrogations">
            <ClipboardList className="mr-2 h-4 w-4" /> Interrogations QCM
          </TabsTrigger>
          <TabsTrigger value="devoirs">
            <FileText className="mr-2 h-4 w-4" /> Devoirs
          </TabsTrigger>
          <TabsTrigger value="group-tds">
            <Users className="mr-2 h-4 w-4" /> TDs de groupe
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

        <TabsContent value="group-tds" className="space-y-6 mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gérer les TD de Groupe</CardTitle>
                        <CardDescription>Créez des groupes, assignez des travaux et suivez leur progression.</CardDescription>
                    </div>
                    <Button onClick={() => { setIsGroupTdModalOpen(true); setGroupTdStep(1); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un nouveau TD de groupe
                    </Button>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Travaux Dirigés de Groupe Programmés</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom du TD</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Groupe</TableHead>
                                <TableHead>Date limite</TableHead>
                                <TableHead>Rendus</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="font-medium">Projet de fin de semestre</div>
                                    <div className="text-xs text-muted-foreground">Bases de Données</div>
                                </TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>Groupe A</TableCell>
                                <TableCell>30/06/2025</TableCell>
                                <TableCell>1 / 1</TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['Terminé']}>Terminé</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>
                                    <div className="font-medium">Étude de cas : Réseaux</div>
                                    <div className="text-xs text-muted-foreground">Réseaux Informatiques</div>
                                </TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>Groupe B</TableCell>
                                <TableCell>15/06/2025</TableCell>
                                <TableCell>0 / 1</TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['En cours']}>En cours</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </TabsContent>
      </Tabs>

      {/* --- Modals --- */}
      <Dialog open={isQcmModalOpen} onOpenChange={setIsQcmModalOpen}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Créer une interrogation QCM</DialogTitle>
                <DialogDescription>Banque de 50 questions pour une sélection aléatoire de 20 questions par étudiant.</DialogDescription>
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
                    <h3 className="text-lg font-semibold">Générateur de questions</h3>
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                       <p className="text-muted-foreground">La section de création de questions sera implémentée ici.</p>
                       <Button variant="secondary" className="mt-4">Générer avec l'IA</Button>
                    </div>
                 </div>
                 <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsQcmModalOpen(false)}>Annuler</Button>
                    <Button type="submit">Créer l'interrogation</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
        
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
      
      <Dialog open={isGroupTdModalOpen} onOpenChange={setIsGroupTdModalOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Créer un nouveau TD de Groupe</DialogTitle>
                <DialogDescription>
                    Étape {groupTdStep} sur 2: {groupTdStep === 1 ? 'Définition du travail' : 'Constitution des groupes'}
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1">
              {groupTdStep === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); setGroupTdStep(2); }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                          <div className="space-y-2 md:col-span-2"><Label>Titre du TD</Label><Input placeholder="Ex: Projet de fin de semestre" /></div>
                          <div className="space-y-2"><Label>Matière</Label><Select><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent><SelectItem value="bdd">Bases de Données</SelectItem></SelectContent></Select></div>
                          
                          <div className="space-y-2">
                              <Label>Classe</Label>
                              <Select onValueChange={setSelectedClassForTd}>
                                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="l3-info">L3 Informatique</SelectItem>
                                      <SelectItem value="l2-info">L2 Informatique</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                           <div className="space-y-2">
                              <Label>Groupe</Label>
                              <Select disabled={!selectedClassForTd}>
                                  <SelectTrigger><SelectValue placeholder="Choisir un groupe" /></SelectTrigger>
                                  <SelectContent>
                                      {selectedClassForTd === 'l3-info' && <>
                                          <SelectItem value="g1">Groupe A</SelectItem>
                                          <SelectItem value="g2">Groupe B</SelectItem>
                                      </>}
                                      {selectedClassForTd === 'l2-info' && <>
                                          <SelectItem value="g3">Équipe Alpha</SelectItem>
                                          <SelectItem value="g4">Équipe Beta</SelectItem>
                                      </>}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="space-y-2"><Label>Date limite</Label><Input type="date"/></div>
                      </div>
                      <div className="space-y-2 mb-6"><Label>Consignes</Label><Textarea rows={4} placeholder="Décrivez les consignes du travail de groupe..." /></div>
                      <div className="space-y-2 mb-6">
                          <Label>Fichier sujet (optionnel)</Label>
                          <div className="p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                              <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="mt-2 text-xs text-muted-foreground">Glissez-déposez un fichier</p>
                              <Input type="file" className="hidden" />
                          </div>
                      </div>
                       <DialogFooter className="pt-4 border-t">
                          <Button type="button" variant="ghost" onClick={() => setIsGroupTdModalOpen(false)}>Annuler</Button>
                          <Button type="submit">Suivant</Button>
                      </DialogFooter>
                  </form>
              )}
              {groupTdStep === 2 && (
                  <div className="my-4">
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <h4 className="font-semibold">Étudiants disponibles ({availableStudents.length})</h4>
                              <div className="h-64 overflow-y-auto border rounded-lg p-2 space-y-2">
                                  {availableStudents.map(student => (
                                      <div key={student.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                          <span>{student.name}</span>
                                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStudentToggle(student, 'available')}><Plus className="h-4 w-4 text-green-500"/></Button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div className="space-y-4">
                              <h4 className="font-semibold">Nouveau groupe</h4>
                              <div className="space-y-2">
                                  <Input placeholder="Nom du groupe (ex: Groupe A)" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                  <div className="h-[188px] overflow-y-auto border rounded-lg p-2 space-y-2">
                                       {currentGroup.map(student => (
                                          <div key={student.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                                              <span>{student.name}</span>
                                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStudentToggle(student, 'group')}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                          </div>
                                      ))}
                                      {currentGroup.length === 0 && <p className="text-center text-xs text-muted-foreground p-4">Ajoutez des étudiants.</p>}
                                  </div>
                                  <Button className="w-full" disabled={!groupName || currentGroup.length === 0} onClick={handleCreateGroup}>Créer ce groupe</Button>
                              </div>
                          </div>
                      </div>
                       <Separator className="my-6" />
                       <div className="space-y-4">
                           <h4 className="font-semibold">Groupes constitués ({groups.length})</h4>
                           <div className="space-y-2">
                              {groups.map((group, index) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                      <p className="font-bold">{group.name}</p>
                                      <p className="text-sm text-muted-foreground">{group.members.map(m => m.name).join(', ')}</p>
                                  </div>
                              ))}
                              {groups.length === 0 && <p className="text-center text-xs text-muted-foreground p-4">Aucun groupe constitué.</p>}
                           </div>
                       </div>
                       <DialogFooter className="mt-8 pt-4 border-t">
                          <Button type="button" variant="ghost" onClick={() => setGroupTdStep(1)}>Précédent</Button>
                          <Button type="button" onClick={() => setIsGroupTdModalOpen(false)}>Assigner le TD</Button>
                      </DialogFooter>
                  </div>
              )}
            </div>
        </DialogContent>
      </Dialog>

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
