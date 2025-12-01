
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
  X
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { groupWorkData, type GroupWork, type Member, type Message, type SharedFile } from '@/lib/group-work-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';

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

const GroupWorkPage: React.FC = () => {
    const [project, setProject] = useState<GroupWork>(groupWorkData);
    const [newMessage, setNewMessage] = useState('');
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Simulating current user - can be changed to test different views
    const currentUser: Member = project.members[0]; // Assuming current user is the leader for demo

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [project.messages]);
    
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const message: Message = {
            id: `msg-${project.messages.length + 1}`,
            author: currentUser,
            content: newMessage,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setProject(prev => ({ ...prev, messages: [...prev.messages, message] }));
        setNewMessage('');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setStagedFile(e.target.files[0]);
        }
    };
    
    const handleSubmitWork = () => {
        if (!stagedFile) return;
        toast({
            title: 'Travail soumis avec succès !',
            description: `Le fichier "${stagedFile.name}" a été envoyé.`,
            variant: 'default',
        });
        setProject(prev => ({
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Section */}
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>Discussion de groupe</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4 pr-3 max-h-[30rem]">
                        {project.messages.map(msg => (
                            <div key={msg.id} className={cn('flex items-start gap-3', msg.author.id === currentUser.id ? 'justify-end' : '')}>
                                {msg.author.id !== currentUser.id && <MemberAvatar member={msg.author} size="h-8 w-8" />}
                                <div className={cn('max-w-xs md:max-w-md p-3 rounded-lg', msg.author.id === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p className="text-sm font-semibold mb-1">{msg.author.name}</p>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                                </div>
                                {msg.author.id === currentUser.id && <MemberAvatar member={msg.author} size="h-8 w-8" />}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </CardContent>
                    <CardFooter className="pt-4 border-t">
                        <div className="flex w-full items-center space-x-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez un message..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                        </div>
                    </CardFooter>
                </Card>
                
                {/* Files & Submission Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fichiers partagés</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {project.sharedFiles.map(file => (
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
                            ))}
                        </CardContent>
                    </Card>

                    {currentUser.isLeader ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Rendu du travail</CardTitle>
                                {project.submission && <CardDescription>Travail déjà soumis le {project.submission.date}</CardDescription>}
                            </CardHeader>
                            <CardContent>
                                {project.submission ? (
                                    <div className="flex items-center justify-between p-3 rounded-md border bg-green-50 dark:bg-green-900/20">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium">{project.submission.fileName}</p>
                                                <p className="text-xs text-muted-foreground">{project.submission.fileSize}</p>
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
                            {!project.submission && (
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
            </div>
        </div>
    );
};

export default GroupWorkPage;
