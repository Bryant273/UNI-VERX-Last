

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Download,
  ArrowLeft,
  ArrowRight,
  Search,
  History,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { allEvents, studentData } from '@/lib/static-data';
import type { UserRole } from '@/lib/data';
import { useParams } from 'next/navigation';

// --- Interfaces & Types ---
interface QcmQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
}

type QcmStatus = 'Effectué' | 'Manqué' | 'Rattrapage';

interface QcmHistoryItem {
    id: string;
    module: string;
    date: string;
    average: string;
    questions: QcmQuestion[];
    status: QcmStatus;
}

interface Qcm {
    id: string;
    title: string;
    difficulty: 'Facile' | 'Moyenne' | 'Difficile';
    startTime: Date;
    endTime: Date;
    questions: QcmQuestion[];
    isRattrapage?: boolean;
}


// --- Constants & Mock Data ---
const difficultyColors = {
  Facile: { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' },
  Moyenne: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' },
  Difficile: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' },
};

const statusColors: { [key: string]: string } = {
  'Non rendu': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  'En attente': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'Rendu confirmé': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Noté': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'En cours d\'évaluation': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'Effectué': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Manqué': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  'Rattrapage': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
};


const generateQuestions = (topic: string, count: number): QcmQuestion[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${topic.replace(/\s+/g, '-')}-q${i+1}`,
        question: `Question ${i+1} sur ${topic}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: ['Option A', 'Option B', 'Option C', 'Option D'][Math.floor(Math.random() * 4)],
    }));
};

const initialQcmHistory: QcmHistoryItem[] = [
    { 
        id: 'QCM-032', 
        module: 'Mathématiques Discrètes', 
        date: '10/05/2025', 
        average: '17/20',
        questions: generateQuestions('les graphes', 20).map(q => ({...q, userAnswer: q.options[Math.floor(Math.random()*4)]})),
        status: 'Effectué',
    },
    { 
        id: 'QCM-031', 
        module: 'Algorithmique Avancée', 
        date: '08/05/2025', 
        average: '14/20',
        questions: generateQuestions('la complexité', 20).map(q => ({...q, userAnswer: q.options[Math.floor(Math.random()*4)]})),
        status: 'Effectué',
    },
    {
      id: 'QCM-030',
      module: 'Sécurité Informatique',
      date: '05/05/2025',
      average: '0/20',
      questions: generateQuestions('la cryptographie', 20),
      status: 'Manqué',
    }
];

const QUESTIONS_PER_PAGE = 5;
const QCM_HISTORY_ITEMS_PER_PAGE = 5;
const QCM_DURATION_MINUTES = 15;


// --- Helper Functions ---
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const shuffleArray = <T>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const getDailyQcms = (): Qcm[] => {
    const now = new Date();
    const todayDay = now.toLocaleString('fr-FR', { weekday: 'long' }).toLowerCase();
    
    // In a real app, this would come from a proper API call with the student's schedule
    const userTimetableToday = [
      { day: 'lundi', time: '09:00 - 11:00', course: 'Calcul Avancé', id: 1, type: 'cours' },
      { day: 'lundi', time: '13:00 - 15:00', course: 'Physique Quantique', id: 2, type: 'tp' },
    ];

    const todayEvents = userTimetableToday.filter(event => 
        event.day === todayDay && (event.type === 'cours' || event.type === 'td' || event.type === 'tp')
    );

    return todayEvents.map(event => {
        const [startHours, startMinutes] = event.time.split(' - ')[0].split(':').map(Number);
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes);
        const endTime = new Date(startTime.getTime() + QCM_DURATION_MINUTES * 60 * 1000);

        let difficulty: 'Facile' | 'Moyenne' | 'Difficile' = 'Moyenne';
        if (event.course.includes('Avancé')) difficulty = 'Difficile';
        if (event.course.includes('Introduction')) difficulty = 'Facile';

        return {
            id: `QCM-${event.id}-${now.toISOString().split('T')[0]}`,
            title: event.course,
            difficulty: difficulty,
            startTime,
            endTime,
            questions: shuffleArray(generateQuestions(event.course, 50)).slice(0, 20),
        };
    });
};


// --- Sub-components for QCM Modal ---
const QcmStart: React.FC<{ onStart: () => void, onClose: () => void, qcm: Qcm }> = ({ onStart, onClose, qcm }) => (
    <div>
        <DialogDescription className="mb-6">
            Vous êtes sur le point de commencer {qcm.isRattrapage ? "un rattrapage" : "l'interrogation"}. Une fois démarré, vous disposez de {QCM_DURATION_MINUTES} minutes pour terminer.
        </DialogDescription>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={onStart}>{qcm.isRattrapage ? "Commencer le rattrapage" : "Commencer"}</Button>
        </DialogFooter>
    </div>
);

