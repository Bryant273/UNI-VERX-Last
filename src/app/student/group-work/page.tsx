
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Clock,
  Paperclip,
  Send,
  UploadCloud,
  File as FileIcon,
  Download,
  Trash2,
  MoreVertical,
  CheckCircle,
  X,
  ListTodo,
  MessageSquare,
  User as UserIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { groupWorkData, type GroupWork, type Member, type Message, type SharedFile, type Mission, type Task } from '@/lib/group-work-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const MemberAvatar: React.FC<{ member: Member, size?: string }> = ({ member, size = 'h-10 w-10' }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <Avatar className={cn(size, member.isLeader ? 'border-2 border-primary' : '')}>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent>
                <p>{member.name}{member.isLeader && ' (Chef d\'équipe)'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const ChatTab: React.FC<{ project: GroupWork; currentUser: Member, onNewFile: (file: SharedFile) => void }> = ({ project, currentUser, onNewFile }) => {
    const [newMessage, setNewMessage] = useState('');
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState(project.messages);
    const { toast } = useToast();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStagedFile(e.target.files[0]);
        }
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '' && !stagedFile) return;

        let attachment: SharedFile | undefined = undefined;

        if (stagedFile) {
            attachment = {
                id: `file-${Date.now()}`,
                name: stagedFile.name,
                size: `${(stagedFile.size / 1024).toFixed(1)} KB`,
                uploadedBy: currentUser,
            };
            onNewFile(attachment);
        }

        const message: Message = {
            id: `msg-${messages.length + 1}`,
            author: currentUser,
            content: newMessage,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            attachment: attachment ? { name: attachment.name, size: attachment.size } : undefined,
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
        setStagedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        toast({ title: "Message envoyé !", variant: 'default' });
    };
    
    return (
        <Card className="flex flex-col h-full">
            <CardContent className="flex-1 overflow-y-auto space-y-4 pr-3 pt-6 max-h-[30rem]">
                {messages.map(msg => (
                    <div key={msg.id} className={cn('flex items-start gap-3', msg.author.id === currentUser.id ? 'justify-end' : '')}>
                        {msg.author.id !== currentUser.id && <MemberAvatar member={msg.author} size="h-8 w-8" />}
                        <div className={cn('max-w-xs md:max-w-md p-3 rounded-lg', msg.author.id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-sm font-semibold mb-1">{msg.author.name}</p>
                            {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                            {msg.attachment && (
                                <div className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-4 w-4" />
                                        <div className="text-xs">
                                            <p className="font-medium">{msg.attachment.name}</p>
                                            <p className="opacity-80">{msg.attachment.size}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                        </div>
                        {msg.author.id === currentUser.id && <MemberAvatar member={msg.author} size="h-8 w-8" />}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="pt-4 border-t flex-col items-start gap-2">
                {stagedFile && (
                    <div className="w-full flex items-center justify-between p-2 rounded-md border bg-muted/50">
                        <div className="flex items-center gap-2 text-xs">
                            <FileIcon className="h-4 w-4" />
                            <span>{stagedFile.name}</span>
                            <span className="text-muted-foreground">({(stagedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setStagedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}><X className="h-4 w-4"/></Button>
                    </div>
                )}
                <div className="flex w-full items-center space-x-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez un message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-4 w-4" /></Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                </div>
            </CardFooter>
        </Card>
    );
};

const FilesTab: React.FC<{ project: GroupWork, currentUser: Member, sharedFiles: SharedFile[] }> = ({ project, currentUser, sharedFiles }) => {
    const [currentProject, setCurrentProject] = useState(project);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const { toast } = useToast();

     const handleSubmitWork = () => {
        if (!stagedFile) return;
        toast({
            title: 'Travail soumis avec succès !',
            description: `Le fichier "${stagedFile.name}" a été envoyé.`,
            variant: 'default',
        });
        setCurrentProject(prev => ({
            ...prev,
            status: 'terminé',
            submission: {
                fileName: stagedFile.name,
                fileSize: `${(stagedFile.size / 1024).toFixed(1)} KB`,
                date: new Date().toLocaleDateString('fr-FR'),
            }
        }));
        setStagedFile(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStagedFile(e.target.files[0]);
        }
    };

    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fichiers partagés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sharedFiles.length > 0 ? sharedFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">Par {file.uploadedBy.name} • {file.size}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                        </div>
                    )) : (
                        <p className="text-sm text-center text-muted-foreground py-8">Aucun fichier partagé pour le moment.</p>
                    )}
                </CardContent>
            </Card>
            {currentUser.isLeader ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Rendu du travail</CardTitle>
                        {currentProject.submission && <CardDescription>Travail déjà soumis le {currentProject.submission.date}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {currentProject.submission ? (
                            <div className="flex items-center justify-between p-3 rounded-md border bg-green-50 dark:bg-green-900/20">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium">{currentProject.submission.fileName}</p>
                                        <p className="text-xs text-muted-foreground">{currentProject.submission.fileSize}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {stagedFile ? (
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-3">
                                            <FileIcon className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">{stagedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{`${(stagedFile.size / 1024).toFixed(1)} KB`}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setStagedFile(null)}><X className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                ) : (
                                    <div 
                                        className="p-6 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                                        onClick={() => document.getElementById('file-upload-td')?.click()}
                                    >
                                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">Glissez-déposez ou cliquez</p>
                                        <Input id="file-upload-td" type="file" className="hidden" onChange={handleFileSelect} />
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                    {!currentProject.submission && (
                        <CardFooter>
                            <Button className="w-full" onClick={handleSubmitWork} disabled={!stagedFile}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Confirmer et envoyer le rendu
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Rendu du travail</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Seul le chef d'équipe, <strong>{project.members.find(m => m.isLeader)?.name}</strong>, peut soumettre le rendu final.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const MissionsTab: React.FC<{ project: GroupWork, currentUser: Member }> = ({ project: initialProject, currentUser }) => {
    const [project, setProject] = useState(initialProject);

    const missionStatusConfig = {
        completed: { label: "Terminée", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> },
        'in-progress': { label: "En cours", color: "bg-blue-100 text-blue-800", icon: <Clock className="h-4 w-4" /> },
        pending: { label: "À faire", color: "bg-gray-100 text-gray-800", icon: <ListTodo className="h-4 w-4" /> }
    };
    
    const handleAssignTask = (missionId: string, taskId: string, member: Member | null) => {
        setProject(prevProject => {
            const newMissions = prevProject.missions.map(mission => {
                if (mission.id === missionId) {
                    const newTasks = mission.tasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, assignedTo: member || undefined };
                        }
                        return task;
                    });
                    return { ...mission, tasks: newTasks };
                }
                return mission;
            });
            return { ...prevProject, missions: newMissions };
        });
    }

    const toggleTaskCompletion = (missionId: string, taskId: string) => {
        setProject(prevProject => {
            const newMissions = prevProject.missions.map(mission => {
                if (mission.id === missionId) {
                    const newTasks = mission.tasks.map(task => {
                        if (task.id === taskId) {
                            return { ...task, completed: !task.completed };
                        }
                        return task;
                    });
                    return { ...mission, tasks: newTasks };
                }
                return mission;
            });
            return { ...prevProject, missions: newMissions };
        });
    }

    return (
        <Accordion type="multiple" defaultValue={['mission-1', 'mission-2']} className="w-full space-y-4">
            {project.missions.map(mission => {
                const status = missionStatusConfig[mission.status];
                const completedTasks = mission.tasks.filter(t => t.completed).length;
                const progress = (completedTasks / mission.tasks.length) * 100;
                
                return (
                    <AccordionItem key={mission.id} value={mission.id} className="border-0 bg-card rounded-xl shadow-sm">
                        <AccordionTrigger className="p-4 hover:no-underline">
                             <div className="flex items-center justify-between w-full">
                                <div className="flex-1 text-left">
                                    <h4 className="font-semibold">{mission.title}</h4>
                                    <p className="text-sm text-muted-foreground">Échéance: {mission.dueDate}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="w-32 hidden md:block">
                                        <Progress value={progress} className="h-2" />
                                        <p className="text-xs text-right text-muted-foreground mt-1">{Math.round(progress)}%</p>
                                     </div>
                                    <Badge className={status.color}>{status.icon}<span className="ml-2">{status.label}</span></Badge>
                                </div>
                             </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                            <div className="space-y-3 pl-4 border-l-2 ml-2">
                                {mission.tasks.map(task => (
                                    <div key={task.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => toggleTaskCompletion(mission.id, task.id)} className="mr-3" />
                                            <label htmlFor={`task-${task.id}`} className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>
                                                {task.title}
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {task.assignedTo ? <MemberAvatar member={task.assignedTo} size="h-6 w-6"/> : <div className="h-6 w-6 rounded-full bg-muted border flex items-center justify-center"><UserIcon className="h-3 w-3 text-muted-foreground"/></div>}
                                            {currentUser.isLeader && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4"/></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Assigner à</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {project.members.map(member => (
                                                            <DropdownMenuItem key={member.id} onSelect={() => handleAssignTask(mission.id, task.id, member)}>
                                                                <MemberAvatar member={member} size="h-5 w-5 mr-2"/> {member.name}
                                                            </DropdownMenuItem>
                                                        ))}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onSelect={() => handleAssignTask(mission.id, task.id, null)} className="text-destructive focus:text-destructive">
                                                            Désassigner
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}


const GroupWorkPage: React.FC = () => {
    const [project] = useState<GroupWork>(groupWorkData);
    const [sharedFiles, setSharedFiles] = useState<SharedFile[]>(project.sharedFiles);
    
    // Simulating current user - can be changed to test different views
    const currentUser: Member = project.members[0]; // Assuming current user is the leader for demo

    const handleNewFileFromChat = (file: SharedFile) => {
        setSharedFiles(prev => [...prev, file]);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <CardTitle className="text-2xl">{project.title}</CardTitle>
                            <CardDescription>Matière : {project.course} • Date limite : {project.deadline}</CardDescription>
                        </div>
                        <Badge className={cn('mt-2 md:mt-0', project.status === 'en cours' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>{project.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Progression du projet</p>
                        <Progress value={project.progress} className="h-2" />
                    </div>
                    <div>
                        <p className="text-sm font-medium mb-2">Membres de l'équipe</p>
                        <div className="flex items-center space-x-2">
                            {project.members.map(member => (
                                <MemberAvatar key={member.id} member={member} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="missions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="missions"><ListTodo className="mr-2"/>Missions & Tâches</TabsTrigger>
                    <TabsTrigger value="chat"><MessageSquare className="mr-2"/>Discussion</TabsTrigger>
                    <TabsTrigger value="files"><Paperclip className="mr-2"/>Fichiers & Rendu</TabsTrigger>
                </TabsList>
                <TabsContent value="missions" className="mt-6">
                    <MissionsTab project={project} currentUser={currentUser} />
                </TabsContent>
                <TabsContent value="chat" className="mt-6">
                    <ChatTab project={project} currentUser={currentUser} onNewFile={handleNewFileFromChat} />
                </TabsContent>
                <TabsContent value="files" className="mt-6">
                    <FilesTab project={project} currentUser={currentUser} sharedFiles={sharedFiles} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GroupWorkPage;

    