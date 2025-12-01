'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookCheck,
  FileClock,
  ClipboardCheck,
  Paperclip,
  Download,
  UploadCloud,
  X,
  File as FileIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Timer,
  ChevronDown,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  devoirsData,
  qcmData,
  type Devoir,
  type DevoirStatus,
  type QCM,
} from '@/lib/evaluations-data';
import { cn } from '@/lib/utils';
import { allEvents } from '@/lib/static-data';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const devoirStatusConfig: Record<
  DevoirStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  'À faire': { label: 'À faire', icon: FileClock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  'Rendu': { label: 'Rendu', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  'En retard': { label: 'En retard', icon: AlertCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  'Corrigé': { label: 'Corrigé', icon: BookCheck, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
};


const QCMModal = ({ qcm, isOpen, onClose }: { qcm: QCM | null, isOpen: boolean, onClose: () => void }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (isOpen && qcm) {
            setTimeLeft(qcm.duration * 60);
            setCurrentPage(0);
        }
    }, [isOpen, qcm]);

    useEffect(() => {
        if (!isOpen || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, timeLeft]);


    if (!qcm) return null;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const currentQuestion = qcm.questions[currentPage];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4">
                     <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl">{qcm.course} - QCM N°{qcm.qcmNumber}</DialogTitle>
                        <div className={`flex items-center gap-2 font-mono text-lg font-semibold ${timeLeft < 60 ? 'text-destructive' : ''}`}>
                           <Timer className="h-5 w-5"/>
                           <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                </DialogHeader>
                <Progress value={(timeLeft / (qcm.duration * 60)) * 100} className="w-full h-1 rounded-none [&>div]:bg-primary" />
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                     <h2 className="text-lg font-semibold text-center">{currentQuestion.question}</h2>
                     <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                             <div key={index}>
                                <RadioGroupItem value={option} id={`q-${currentPage}-o-${index}`} className="sr-only"/>
                                <Label 
                                    htmlFor={`q-${currentPage}-o-${index}`} 
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50 hover:border-primary transition-all has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary"
                                >
                                    <span className="font-semibold">{option}</span>
                                </Label>
                             </div>
                        ))}
                     </RadioGroup>
                </div>
                <DialogFooter className="p-4 bg-muted/30 border-t flex justify-between items-center w-full">
                    <p className="text-sm font-medium text-muted-foreground">Question {currentPage + 1}/{qcm.questions.length}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                            <ChevronLeft className="mr-2 h-4 w-4"/> Précédent
                        </Button>
                        {currentPage < qcm.questions.length - 1 ? (
                            <Button onClick={() => setCurrentPage(p => Math.min(qcm.questions.length - 1, p + 1))}>
                                Suivant <ChevronRight className="ml-2 h-4 w-4"/>
                            </Button>
                        ) : (
                             <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                                Soumettre
                             </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const QCMResultsModal = ({ qcm, isOpen, onClose }: { qcm: QCM | null, isOpen: boolean, onClose: () => void }) => {
    if (!qcm) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Résultats - {qcm.course}</DialogTitle>
                    <DialogDescription>QCM n°{qcm.qcmNumber} du {qcm.date}</DialogDescription>
                </DialogHeader>
                <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">Votre note</p>
                    <p className="text-5xl font-bold text-primary">{qcm.grade}/20</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Bonnes réponses</p>
                        <p className="font-bold text-green-600">{qcm.grade} / 20</p>
                    </div>
                     <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Temps utilisé</p>
                        <p className="font-bold">12:34 / 15:00</p>
                    </div>
                </div>
                 <DialogFooter>
                    <Button onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


const InterrogationsTab = () => {
    const today = new Date();
    const [selectedQcm, setSelectedQcm] = useState<QCM | null>(null);
    const [resultsQcm, setResultsQcm] = useState<QCM | null>(null);

    const studentTimetable = allEvents.student;

    const activeQCMs = useMemo(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        return qcmData.filter(qcm => {
            const correspondingEvent = studentTimetable.find(event => event.course === qcm.course);
            if (!correspondingEvent) return false;

            const [startHour, startMinute] = qcm.time.split(':').map(Number);
            const startTimeInMinutes = startHour * 60 + startMinute;
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            
            const isQcmActive = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < (startTimeInMinutes + 15);
            return qcm.status === 'Actif' && isQcmActive;
        });

    }, [studentTimetable]);

    const completedQCMs = useMemo(() => qcmData.filter(q => q.status === 'Corrigé'), []);

    return (
      <>
        <div className="mt-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary"/>
                        <span>QCM Actifs</span>
                    </CardTitle>
                    <CardDescription>{today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    {activeQCMs.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activeQCMs.map((qcm) => (
                            <Card key={qcm.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{qcm.course} - QCM N°{qcm.qcmNumber}</CardTitle>
                                    <CardDescription>Disponible pendant les 15 premières minutes du cours.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground"><Clock className="mr-2 h-4 w-4"/> Démarrage à {qcm.time}</div>
                                    <div className="flex items-center text-sm text-muted-foreground"><HelpCircle className="mr-2 h-4 w-4"/> {qcm.questions.length} questions</div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => setSelectedQcm(qcm)}>
                                        Commencer le QCM
                                    </Button>
                                </CardFooter>
                            </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-muted/50 rounded-lg">
                            <ClipboardCheck className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">Aucun QCM actif pour le moment.</p>
                            <p className="text-sm">Reposez-vous bien !</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des QCM</CardTitle>
                    <CardDescription>Retrouvez ici les résultats de vos interrogations passées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Matière</TableHead>
                                    <TableHead>Numéro</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedQCMs.map(qcm => (
                                    <TableRow key={qcm.id} className="even:bg-muted/30">
                                        <TableCell>{qcm.date}</TableCell>
                                        <TableCell className="font-medium">{qcm.course}</TableCell>
                                        <TableCell>QCM n°{qcm.qcmNumber}</TableCell>
                                        <TableCell><Badge variant="secondary">{qcm.grade}/20</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setResultsQcm(qcm)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Voir les détails</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        <QCMModal qcm={selectedQcm} isOpen={!!selectedQcm} onClose={() => setSelectedQcm(null)} />
        <QCMResultsModal qcm={resultsQcm} isOpen={!!resultsQcm} onClose={() => setResultsQcm(null)} />
      </>
    );
};

const DevoirsTab = () => {
    const [viewModalDevoir, setViewModalDevoir] = useState<Devoir | null>(null);
    const [submitModalDevoir, setSubmitModalDevoir] = useState<Devoir | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSumbitDevoir = () => {
        if (submitModalDevoir) {
            console.log(`Submitting file for devoir ${submitModalDevoir.id}`);
            // Logic to handle file submission would go here.
            setSubmitModalDevoir(null);
            setFile(null);
        }
    }
  
    return (
      <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Devoirs à rendre</CardTitle>
                <CardDescription>Consultez les devoirs, téléchargez les sujets et soumettez votre travail.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Matière</TableHead>
                            <TableHead>Titre du devoir</TableHead>
                            <TableHead>Date limite</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devoirsData.map((devoir) => {
                                const status = devoirStatusConfig[devoir.status];
                                return (
                                <TableRow key={devoir.id} className="even:bg-muted/40">
                                    <TableCell className="font-medium">{devoir.course}</TableCell>
                                    <TableCell>{devoir.title}</TableCell>
                                    <TableCell>{devoir.deadline}</TableCell>
                                    <TableCell>
                                    <Badge variant="outline" className={cn("border-0", status.color)}>
                                        <status.icon className="mr-2 h-4 w-4" />
                                        {status.label}
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setViewModalDevoir(devoir)}><Eye className="h-4 w-4" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Voir le sujet</p></TooltipContent>
                                            </Tooltip>
                                             <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSubmitModalDevoir(devoir)} disabled={devoir.status === 'Rendu' || devoir.status === 'Corrigé'}><Paperclip className="h-4 w-4" /></Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Rendre le devoir</p></TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        {/* View Details Modal */}
        {viewModalDevoir && (
            <Dialog open={!!viewModalDevoir} onOpenChange={() => setViewModalDevoir(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{viewModalDevoir.title}</DialogTitle>
                        <DialogDescription>{viewModalDevoir.course} - À rendre avant le {viewModalDevoir.deadline}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div>
                            <h3 className="font-semibold mb-2">Consignes</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewModalDevoir.instructions}</p>
                        </div>
                        {viewModalDevoir.attachments.length > 0 && (
                             <div>
                                <h3 className="font-semibold mb-2">Fichiers joints</h3>
                                <div className="space-y-2">
                                {viewModalDevoir.attachments.map(att => (
                                    <a key={att.name} href={att.url} download className="flex items-center gap-2 p-2 rounded-md border bg-muted/50 hover:bg-muted transition-colors">
                                        <Paperclip className="h-4 w-4"/>
                                        <span className="text-sm font-medium">{att.name}</span>
                                        <Download className="ml-auto h-4 w-4 text-muted-foreground"/>
                                    </a>
                                ))}
                                </div>
                            </div>
                        )}
                        {viewModalDevoir.submission && (
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-green-800 dark:text-green-300">
                                        <CheckCircle/> Votre travail a été rendu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">Fichier soumis le {viewModalDevoir.submission.date} :</p>
                                    <a href="#" className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/80 transition-colors">
                                        <FileIcon className="h-4 w-4"/>
                                        <span className="text-sm font-medium">{viewModalDevoir.submission.file}</span>
                                    </a>
                                    {viewModalDevoir.status === 'Corrigé' && viewModalDevoir.submission.grade && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold">Note obtenue: {viewModalDevoir.submission.grade}/20</h4>
                                            {viewModalDevoir.submission.comment && <p className="text-sm italic text-muted-foreground mt-1">Commentaire : {viewModalDevoir.submission.comment}</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setViewModalDevoir(null)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}

        {/* Submit File Modal */}
        {submitModalDevoir && (
             <Dialog open={!!submitModalDevoir} onOpenChange={() => setSubmitModalDevoir(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Rendre le devoir : {submitModalDevoir.title}</DialogTitle>
                        <DialogDescription>Sélectionnez votre fichier à envoyer.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                         {file ? (
                             <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)}><X className="h-4 w-4" /></Button>
                            </div>
                         ) : (
                            <div 
                                className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez votre fichier</p>
                                <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange}/>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSubmitModalDevoir(null)}>Annuler</Button>
                        <Button onClick={handleSumbitDevoir} disabled={!file}>
                            Confirmer l'envoi
                        </Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
        )}
      </div>
    );
};


export default function StudentEvaluationsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="interrogations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interrogations">
            <ClipboardCheck className="mr-2" /> Interrogations (QCM)
          </TabsTrigger>
          <TabsTrigger value="devoirs">
            <FileClock className="mr-2" /> Devoirs à rendre
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interrogations">
          <InterrogationsTab />
        </TabsContent>
        <TabsContent value="devoirs">
          <DevoirsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
