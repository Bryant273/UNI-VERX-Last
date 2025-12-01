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
import { studentData } from '@/lib/static-data';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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
            <DialogContent className="sm:max-w-4xl h-full sm:h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                     <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl">{qcm.course} - QCM N°{qcm.qcmNumber}</DialogTitle>
                        <div className="flex items-center gap-2 font-mono text-lg font-semibold text-destructive">
                           <Timer />
                           <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <Progress value={(timeLeft / (qcm.duration * 60)) * 100} className="w-full h-2 [&>div]:bg-destructive" />
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                     <h2 className="text-xl font-semibold text-center">{currentQuestion.question}</h2>

                     <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                             <div key={index}>
                                <RadioGroupItem value={option} id={`q-${currentPage}-o-${index}`} className="sr-only"/>
                                <Label htmlFor={`q-${currentPage}-o-${index}`} className="flex flex-col items-center justify-center p-6 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">
                                    <span className="font-bold text-lg">{option}</span>
                                </Label>
                             </div>
                        ))}
                     </RadioGroup>
                </div>
                <DialogFooter className="p-4 bg-muted/50 border-t flex justify-between items-center w-full">
                    <p className="text-sm font-medium">Question {currentPage + 1}/{qcm.questions.length}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}><ChevronLeft /> Précédent</Button>
                        {currentPage < qcm.questions.length - 1 ? (
                            <Button onClick={() => setCurrentPage(p => Math.min(qcm.questions.length - 1, p + 1))}><ChevronRight /> Suivant</Button>
                        ) : (
                             <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">Soumettre</Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const InterrogationsTab = () => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const [selectedQcm, setSelectedQcm] = useState<QCM | null>(null);

    return (
      <>
        <div className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5"/>
                        <span>QCM du jour</span>
                    </CardTitle>
                    <CardDescription>{today}</CardDescription>
                </CardHeader>
                <CardContent>
                    {qcmData.filter(q => q.status === 'Actif').length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {qcmData.filter(q => q.status === 'Actif').map((qcm) => (
                            <Card key={qcm.id} className="flex flex-col">
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
                        <div className="text-center py-12 text-muted-foreground">
                            <ClipboardCheck className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">Aucun QCM actif pour le moment.</p>
                            <p className="text-sm">Reposez-vous bien !</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        <QCMModal qcm={selectedQcm} isOpen={!!selectedQcm} onClose={() => setSelectedQcm(null)} />
      </>
    );
};

const DevoirsTab = () => {
    const [selectedDevoir, setSelectedDevoir] = useState<Devoir | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSumbitDevoir = () => {
        if (selectedDevoir) {
            console.log(`Submitting file for devoir ${selectedDevoir.id}`);
            // Logic to handle file submission would go here.
            setSelectedDevoir(null);
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
                                <TableRow key={devoir.id}>
                                    <TableCell className="font-medium">{devoir.course}</TableCell>
                                    <TableCell>{devoir.title}</TableCell>
                                    <TableCell>{devoir.deadline}</TableCell>
                                    <TableCell>
                                    <Badge variant="outline" className={status.color}>
                                        <status.icon className="mr-2 h-4 w-4" />
                                        {status.label}
                                    </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedDevoir(devoir)}>
                                        Voir le devoir
                                    </Button>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

        {selectedDevoir && (
            <Dialog open={!!selectedDevoir} onOpenChange={() => setSelectedDevoir(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedDevoir.title}</DialogTitle>
                        <DialogDescription>{selectedDevoir.course} - À rendre avant le {selectedDevoir.deadline}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <div>
                            <h3 className="font-semibold mb-2">Consignes</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedDevoir.instructions}</p>
                        </div>
                        {selectedDevoir.attachments.length > 0 && (
                             <div>
                                <h3 className="font-semibold mb-2">Fichiers joints</h3>
                                <div className="space-y-2">
                                {selectedDevoir.attachments.map(att => (
                                    <a key={att.name} href={att.url} download className="flex items-center gap-2 p-2 rounded-md border bg-muted/50 hover:bg-muted transition-colors">
                                        <Paperclip className="h-4 w-4"/>
                                        <span className="text-sm font-medium">{att.name}</span>
                                        <Download className="ml-auto h-4 w-4 text-muted-foreground"/>
                                    </a>
                                ))}
                                </div>
                            </div>
                        )}
                        {selectedDevoir.submission && (
                            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-green-800 dark:text-green-300">
                                        <CheckCircle/> Votre travail a été rendu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">Fichier soumis le {selectedDevoir.submission.date} :</p>
                                    <a href="#" className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted/80 transition-colors">
                                        <FileIcon className="h-4 w-4"/>
                                        <span className="text-sm font-medium">{selectedDevoir.submission.file}</span>
                                    </a>
                                    {selectedDevoir.status === 'Corrigé' && selectedDevoir.submission.grade && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold">Note obtenue: {selectedDevoir.submission.grade}/20</h4>
                                            {selectedDevoir.submission.comment && <p className="text-sm italic text-muted-foreground mt-1">Commentaire : {selectedDevoir.submission.comment}</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {selectedDevoir.status === 'À faire' || selectedDevoir.status === 'En retard' ? (
                            <div>
                                <h3 className="font-semibold mb-2">Rendre mon devoir</h3>
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
                        ) : null}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedDevoir(null)}>Fermer</Button>
                         {(selectedDevoir.status === 'À faire' || selectedDevoir.status === 'En retard') && (
                            <Button onClick={handleSumbitDevoir} disabled={!file}>
                                Rendre le devoir
                            </Button>
                        )}
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
      <Tabs defaultValue="devoirs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interrogations">
            <Calendar className="mr-2" /> QCM du jour
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