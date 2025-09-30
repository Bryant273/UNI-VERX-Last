'use client';

import React, { useState } from 'react';
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
  Loader2,
  Paperclip,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Info,
  Download
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
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const difficultyColors = {
  Facile: 'text-green-600 dark:text-green-400 bg-green-500',
  Moyenne: 'text-amber-600 dark:text-amber-400 bg-amber-500',
  Difficile: 'text-red-600 dark:text-red-400 bg-red-500',
};

const statusColors: { [key: string]: string } = {
  'Non rendu': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  'En attente': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'Rendu confirmé': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Noté': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'En cours d\'évaluation': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
};


export default function EvaluationsPage() {
    const [activeTab, setActiveTab] = useState('interrogations');
    const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isQcmModalOpen, setQcmModalOpen] = useState(false);
    const [qcmStep, setQcmStep] = useState('start'); // 'start', 'test', 'results'
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };
    
    const renderQcmContent = () => {
        switch (qcmStep) {
            case 'test':
                return (
                <div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold">Temps restant :</span>
                            <span className="font-mono text-base font-bold text-primary">14:32</span>
                        </div>
                        <Progress value={95} />
                    </div>
                    
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i}>
                                <p className="font-medium mb-3">Question {i}: En CSS, quelle propriété est utilisée pour changer la couleur du texte ?</p>
                                <div className="space-y-2">
                                    {['color', 'background-color', 'font-size', 'text-align'].map(opt => (
                                        <label key={opt} className="flex items-center p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 cursor-pointer">
                                            <Input type="radio" name={`q${i}`} className="mr-3"/>
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-8">
                       <Button variant="outline" onClick={() => setQcmStep('start')}><ChevronLeft /> Précédent</Button>
                       <Button onClick={() => setQcmStep('results')}>Terminer et envoyer <Check className="ml-2" /></Button>
                    </DialogFooter>
                </div>
                );
            case 'results':
                return (
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-4">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold">QCM terminé !</h3>
                    <p className="text-muted-foreground mt-2">Vous avez obtenu :</p>
                    <div className="text-4xl font-bold text-primary mt-2 mb-4">
                        18/20
                    </div>
                    <Card className="text-left p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Bonnes réponses :</span>
                            <span className="text-sm font-bold text-green-600">18/20</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Temps utilisé :</span>
                            <span className="text-sm font-bold">12:34</span>
                        </div>
                    </Card>
                    <DialogFooter className="mt-6">
                        <Button onClick={() => setQcmModalOpen(false)} className="w-full">Fermer</Button>
                    </DialogFooter>
                </div>
                );
            case 'start':
            default:
                return (
                <div>
                    <DialogDescription className="mb-6">
                        Vous êtes sur le point de commencer l'interrogation. Une fois démarré, vous disposez de 15 minutes pour terminer le QCM de 20 questions.
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setQcmModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setQcmStep('test')}>Commencer</Button>
                    </DialogFooter>
                </div>
                );
        }
    };


  return (
    <div className="space-y-6">
      <Tabs defaultValue="interrogations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interrogations">
            <ClipboardList className="mr-2" /> Interrogations
          </TabsTrigger>
          <TabsTrigger value="devoirs">
            <FileText className="mr-2" /> Devoirs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interrogations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>QCM du jour</CardTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                <CalendarDays className="h-4 w-4" />
                <span>Samedi 17 mai 2025</span>
              </div>
            </CardHeader>
            <CardContent>
                <Alert className="mb-6 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">QCM programmés pour aujourd'hui</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                        Vous avez 3 interrogations prévues aujourd'hui. Chaque QCM dure 15 minutes et comprend 20 questions.
                    </AlertDescription>
                </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { title: 'Développement Web', difficulty: 'Moyenne', dColor: 'amber' },
                  { title: 'Base de Données Avancées', difficulty: 'Facile', dColor: 'green' },
                  { title: 'Anglais Technique', difficulty: 'Difficile', dColor: 'red' },
                ].map((qcm, i) => (
                  <Card key={i} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{qcm.title}</CardTitle>
                      <CardDescription>
                        <Clock className="inline-block mr-1 h-3 w-3" />
                        Durée : 15 minutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Difficulté</span>
                          <span className={`font-medium ${difficultyColors[qcm.difficulty as keyof typeof difficultyColors].replace('bg-', 'text-')}`}>{qcm.difficulty}</span>
                        </div>
                        <Progress value={qcm.difficulty === 'Facile' ? 25 : qcm.difficulty === 'Moyenne' ? 50 : 75} className={`h-1.5 [&>div]:bg-${qcm.dColor}-500`} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Questions :</span> 20
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => { setQcmStep('start'); setQcmModalOpen(true);}}>
                        Commencer l'interrogation
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>QCM à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Difficulté</TableHead>
                    <TableHead>Questions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {[
                        { module: 'Mathématiques Discrètes', date: 'Lundi 19/05/2025', difficulty: 'Difficile' },
                        { module: 'Algorithmique Avancée', date: 'Mardi 20/05/2025', difficulty: 'Moyenne' },
                        { module: 'Programmation Orientée Objet', date: 'Mercredi 21/05/2025', difficulty: 'Facile' },
                    ].map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.module}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>15 minutes</TableCell>
                            <TableCell>
                               <Badge variant="outline" className={`border-0 ${difficultyColors[item.difficulty as keyof typeof difficultyColors].replace('text-', 'bg-').replace('600', '100').replace('400', '900/30')} ${difficultyColors[item.difficulty as keyof typeof difficultyColors].replace('bg-', 'text-')}`}>
                                 {item.difficulty}
                               </Badge>
                            </TableCell>
                            <TableCell>20 questions</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devoirs" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Devoirs à rendre</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Devoir</TableHead>
                                <TableHead>Date limite</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { module: 'Développement Web', prof: 'Prof. Girard', devoir: 'TP1 - Création d\'un site responsive', deadline: '17/05/2025 à 23:59', deadlineInfo: 'Aujourd\'hui', status: 'Non rendu', deadlineColor: 'text-red-600 dark:text-red-400' },
                                { module: 'Base de Données Avancées', prof: 'Prof. Leclerc', devoir: 'TP2 - Optimisation de requêtes SQL', deadline: '20/05/2025 à 12:00', deadlineInfo: 'Dans 3 jours', status: 'Non rendu', deadlineColor: 'text-orange-600 dark:text-orange-400' },
                                { module: 'Anglais Technique', prof: 'Prof. Smith', devoir: 'Rédaction technique en anglais', deadline: '25/05/2025 à 18:30', deadlineInfo: 'Dans 8 jours', status: 'En attente', deadlineColor: '' },
                                { module: 'Architecture des Ordinateurs', prof: 'Prof. Lefevre', devoir: 'TP sur les architectures RISC', deadline: '30/05/2025 à 23:59', deadlineInfo: 'Dans 13 jours', status: 'Rendu confirmé', deadlineColor: '' },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="font-medium">{item.module}</div>
                                        <div className="text-xs text-muted-foreground">{item.prof}</div>
                                    </TableCell>
                                    <TableCell>{item.devoir}</TableCell>
                                    <TableCell>
                                        <div className={`font-medium ${item.deadlineColor}`}>{item.deadline}</div>
                                        <div className="text-xs text-muted-foreground">{item.deadlineInfo}</div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline" className={`border-0 ${statusColors[item.status]}`}>{item.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSubjectModalOpen(true)}><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => setUploadModalOpen(true)}><FileUp className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(true)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des devoirs rendus</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Devoir</TableHead>
                                <TableHead>Date rendu</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                            {[
                                { module: 'Programmation Orientée Objet', prof: 'Prof. Laurent', devoir: 'TP sur l\'héritage et le polymorphisme', date: '08/05/2025 à 15:45', note: '17/20', status: 'Noté' },
                                { module: 'Bases de Données', prof: 'Prof. Leclerc', devoir: 'Normalisation et conception de BDD', date: '02/05/2025 à 10:12', note: '15/20', status: 'Noté' },
                                { module: 'Développement Web', prof: 'Prof. Girard', devoir: 'Création d\'une API REST', date: '27/04/2025 à 23:50', note: 'En attente', status: 'En cours d\'évaluation' },
                            ].map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="font-medium">{item.module}</div>
                                        <div className="text-xs text-muted-foreground">{item.prof}</div>
                                    </TableCell>
                                    <TableCell>{item.devoir}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell className="font-semibold">{item.note}</TableCell>
                                    <TableCell><Badge variant="outline" className={`border-0 ${statusColors[item.status]}`}>{item.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setSubjectModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>TP1 - Création d'un site responsive</DialogTitle>
            <DialogDescription>Détails et consignes du devoir.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <p className="font-medium">Consignes :</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Réaliser l'exercice en suivant les instructions détaillées dans le document joint.</li>
                <li>Le code doit être bien documenté et suivre les conventions de nommage.</li>
                <li>Rendre le devoir au format ZIP contenant tous les fichiers sources.</li>
                <li>Inclure un rapport au format PDF expliquant votre démarche.</li>
            </ul>
             <p className="font-medium">Critères d'évaluation :</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Respect des consignes (4 points)</li>
                <li>Qualité du code (8 points)</li>
                <li>Rapport et documentation (4 points)</li>
                <li>Fonctionnalités supplémentaires (4 points bonus)</li>
            </ul>
          </div>
          <Separator />
          <div className="pt-4">
             <h3 className="text-lg font-semibold mb-3">Fichier à télécharger</h3>
                <div className="border rounded-lg p-3 flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FileText />
                        </div>
                        <div>
                            <p className="text-sm font-medium">sujet_devoir.pdf</p>
                            <p className="text-xs text-muted-foreground">PDF • 1.25 MB</p>
                        </div>
                    </div>
                    <Button asChild size="sm">
                        <a href="#" download>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                        </a>
                    </Button>
                </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSubjectModalOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Envoyer votre devoir</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors" onClick={() => document.getElementById('file-upload')?.click()}>
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez votre fichier ici ou cliquez pour parcourir.</p>
                <Input id="file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
            </div>
            {selectedFile && (
                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                    <div className="flex items-center gap-3">
                       <Paperclip className="h-5 w-5 text-muted-foreground"/>
                       <div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                        <XCircle className="h-5 w-5 text-red-500"/>
                    </Button>
                </div>
            )}
            <div>
                 <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-1">Commentaire (optionnel)</label>
                 <Textarea id="comment" placeholder="Ajoutez un commentaire à votre envoi..."/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadModalOpen(false)}>Annuler</Button>
            <Button onClick={() => setUploadModalOpen(false)} disabled={!selectedFile}>
                <FileUp className="mr-2"/> Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive"/>
            </div>
            <DialogTitle className="text-xl">Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-center sm:justify-center pt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={() => setDeleteModalOpen(false)}><Trash2 className="mr-2"/>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isQcmModalOpen} onOpenChange={setQcmModalOpen}>
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>Interrogation : Développement Web</DialogTitle>
              </DialogHeader>
              {renderQcmContent()}
          </DialogContent>
      </Dialog>
    </div>
  );
}
