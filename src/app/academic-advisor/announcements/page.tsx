
'use client';
import React, { useState, useMemo } from 'react';
import { Megaphone, Plus, Send, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { useToast } from '@/hooks/use-toast';
import { announcementsData, channelsConfig, audiencesConfig, type Announcement } from '@/lib/announcements-data';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(announcementsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter(ann => ann.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [announcements, searchTerm]);

    const handleOpenModal = (ann: Announcement | null = null) => {
        setEditingAnnouncement(ann);
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const audience = (Object.keys(audiencesConfig) as Array<keyof typeof audiencesConfig>).filter(key => formData.get(key));
        const channels = (Object.keys(channelsConfig) as Array<keyof typeof channelsConfig>).filter(key => formData.get(key));
        
        const announcementData = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            audience,
            channels,
        };

        if (editingAnnouncement) {
            // Update
            setAnnouncements(prev => prev.map(ann => ann.id === editingAnnouncement.id ? {...ann, ...announcementData, status: 'draft'} : ann));
            toast({ title: 'Annonce modifiée', description: 'Le brouillon a été mis à jour.' });
        } else {
            // Create
            const newAnn: Announcement = {
                id: `ann-${Date.now()}`,
                ...announcementData,
                status: 'draft',
                date: null,
                author: 'M. Jean Moreau' // Should be dynamic
            };
            setAnnouncements(prev => [newAnn, ...prev]);
            toast({ title: 'Brouillon enregistré', description: 'Votre annonce a été sauvegardée.' });
        }
        setIsModalOpen(false);
    };
    
    const handleSend = () => {
        if (!editingAnnouncement) return;
        setAnnouncements(prev => prev.map(ann => ann.id === editingAnnouncement.id ? {...ann, status: 'sent', date: new Date().toLocaleDateString('fr-FR') } : ann));
        toast({ title: 'Annonce envoyée !', description: 'Votre annonce a été diffusée avec succès.' });
        setIsModalOpen(false);
    }
    
    const handleDelete = (id: string) => {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        toast({ title: 'Annonce supprimée', variant: 'destructive'});
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Gestion des Annonces</CardTitle>
                            <CardDescription>Diffusez des informations importantes à toute l'université.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <Plus className="mr-2 h-4 w-4"/> Nouvelle annonce
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Rechercher une annonce..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Date / Statut</TableHead>
                            <TableHead>Audience</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAnnouncements.map(ann => (
                            <TableRow key={ann.id}>
                                <TableCell className="font-medium">{ann.title}</TableCell>
                                <TableCell>
                                    {ann.status === 'sent' 
                                        ? <Badge variant="default">{ann.date}</Badge>
                                        : <Badge variant="outline">Brouillon</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {ann.audience.slice(0, 2).map(aud => (
                                            <Badge key={aud} variant="secondary">{audiencesConfig[aud].label}</Badge>
                                        ))}
                                        {ann.audience.length > 2 && <Badge variant="secondary">+{ann.audience.length - 2}</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setViewingAnnouncement(ann)}><Eye className="h-4 w-4"/></Button>
                                    {ann.status === 'draft' && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(ann)}><Edit className="h-4 w-4"/></Button>}
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ann.id)}><Trash2 className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl">
                     <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle>{editingAnnouncement ? 'Modifier l\'annonce' : 'Créer une annonce'}</DialogTitle>
                            <DialogDescription>Rédigez et configurez votre message.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                            <div className="md:col-span-2 space-y-4">
                                <Input name="title" placeholder="Titre de l'annonce" className="text-lg font-semibold" defaultValue={editingAnnouncement?.title} required />
                                <Textarea name="content" placeholder="Contenu de votre annonce..." rows={12} defaultValue={editingAnnouncement?.content} required />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3">Canaux de diffusion</h4>
                                    <div className="space-y-3">
                                        {Object.entries(channelsConfig).map(([key, {label, icon: Icon}]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox id={`channel-${key}`} name={key} defaultChecked={editingAnnouncement?.channels.includes(key as any)} />
                                                <Label htmlFor={`channel-${key}`} className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground"/> {label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                 <Separator />
                                 <div>
                                    <h4 className="font-semibold mb-3">Audience cible</h4>
                                    <ScrollArea className="h-48 pr-4">
                                        <div className="space-y-3">
                                            {Object.entries(audiencesConfig).map(([key, {label}]) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <Checkbox id={`audience-${key}`} name={key} defaultChecked={editingAnnouncement?.audience.includes(key as any)} />
                                                    <Label htmlFor={`audience-${key}`}>{label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                            <Button type="submit">Enregistrer en brouillon</Button>
                            {editingAnnouncement && <Button type="button" onClick={handleSend}><Send className="mr-2 h-4 w-4"/>Envoyer</Button>}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* View Modal */}
            <Dialog open={!!viewingAnnouncement} onOpenChange={() => setViewingAnnouncement(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{viewingAnnouncement?.title}</DialogTitle>
                        <DialogDescription>
                            Annonce envoyée le {viewingAnnouncement?.date} par {viewingAnnouncement?.author}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-md">{viewingAnnouncement?.content}</p>
                         <div>
                            <h4 className="font-semibold mb-2 text-sm">Canaux utilisés</h4>
                            <div className="flex flex-wrap gap-2">
                                {viewingAnnouncement?.channels.map(channel => <Badge key={channel} variant="outline">{channelsConfig[channel].label}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-2 text-sm">Audience ciblée</h4>
                            <div className="flex flex-wrap gap-2">
                                {viewingAnnouncement?.audience.map(aud => <Badge key={aud} variant="outline">{audiencesConfig[aud].label}</Badge>)}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewingAnnouncement(null)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AnnouncementsPage;
