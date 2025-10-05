
'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Flag,
  HardHat,
  HelpCircle,
  Lightbulb,
  Mail,
  MoreVertical,
  Star,
  Upload,
  Users,
  Clock,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { enterpriseData, type Mission } from '@/lib/enterprise-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const icons: { [key: string]: React.ElementType } = {
  Briefcase,
  Star,
  Flag,
  CheckCircle,
  Clock,
  HardHat,
  Lightbulb,
};

const StatCard = ({ icon, title, value, subtext }: { icon: string, title: string, value: React.ReactNode, subtext?: string }) => {
    const Icon = icons[icon];
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
            </CardContent>
        </Card>
    );
};

const MissionItem = ({ mission }: { mission: Mission }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { status, icon: iconName, color: statusColor, text: statusText } = enterpriseData.missionStatus[mission.status];
    const StatusIcon = icons[iconName];
    const completedTasks = mission.tasks.filter(t => t.completed).length;
    const totalTasks = mission.tasks.length;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="border rounded-lg">
                <CollapsibleTrigger className="w-full p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        {StatusIcon && <StatusIcon className={cn(`h-5 w-5`, statusColor)} />}
                        <span className="font-semibold">{mission.title}</span>
                         <Badge variant="outline" className={cn('border-0', statusColor.replace('text','bg').replace('-600', '-100').replace('-400', '/30'))}>{statusText}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} tâches</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                             {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="p-4 border-t">
                        <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                        <div className="space-y-3 mb-4">
                            {mission.tasks.map(task => (
                                <div key={task.id} className="flex items-center space-x-2">
                                    <Checkbox id={`task-${task.id}`} checked={task.completed} />
                                    <label htmlFor={`task-${task.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {task.description}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex flex-wrap gap-1">
                                {mission.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                            <span className="text-xs text-muted-foreground">Échéance: {mission.dueDate}</span>
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
};

const TimelineItem = ({ item }: { item: { icon: string, title: string, date: string, description: string, iconColor: string } }) => {
    const { icon: iconName, title, date, description, iconColor } = item;
    const Icon = icons[iconName];
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", iconColor.replace('text-', 'bg-').replace('-500', '-100 dark:bg-blue-900/30'))}>
                    {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
                </div>
                <div className="flex-1 w-px bg-border -mb-6"></div>
            </div>
            <div className="pb-6 w-full">
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
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
                <Icon className={cn("h-6 w-6", color)} />
                <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.info}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function EnterpriseAccessPage() {
    const data = enterpriseData;
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary h-36 relative">
                     <div className="absolute bottom-0 left-6 translate-y-1/2 flex items-end gap-4">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                            <AvatarImage src={data.company.logo} alt={data.company.name} className="object-contain" />
                            <AvatarFallback>{data.company.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-white shadow-sm">{data.company.name}</h1>
                            <p className="text-sm text-primary-foreground/80">{data.internship.title}</p>
                        </div>
                    </div>
                </div>
                <CardContent className="pt-16 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        {data.internship.period}
                    </p>
                    <Button onClick={() => setLoginModalOpen(true)}>
                        <Building className="mr-2 h-4 w-4" />
                        Accéder au portail
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon='Briefcase' title="Progression du stage" value={`${data.stats.progress}%`}>
                    <Progress value={data.stats.progress} className="mt-2 h-2" />
                </StatCard>
                <StatCard icon='Star' title="Évaluation actuelle" value={data.stats.currentEvaluation} subtext={`Prochaine évaluation le ${data.stats.nextEvaluationDate}`} />
                <StatCard icon='Flag' title="Missions terminées" value={`${data.stats.completedMissions} / ${data.stats.totalMissions}`} subtext={`${data.stats.inProgressMissions} en cours`}/>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Missions et Tâches</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.missions.map(mission => <MissionItem key={mission.id} mission={mission} />)}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Journal d'activité</CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="absolute left-4 top-4 bottom-4 w-px bg-border"></div>
                            {data.activityLog.map((item, index) => <TimelineItem key={index} item={item} />)}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Tuteurs et Encadrants</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {data.supervisors.map(s => (
                                <div key={s.name} className="flex items-center gap-3">
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
            </div>

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