const QcmTest: React.FC<{
    qcm: Qcm;
    timeLeft: number;
    currentPage: number;
    answers: Record<string, string>;
    onAnswer: (questionId: string, answer: string) => void;
    onPageChange: (page: number) => void;
    onSubmit: () => void;
}> = ({ qcm, timeLeft, currentPage, answers, onAnswer, onPageChange, onSubmit }) => {
    const totalPages = Math.ceil(qcm.questions.length / QUESTIONS_PER_PAGE);
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    const currentQuestions = qcm.questions.slice(startIndex, endIndex);

    return (
        <div className='flex flex-col h-full'>
            <div className="bg-muted/50 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                   <span>{qcm.title}</span>
                   <div className='flex items-center gap-2'>
                     <Clock className="h-4 w-4" />
                     <span>Temps restant : {formatTime(timeLeft)}</span>
                   </div>
                   <span>Page {currentPage}/{totalPages}</span>
                </div>
            </div>
            
            <div className="space-y-6 flex-grow overflow-auto pr-2">
                {currentQuestions.map((q, index) => (
                    <div key={q.id}>
                        <p className="font-medium mb-3">{startIndex + index + 1}. {q.question}</p>
                        <RadioGroup 
                            value={answers[q.id]}
                            onValueChange={(value) => onAnswer(q.id, value)}
                            className="grid grid-cols-2 gap-3"
                        >
                            {q.options.map((opt, optIndex) => (
                                <Label key={optIndex} htmlFor={`${q.id}-${optIndex}`} className="flex items-center p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                                    <RadioGroupItem value={opt} id={`${q.id}-${optIndex}`} className="mr-3"/>
                                    <span>{opt}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>

            <DialogFooter className="mt-8 pt-4 border-t">
                <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ArrowLeft className="mr-2"/> Précédent</Button>
                {currentPage < totalPages ? (
                    <Button onClick={() => onPageChange(currentPage + 1)}>Suivant <ArrowRight className="ml-2"/></Button>
                ) : (
                    <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">Soumettre les réponses <Check className="ml-2" /></Button>
                )}
            </DialogFooter>
        </div>
    );
};

const QcmResults: React.FC<{
    score: number;
    totalQuestions: number;
    timeLeft: number;
    onClose: () => void;
}> = ({ score, totalQuestions, timeLeft, onClose }) => (
    <div className="text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold">QCM terminé !</h3>
        <p className="text-muted-foreground mt-2">Vous avez obtenu :</p>
        <div className="text-4xl font-bold text-primary mt-2 mb-4">
            {score}/{totalQuestions}
        </div>
        <Card className="text-left p-4">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Bonnes réponses :</span>
                  <span className="text-sm font-bold text-green-600">{score}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Temps utilisé :</span>
                  <span className="text-sm font-bold">{formatTime((QCM_DURATION_MINUTES * 60) - timeLeft)}</span>
              </div>
            </CardContent>
        </Card>
        <DialogFooter className="mt-6">
            <Button onClick={onClose} className="w-full">Fermer</Button>
        </DialogFooter>
    </div>
);


// --- Main Component ---
export default function EvaluationsPage() {
    const params = useParams();
    const role = params.role as UserRole;
    
    // --- State ---
    const [now, setNow] = useState(new Date());
    const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isQcmModalOpen, setQcmModalOpen] = useState(false);
    const [isQcmHistoryModalOpen, setQcmHistoryModalOpen] = useState(false);
    
    const [selectedQcm, setSelectedQcm] = useState<Qcm | null>(null);
    const [selectedQcmHistory, setSelectedQcmHistory] = useState<QcmHistoryItem | null>(null);
    const [qcmStep, setQcmStep] = useState<'start' | 'test' | 'results'>('start');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [qcmCurrentPage, setQcmCurrentPage] = useState(1);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(QCM_DURATION_MINUTES * 60);

    const [allQcmHistory, setAllQcmHistory] = useState<QcmHistoryItem[]>(initialQcmHistory);
    const [qcmHistorySearch, setQcmHistorySearch] = useState('');
    const [qcmHistoryModule, setQcmHistoryModule] = useState('all');
    const [qcmHistoryCurrentPage, setQcmHistoryCurrentPage] = useState(1);
    const [rattrapageActive, setRattrapageActive] = useState(false);
    
    // --- Memos & Derived State ---
    const dailyQcms = useMemo(getDailyQcms, [now]);
    const qcmHistoryModules = useMemo(() => ['all', ...Array.from(new Set(allQcmHistory.map((q) => q.module)))], [allQcmHistory]);

    const filteredQcmHistory = useMemo(() => {
        return allQcmHistory
            .filter((qcm) => qcm.module.toLowerCase().includes(qcmHistorySearch.toLowerCase()) || qcm.id.toLowerCase().includes(qcmHistorySearch.toLowerCase()))
            .filter((qcm) => qcmHistoryModule === 'all' || qcm.module === qcmHistoryModule);
    }, [qcmHistorySearch, qcmHistoryModule, allQcmHistory]);

    const totalQcmHistoryPages = Math.ceil(filteredQcmHistory.length / QCM_HISTORY_ITEMS_PER_PAGE);
    const paginatedQcmHistory = filteredQcmHistory.slice(
        (qcmHistoryCurrentPage - 1) * QCM_HISTORY_ITEMS_PER_PAGE,
        qcmHistoryCurrentPage * QCM_HISTORY_ITEMS_PER_PAGE
    );
    
    const missedQcmsForRattrapage = useMemo(() => {
        if (!rattrapageActive) return [];
        return allQcmHistory
            .filter(h => h.status === 'Manqué')
            .map(h => ({
                id: h.id,
                title: h.module,
                difficulty: 'Moyenne' as 'Moyenne',
                startTime: new Date(),
                endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h from now
                questions: shuffleArray(h.questions).slice(0, 20),
                isRattrapage: true,
            }));
    }, [rattrapageActive, allQcmHistory]);


    // --- Effects ---
    useEffect(() => {
        // This effect updates the current time every second, but only when the QCM modal is open and in the 'test' step.
        // This is more efficient than a global timer.
        if (qcmStep === 'test' && isQcmModalOpen) {
          const timer = setInterval(() => {
            setNow(new Date());
            if (timeLeft > 0) {
              setTimeLeft(prevTime => prevTime - 1);
            } else {
              finishQcm();
            }
          }, 1000);
          return () => clearInterval(timer);
        }
    
        // This timer updates the date for the "QCM du jour" card title every minute if the modal is not open.
        if (!isQcmModalOpen) {
          const timer = setInterval(() => setNow(new Date()), 60000);
          return () => clearInterval(timer);
        }
    }, [qcmStep, isQcmModalOpen, timeLeft]);


    // --- Callbacks & Handlers ---
    const finishQcm = useCallback(() => {
        if (!selectedQcm) return;

        const score = selectedQcm.questions.filter(q => answers[q.id] === q.correctAnswer).length;
        
        if (selectedQcm.isRattrapage) {
            setAllQcmHistory(prev => 
                prev.map(h => 
                    h.id === selectedQcm.id
                    ? { ...h, status: 'Rattrapage', average: `${score}/${selectedQcm.questions.length}` }
                    : h
                )
            );
        } else {
             const newHistoryItem: QcmHistoryItem = {
                id: selectedQcm.id,
                module: selectedQcm.title,
                date: new Date().toLocaleDateString('fr-FR'),
                average: `${score}/${selectedQcm.questions.length}`,
                questions: selectedQcm.questions.map(q => ({ ...q, userAnswer: answers[q.id] })),
                status: 'Effectué',
            };
            setAllQcmHistory(prev => [newHistoryItem, ...prev].sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime()));
        }
        
        setQcmStep('results');
    }, [selectedQcm, answers]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };
    
    const handleQcmModalOpenChange = (open: boolean) => {
        if (!open) {
            if (qcmStep === 'test') {
                finishQcm();
            }
            setQcmModalOpen(false);
            setSelectedQcm(null);
            setQcmStep('start');
        } else {
            setQcmModalOpen(true);
        }
    };
    
    const handleStartQcm = (qcm: Qcm) => {
        setSelectedQcm(qcm);
        setQcmCurrentPage(1);
        setAnswers({});
        setQcmStep('start');
        setTimeLeft(QCM_DURATION_MINUTES * 60);
        setQcmModalOpen(true);
    };

    const handleHistoryClick = (qcm: QcmHistoryItem) => {
        setSelectedQcmHistory(qcm);
        setQcmHistoryModalOpen(true);
    };

    const renderQcmHistoryPagination = () => {
        const pages = [];
        if (totalQcmHistoryPages <= 1) return null;
        for (let i = 1; i <= totalQcmHistoryPages; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={qcmHistoryCurrentPage === i ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setQcmHistoryCurrentPage(i)}
                    className="h-8 w-8"
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };
    
    const renderQcmButton = (qcm: Qcm) => {
        const isAvailable = now >= qcm.startTime && now <= qcm.endTime;
        const alreadyDone = allQcmHistory.some(h => h.id === qcm.id && (h.status === 'Effectué' || h.status === 'Rattrapage'));

        let buttonContent = <Button className="w-full" onClick={() => handleStartQcm(qcm)}>Commencer l'interrogation</Button>;
        let description = `Disponible jusqu'à ${qcm.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

        if (alreadyDone) {
             buttonContent = <Button className="w-full" disabled>Déjà effectué</Button>;
             description = "Vous avez déjà complété ce QCM.";
        } else if (!isAvailable) {
            buttonContent = <Button className="w-full" disabled>Commencer l'interrogation</Button>;
            if (now < qcm.startTime) {
                description = `Disponible à partir de ${qcm.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
            } else {
                description = "Ce QCM n'est plus disponible.";
            }
        }
        
        return (
            <Card key={qcm.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{qcm.title}</CardTitle>
                  <CardDescription>
                    <Clock className="inline-block mr-1 h-3 w-3" />
                    Durée : {QCM_DURATION_MINUTES} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Difficulté</span>
                      <span className={`font-medium ${difficultyColors[qcm.difficulty].text}`}>{qcm.difficulty}</span>
                    </div>
                    <Progress value={qcm.difficulty === 'Facile' ? 25 : qcm.difficulty === 'Moyenne' ? 50 : 75} className={`h-1.5 [&>div]:${difficultyColors[qcm.difficulty].bg}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Questions :</span> {qcm.questions.length}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  {buttonContent}
                  <p className="text-xs text-muted-foreground self-center">{description}</p>
                </CardFooter>
            </Card>
        );
    }
    
    const renderQcmContent = () => {
        if (!selectedQcm) return null;
        
        const score = selectedQcm.questions.filter(q => answers[q.id] === q.correctAnswer).length;

        switch (qcmStep) {
            case 'test':
                return <QcmTest 
                    qcm={selectedQcm}
                    timeLeft={timeLeft}
                    currentPage={qcmCurrentPage}
                    answers={answers}
                    onAnswer={(questionId, answer) => setAnswers(prev => ({...prev, [questionId]: answer}))}
                    onPageChange={setQcmCurrentPage}
                    onSubmit={finishQcm}
                 />;
            case 'results':
                return <QcmResults 
                    score={score}
                    totalQuestions={selectedQcm.questions.length}
                    timeLeft={timeLeft}
                    onClose={() => handleQcmModalOpenChange(false)}
                 />;
            case 'start':
            default:
                return <QcmStart onStart={() => setQcmStep('test')} onClose={() => handleQcmModalOpenChange(false)} qcm={selectedQcm}/>;
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
            {['admin', 'academic-advisor'].includes(role) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Zone Administrateur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setRattrapageActive(prev => !prev)}>
                            <History className="mr-2" />
                            {rattrapageActive ? "Désactiver" : "Activer"} la session de rattrapage (48h)
                        </Button>
                        {rattrapageActive && <p className="text-sm text-green-600 mt-2">La session de rattrapage est active pour tous les étudiants.</p>}
                    </CardContent>
                </Card>
            )}

            {rattrapageActive && (
                 <Card>
                    <CardHeader>
                      <CardTitle>QCM de Rattrapage</CardTitle>
                       <AlertDescription className="text-blue-700 dark:text-blue-400">
                            Voici les QCM que vous avez manqués. Vous avez 48h pour les compléter.
                       </AlertDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {missedQcmsForRattrapage.length > 0 ? missedQcmsForRattrapage.map(qcm => renderQcmButton(qcm)) : <p className="text-muted-foreground col-span-full text-center py-4">Vous n'avez aucun QCM à rattraper. Bravo !</p>}
                      </div>
                    </CardContent>
                </Card>
            )}

          <Card>
            <CardHeader>
              <CardTitle>QCM du jour</CardTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
                <CalendarDays className="h-4 w-4" />
                <span>{now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </CardHeader>
            <CardContent>
                <Alert className="mb-6 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">QCM programmés pour aujourd'hui</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                        Les interrogations sont liées à votre emploi du temps. Chaque QCM est disponible pendant les 15 premières minutes du cours correspondant.
                    </AlertDescription>
                </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {dailyQcms.length > 0 ? dailyQcms.map(renderQcmButton) : <p className="text-muted-foreground col-span-full text-center py-4">Aucun QCM prévu pour aujourd'hui dans votre emploi du temps.</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historique des QCM</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un ID ou un module..."
                            className="pl-10"
                            value={qcmHistorySearch}
                            onChange={(e) => setQcmHistorySearch(e.target.value)}
                        />
                    </div>
                    <Select value={qcmHistoryModule} onValueChange={setQcmHistoryModule}>
                        <SelectTrigger className="w-full md:w-[240px]">
                            <SelectValue placeholder="Tous les modules" />
                        </SelectTrigger>
                        <SelectContent>
                            {qcmHistoryModules.map((module) => (
                                <SelectItem key={module} value={module}>
                                    {module === 'all' ? 'Tous les modules' : module}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedQcmHistory.length > 0 ? paginatedQcmHistory.map((item, index) => (
                        <TableRow key={item.id} className="even:bg-muted/40">
                            <TableCell>{(qcmHistoryCurrentPage - 1) * QCM_HISTORY_ITEMS_PER_PAGE + index + 1}</TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.module}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="font-semibold">{item.average}</TableCell>
                            <TableCell><Badge variant="outline" className={`border-0 ${statusColors[item.status]}`}>{item.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleHistoryClick(item)}>
                                    <Eye className="h-4 w-4"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground h-24">Aucun historique de QCM trouvé.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
              </Table>
            </CardContent>
             <CardFooter className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Affichage de {paginatedQcmHistory.length} sur {filteredQcmHistory.length} QCM
                </p>
                {totalQcmHistoryPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQcmHistoryCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={qcmHistoryCurrentPage === 1}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {renderQcmHistoryPagination()}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQcmHistoryCurrentPage((p) => Math.min(totalQcmHistoryPages, p + 1))}
                            disabled={qcmHistoryCurrentPage === totalQcmHistoryPages}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardFooter>
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
                                <TableHead>#</TableHead>
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
                                <TableRow key={index} className="even:bg-muted/40">
                                    <TableCell>{index + 1}</TableCell>
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
                                <TableHead>#</TableHead>
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
                                <TableRow key={index} className="even:bg-muted/40">
                                    <TableCell>{index + 1}</TableCell>
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

      <Dialog open={isQcmModalOpen} onOpenChange={handleQcmModalOpenChange}>
          <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
              <DialogHeader>
                  <DialogTitle>Interrogation : {selectedQcm?.title}</DialogTitle>
              </DialogHeader>
              {renderQcmContent()}
          </DialogContent>
      </Dialog>

      <Dialog open={isQcmHistoryModalOpen} onOpenChange={setQcmHistoryModalOpen}>
          <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
              <DialogHeader>
                  <DialogTitle>Détails du QCM: {selectedQcmHistory?.id}</DialogTitle>
                  {selectedQcmHistory && (
                    <DialogDescription>
                        Module: {selectedQcmHistory.module} | Date: {selectedQcmHistory.date} | Note: <span className="font-bold">{selectedQcmHistory.average}</span>
                    </DialogDescription>
                  )}
              </DialogHeader>
              <div className="flex-grow overflow-auto pr-4 space-y-6">
                {selectedQcmHistory?.questions?.map((q, index) => (
                    <div key={q.id}>
                        <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option, optIndex) => {
                                const isUserAnswer = q.userAnswer === option;
                                const isCorrectAnswer = q.correctAnswer === option;
                                const isIncorrectUserAnswer = isUserAnswer && !isCorrectAnswer;

                                return (
                                    <div 
                                        key={optIndex}
                                        className={cn(
                                            "flex items-center p-3 rounded-lg border text-sm",
                                            isCorrectAnswer && "bg-green-500/10 border-green-500/30",
                                            isIncorrectUserAnswer && "bg-red-500/10 border-red-500/30",
                                        )}
                                    >
                                        {isCorrectAnswer && <Check className="h-4 w-4 mr-3 text-green-600"/>}
                                        {isIncorrectUserAnswer && <XCircle className="h-4 w-4 mr-3 text-red-600"/>}
                                        {!isCorrectAnswer && !isIncorrectUserAnswer && (
                                            isUserAnswer ? <CheckCircle className="h-4 w-4 mr-3 text-muted-foreground" /> : <div className="w-4 h-4 mr-3" />
                                        )}
                                        <span className={cn(
                                            isCorrectAnswer && "font-semibold text-green-800 dark:text-green-200",
                                            isIncorrectUserAnswer && "line-through text-red-800 dark:text-red-300"
                                        )}>
                                            {option}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {!selectedQcmHistory?.questions && (
                    <div className="text-center text-muted-foreground py-8">
                        Les détails pour ce QCM ne sont pas disponibles.
                    </div>
                )}
              </div>
               <DialogFooter className="mt-4 pt-4 border-t">
                  <Button onClick={() => setQcmHistoryModalOpen(false)}>Fermer</Button>
               </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}

