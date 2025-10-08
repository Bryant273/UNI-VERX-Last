
'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building,
  Check,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Flag,
  HardHat,
  Lightbulb,
  Mail,
  Star,
  Upload,
  Users,
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { enterpriseData, type Mission } from '@/lib/enterprise-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const icons: { [key: string]: React.ElementType } = {
  Briefcase,
  Star,
  Flag,
  CheckCircle,
  Clock,
  HardHat,
  Lightbulb,
};


const MissionCard = ({ mission }: { mission: Mission }) => {
    const { status, icon: iconName, color: statusColor, text: statusText } = enterpriseData.missionStatus[mission.status];
    const StatusIcon = icons[iconName];
    const completedTasks = mission.tasks.filter(t => t.completed).length;
    const totalTasks = mission.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : mission.status === 'completed' ? 100 : 0;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{mission.title}</CardTitle>
                    <Badge variant="outline" className={cn('border-0 font-medium', statusColor.replace('text','bg').replace('-600', '-100 dark:bg-opacity-20'))}>
                        {StatusIcon && <StatusIcon className={cn('h-3 w-3 mr-1.5', statusColor)} />}
                        {statusText}
                    </Badge>
                </div>
                <CardDescription>{mission.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Tâches</h4>
                    {mission.tasks.map(task => (
                        <div key={task.id} className="flex items-center space-x-3 p-2 rounded-md bg-muted/30">
                            <Checkbox id={`task-${task.id}`} checked={task.completed} />
                            <label htmlFor={`task-${task.id}`} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", task.completed && "line-through text-muted-foreground")}>
                                {task.description}
                            </label>
                        </div>
                    ))}
                    {mission.tasks.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune tâche définie pour cette mission.</p>}
                </div>
                 <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                    <span>Progression</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Échéance: {mission.dueDate}</span>
                <div className="flex flex-wrap gap-1">
                    {mission.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
            </CardFooter>
        </Card>
    );
};

const TimelineItem = ({ item, isLast }: { item: { icon: string, title: string, date: string, description: string, iconColor: string }, isLast: boolean }) => {
    const { icon: iconName, title, date, description, iconColor } = item;
    const Icon = icons[iconName];
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border-4", iconColor.replace('text-', 'bg-').replace('-500', '-100 dark:bg-opacity-20').replace('-600', '-100 dark:bg-opacity-20'), iconColor.replace('text-', 'border-').replace('-500', '-200 dark:border-opacity-30').replace('-600', '-200 dark:border-opacity-30'))}>
                    {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
                </div>
                {!isLast && <div className="flex-1 w-px bg-border -mb-6"></div>}
            </div>
            <div className="pb-8 w-full">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    );
};

const DocumentItem = ({ doc }: { doc: { name: string, type: 'pdf' | 'word' | 'excel', info: string } }) => {
    const iconConfig = {
        pdf: { icon: FileText, color: 'text-red-500' },
        word: { icon: FileText, color: 'text-blue-500' },
        excel: { icon: FileText, color: 'text-green-500' },
    };
    const { icon: Icon, color } = iconConfig[doc.type];

    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
                <Icon className={cn("h-6 w-6 flex-shrink-0", color)} />
                <div className="truncate">
                    <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.info}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <Download className="h-4 w-4" />
            </Button>
        </div>
    );
}

const Stat = ({ icon: Icon, label, value, subValue }: { icon: React.ElementType, label: string, value: string, subValue?: string }) => (
    <div className="flex items-center gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary"/>
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-lg">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground -mt-1">{subValue}</p>}
        </div>
    </div>
);


export default function EnterpriseAccessPage() {
    const data = enterpriseData;
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="p-0">
                    <div className="bg-gradient-to-r from-primary to-secondary p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-4 border-background/50 shadow-lg bg-white">
                                    <AvatarImage src={data.company.logo} alt={data.company.name} className="object-contain p-2" />
                                    <AvatarFallback>{data.company.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{data.company.name}</h1>
                                    <p className="text-primary-foreground/80">{data.internship.title}</p>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => setLoginModalOpen(true)}>
                                <ExternalLink className="mr-2" />
                                Portail Entreprise
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-4 lg:col-span-1">
                        <div className="relative h-24 w-24">
                           <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="text-muted/50"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="currentColor" strokeWidth="3"
                                />
                                <path
                                    className="text-primary"
                                    strokeDasharray={`${data.stats.progress}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                />
                           </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{data.stats.progress}%</div>
                        </div>
                        <div>
                             <p className="text-sm text-muted-foreground">Progression</p>
                             <p className="font-semibold text-lg">{data.internship.period}</p>
                        </div>
                    </div>
                     <Stat icon={ClipboardList} label="Missions" value={`${data.stats.completedMissions} / ${data.stats.totalMissions}`} subValue={`${data.stats.inProgressMissions} en cours`} />
                     <Stat icon={Star} label="Évaluation Actuelle" value={data.stats.currentEvaluation} subValue={`Prochaine: ${data.stats.nextEvaluationDate}`} />
                     <Stat icon={Users} label="Tuteur Principal" value={data.supervisors[0].name} subValue={data.supervisors[0].role} />
                </CardContent>
            </Card>

            <Tabs defaultValue="missions">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="missions"><Briefcase className="mr-2"/>Missions</TabsTrigger>
                    <TabsTrigger value="activity"><Clock className="mr-2"/>Journal de Bord</TabsTrigger>
                    <TabsTrigger value="resources"><Download className="mr-2"/>Ressources</TabsTrigger>
                </TabsList>

                <TabsContent value="missions">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {data.missions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
                    </div>
                </TabsContent>
                <TabsContent value="activity">
                     <Card>
                        <CardHeader>
                            <CardTitle>Journal d'activité du stage</CardTitle>
                        </CardHeader>
                        <CardContent className="relative px-6">
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border -translate-x-1/2"></div>
                            {data.activityLog.map((item, index) => <TimelineItem key={index} item={item} isLast={index === data.activityLog.length -1} />)}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="resources">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tuteurs et Encadrants</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.supervisors.map(s => (
                                    <div key={s.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                        <Avatar>
                                            <AvatarImage src={s.avatar} alt={s.name} />
                                            <AvatarFallback>{s.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{s.name}</p>
                                            <p className="text-xs text-muted-foreground">{s.role}</p>
                                        </div>
                                        <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                            <p>Contacter {s.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents Importants</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data.documents.map(doc => <DocumentItem key={doc.name} doc={doc} />)}
                                <Button variant="outline" className="w-full mt-2">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Soumettre un document
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
            

            {/* Login Modal */}
             <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accès au portail {data.company.name}</DialogTitle>
                        <DialogDescription>
                            Saisissez vos identifiants fournis par l'entreprise pour vous connecter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Cette action vous redirigera vers le portail externe de l'entreprise.</p>
                        <p className="text-sm p-3 bg-muted rounded-md">Identifiant: <span className="font-mono bg-background px-2 py-1 rounded">{data.loginInfo.username}</span></p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setLoginModalOpen(false)}>Se connecter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
