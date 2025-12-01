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
  Check,
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
  devoirsData as initialDevoirsData,
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
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const devoirStatusConfig: Record<
  DevoirStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  'À faire': { label: 'À faire', icon: FileClock, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  'En attente': { label: 'En attente', icon: Clock, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  'Rendu': { label: 'Rendu', icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  'En retard': { label: 'En retard', icon: AlertCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  'Corrigé': { label: 'Corrigé', icon: BookCheck, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
};


const QCMModal = ({ qcm, isOpen, onClose }: { qcm: QCM | null, isOpen: boolean, onClose: () => void }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

    useEffect(() => {
        if (isOpen && qcm) {
            setTimeLeft(qcm.duration * 60);
            setCurrentPage(0);
            setUserAnswers({});
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

    const handleAnswer = (questionIndex: number, optionIndex: number) => {
        setUserAnswers(prev => ({...prev, [questionIndex]: optionIndex}));
    }

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
                     <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" onValueChange={(val) => handleAnswer(currentPage, Number(val))}>
                        {currentQuestion.options.map((option, index) => (
                             <div key={index}>
                                <RadioGroupItem value={String(index)} id={`q-${currentPage}-o-${index}`} className="sr-only"/>
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
    const correctAnswersCount = qcm.grade ?? 0;
    const totalQuestions = qcm.questions.length;
    const wrongAnswersCount = totalQuestions - correctAnswersCount;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Résultats - {qcm.course}</DialogTitle>
                    <DialogDescription>QCM n°{qcm.qcmNumber} du {qcm.date}</DialogDescription>
                </DialogHeader>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Score Final</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-5xl font-bold text-primary">{qcm.grade}<span className="text-2xl text-muted-foreground">/20</span></p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Détails</CardTitle>
                            </CardHeader>
                             <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Bonnes réponses</span>
                                    <span className="font-bold text-green-600">{correctAnswersCount}/{totalQuestions}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Mauvaises réponses</span>
                                    <span className="font-bold text-red-600">{wrongAnswersCount}/{totalQuestions}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Temps utilisé</span>
                                    <span className="font-bold">12:34 / 15:00</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2 overflow-y-auto pr-3">
                         <Accordion type="multiple" className="w-full space-y-2">
                            {qcm.questions.map((question, index) => {
                                const userAnswer = qcm.userAnswers ? qcm.userAnswers[index] : -1;
                                const isCorrect = userAnswer === question.answer;

                                return (
                                    <AccordionItem key={index} value={`item-${index}`} className="border-0">
                                         <Card className={cn(isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20")}>
                                            <AccordionTrigger className="p-4 hover:no-underline text-left">
                                                <div className="flex gap-3 items-center">
                                                    {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0"/> : <XCircle className="h-5 w-5 text-red-600 flex-shrink-0"/>}
                                                    <span className="flex-1">Question {index + 1}: {question.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4">
                                                <div className="space-y-2 text-sm pl-8">
                                                    {question.options.map((option, optIndex) => {
                                                        const isUserChoice = optIndex === userAnswer;
                                                        const isCorrectAnswer = optIndex === question.answer;

                                                        return (
                                                            <div 
                                                                key={optIndex}
                                                                className={cn(
                                                                    "p-2 rounded-md",
                                                                    isCorrectAnswer && "bg-green-500/20",
                                                                    isUserChoice && !isCorrectAnswer && "bg-red-500/20"
                                                                )}
                                                            >
                                                                {isCorrectAnswer && <span className="font-bold text-green-700 dark:text-green-300">Bonne réponse: </span>}
                                                                {isUserChoice && !isCorrectAnswer && <span className="font-bold text-red-700 dark:text-red-300">Votre réponse: </span>}
                                                                {option}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </Card>
                                    </AccordionItem>
                                )
                            })}
                         </Accordion>
                    </div>
                </div>
                 <DialogFooter className="pt-4 border-t">
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
        // For demo purposes, we will ignore the date and only check the time
        // const currentDay = now.toLocaleString('fr-FR', { weekday: 'long' });
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        return qcmData.filter(qcm => {
            const correspondingEvent = studentTimetable.find(event => event.course === qcm.course);
            if (!correspondingEvent) return false;

            const [startHour, startMinute] = qcm.time.split(':').map(Number);
            const startTimeInMinutes = startHour * 60 + startMinute;
            const currentTimeInMinutes = currentHour * 60 + currentMinute;
            
            const isQcmActive = currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < (startTimeInMinutes + 15);
            
            // In a real app, you would also check if the event is today
            // For now, we assume all events in studentTimetable are for today.
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
    const [devoirs, setDevoirs] = useState<Devoir[]>(initialDevoirsData);
    const [viewModalDevoir, setViewModalDevoir] = useState<Devoir | null>(null);
    const [submitModalDevoir, setSubmitModalDevoir] = useState<Devoir | null>(null);
    const [fileToSubmit, setFileToSubmit] = useState<{devoirId: string; file: File} | null>(null);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && submitModalDevoir) {
            setFileToSubmit({ devoirId: submitModalDevoir.id, file: e.target.files[0] });
            toast({ title: "Fichier sélectionné", description: `${e.target.files[0].name} est prêt à être confirmé.` });
            setSubmitModalDevoir(null);
        }
    };
    
    const removeStagedFile = (devoirId: string) => {
        if (fileToSubmit?.devoirId === devoirId) {
            setFileToSubmit(null);
            toast({ title: "Fichier retiré", description: "Le fichier a été retiré de la zone de soumission." });
        }
    }
    
    const confirmSubmission = (devoirId: string) => {
        setDevoirs(prev => prev.map(d => 
            d.id === devoirId ? { ...d, status: 'Rendu', submission: { date: new Date().toLocaleString('fr-FR'), file: fileToSubmit!.file.name }} : d
        ));
        setFileToSubmit(null);
        toast({ title: "Devoir envoyé !", description: "Votre devoir a été soumis avec succès.", variant: "default" });
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
                            {devoirs.map((devoir) => {
                                const status = devoirStatusConfig[devoir.status];
                                const isSubmitted = devoir.status === 'Rendu' || devoir.status === 'Corrigé';
                                const isFileStaged = fileToSubmit?.devoirId === devoir.id;

                                return (
                                <TableRow key={devoir.id} className="even:bg-muted/40">
                                    <TableCell className="font-medium">{devoir.course}</TableCell>
                                    <TableCell>{devoir.title}</TableCell>
                                    <TableCell>{devoir.deadline}</TableCell>
                                    <TableCell>
                                    <Badge variant="outline" className={cn("border-0", status.color)}>
                                        <status.icon className="mr-2 h-4 w-4" />
                                        {isFileStaged && !isSubmitted ? 'Prêt à confirmer' : status.label}
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setViewModalDevoir(devoir)}><Eye className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Voir le sujet</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => setSubmitModalDevoir(devoir)} disabled={isSubmitted}><Paperclip className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Joindre un fichier</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => removeStagedFile(devoir.id)} disabled={!isFileStaged || isSubmitted}><Trash2 className="h-4 w-4 text-destructive" /></Button></TooltipTrigger><TooltipContent><p>Annuler la sélection</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => confirmSubmission(devoir.id)} disabled={!isFileStaged || isSubmitted}><Check className="h-4 w-4 text-green-600" /></Button></TooltipTrigger><TooltipContent><p>Confirmer l'envoi</p></TooltipContent></Tooltip>
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
                        <div 
                            className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Cliquez ou glissez-déposez votre fichier</p>
                            <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange}/>
                        </div>
                    </div>
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