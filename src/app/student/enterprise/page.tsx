
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
    Building, 
    FileText, 
    Download, 
    Copy, 
    Eye, 
    EyeOff, 
    Briefcase,
    Flag,
    Clock,
    CheckCircle,
    User,
    ClipboardList
} from 'lucide-react';
import { enterpriseData, type Mission, type Task, type Supervisor, type Document } from '@/lib/enterprise-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/messages-data';

const InfoCard: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
  <div className={className}>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-base font-semibold">{value}</p>
  </div>
);

const MissionStatusIcon = ({ status }: { status: Mission['status'] }) => {
    const config = {
        completed: { icon: CheckCircle, color: 'text-green-500' },
        'in-progress': { icon: Clock, color: 'text-blue-500' },
        pending: { icon: Flag, color: 'text-yellow-500' },
    };
    const Icon = config[status].icon;
    return <Icon className={`h-5 w-5 ${config[status].color}`} />;
};

const EnterprisePage = () => {
    const { company, internship, missions, supervisors, documents, loginInfo } = enterpriseData;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { toast } = useToast();

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copié !', description: 'L\'information a été copiée dans le presse-papiers.' });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Image src={company.logo} alt={`Logo de ${company.name}`} width={64} height={64} className="rounded-lg border bg-white p-1" />
                        <div>
                            <CardTitle className="text-2xl">{company.name}</CardTitle>
                            <CardDescription>{company.sector}</CardDescription>
                        </div>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Building className="mr-2 h-4 w-4" /> Se connecter à {loginInfo.erpName}
                    </Button>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Mon Stage</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoCard label="Durée" value={internship.duration} />
                            <InfoCard label="Date de début" value={internship.startDate} />
                            <InfoCard label="Date de fin" value={internship.endDate} />
                            <InfoCard label="Type de contrat" value={internship.contractType} />
                        </CardContent>
                        <CardFooter className="flex-wrap gap-2">
                           {documents.map((doc) => (
                                <Button key={doc.name} variant="outline"><Download className="mr-2 h-4 w-4" /> {doc.name}</Button>
                           ))}
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ClipboardList /> Missions & Tâches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple" defaultValue={['m2']} className="w-full space-y-3">
                                {missions.map((mission) => (
                                    <AccordionItem key={mission.id} value={mission.id} className="border rounded-lg">
                                        <AccordionTrigger className="p-4 hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <MissionStatusIcon status={mission.status} />
                                                <h4 className="font-semibold">{mission.title}</h4>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <p className="text-sm text-muted-foreground mb-4">{mission.description}</p>
                                            <div className="space-y-2">
                                                {mission.tasks.map(task => (
                                                    <div key={task.id} className="flex items-center space-x-2">
                                                        <Checkbox id={`task-${task.id}`} checked={task.completed} />
                                                        <label htmlFor={`task-${task.id}`} className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                                                            {task.description}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User /> Encadrement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {supervisors.map(sup => (
                                <div key={sup.name} className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={sup.avatar} alt={sup.name} />
                                        <AvatarFallback>{getInitials(sup.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{sup.name}</p>
                                        <p className="text-xs text-muted-foreground">{sup.role}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Connexion à {loginInfo.erpName}</DialogTitle>
                        <DialogDescription>
                            Utilisez ces identifiants pour vous connecter à la plateforme de votre entreprise.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nom d'utilisateur</Label>
                            <div className="relative">
                                <Input id="username" value={loginInfo.username} readOnly />
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => copyToClipboard(loginInfo.username)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Input id="password" type={isPasswordVisible ? 'text' : 'password'} value={loginInfo.password} readOnly />
                                <Button variant="ghost" size="icon" className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => copyToClipboard(loginInfo.password || '')}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fermer</Button>
                        <Button asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">Se connecter</a>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EnterprisePage;
