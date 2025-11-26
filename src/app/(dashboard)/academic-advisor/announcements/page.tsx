'use client';

import React, { useState, useMemo } from 'react';
import {
    Megaphone, Search, Plus, Eye, Copy, Trash2, ChevronLeft, ChevronRight, Send, CheckCircle, XCircle,
    Bell, Mail, MessageSquare, Tv
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { announcementsData, channelsConfig, audiencesConfig, type Announcement, type Channel, type Audience } from '@/lib/announcements-data';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.replace('text-', 'bg-').replace('-500', '-50 dark:bg-900/20'))}>
                    <Icon className={cn("text-xl", color)} />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function AnnouncementsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredAnnouncements = useMemo(() => {
        return announcementsData.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const paginatedAnnouncements = useMemo(() => {
        return filteredAnnouncements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredAnnouncements, currentPage]);

    const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Annonces" value={announcementsData.length} icon={Megaphone} color="text-blue-500" />
                <StatCard title="Audience Totale Touchée" value="12,5K+" icon={Users} color="text-green-500" />
                <StatCard title="Canal Principal" value="Email" icon={Mail} color="text-purple-500" />
                <StatCard title="En Brouillon" value={announcementsData.filter(a => a.status === 'draft').length} icon={Edit} color="text-amber-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Gestion des Annonces</CardTitle>
                            <CardDescription>Diffusez des informations importantes à toute la communauté universitaire.</CardDescription>
                        </div>
                        <Button onClick={() => setIsCreateModalOpen(true)}><Plus className="mr-2 h-4 w-4"/> Nouvelle Annonce</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher une annonce par titre..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Annonce</TableHead>
                                <TableHead>Audience</TableHead>
                                <TableHead>Canaux</TableHead>
                                <TableHead>Date d'envoi</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedAnnouncements.map(announcement => {
                                const statusConfig = announcement.status === 'sent' 
                                    ? { text: "Envoyée", color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300", icon: Send }
                                    : { text: "Brouillon", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300", icon: Edit };
                                
                                return (
                                <TableRow key={announcement.id} className="even:bg-muted/40">
                                    <TableCell className="font-medium">{announcement.title}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {announcement.audience.map(aud => <Badge key={aud} variant="secondary">{audiencesConfig[aud as Audience].label}</Badge>)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {announcement.channels.map(chan => {
                                                const Icon = channelsConfig[chan as Channel].icon;
                                                return <TooltipProvider key={chan}><Tooltip><TooltipTrigger asChild><Icon className="h-4 w-4 text-muted-foreground"/></TooltipTrigger><TooltipContent>{channelsConfig[chan as Channel].label}</TooltipContent></Tooltip></TooltipProvider>
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>{announcement.date || '-'}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn("border-0", statusConfig.color)}><statusConfig.icon className="h-3.5 w-3.5 mr-1.5"/>{statusConfig.text}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye /></Button></TooltipTrigger><TooltipContent>Aperçu</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Copy /></Button></TooltipTrigger><TooltipContent>Dupliquer</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 /></Button></TooltipTrigger><TooltipContent>Supprimer</TooltipContent></Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4 border-t">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedAnnouncements.length} sur {filteredAnnouncements.length} annonces</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
            
            {isCreateModalOpen && <CreateAnnouncementModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />}
        </div>
    );
}

const CreateAnnouncementModal = ({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) => {
    const [step, setStep] = useState(1);
    
    return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle annonce</DialogTitle>
                    <DialogDescription>Étape {step} sur 3: {step === 1 ? 'Contenu' : step === 2 ? 'Audience et Canaux' : 'Aperçu et Envoi'}</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-4 -mr-2">
                    {step === 1 && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="announcement-title">Titre de l'annonce</Label>
                                <Input id="announcement-title" placeholder="Ex: Fermeture exceptionnelle du campus" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="announcement-content">Contenu de l'annonce</Label>
                                <Textarea id="announcement-content" rows={12} placeholder="Rédigez votre message ici..." />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6 py-4">
                            <div>
                                <h4 className="font-semibold mb-3">Audience</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(audiencesConfig).map(([key, {label}]) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox id={`aud-${key}`} />
                                            <Label htmlFor={`aud-${key}`}>{label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-3">Canaux de diffusion</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {Object.entries(channelsConfig).map(([key, {label, icon: Icon}]) => (
                                         <div key={key} className="flex items-center space-x-2">
                                            <Checkbox id={`chan-${key}`} />
                                            <Label htmlFor={`chan-${key}`} className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground"/>{label}</Label>
                                        </div>
                                     ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-6 py-4">
                            <div>
                                <h4 className="font-semibold mb-2">Aperçu</h4>
                                <div className="p-4 border rounded-lg bg-muted/50">
                                    <h5 className="font-bold">Fermeture exceptionnelle du campus</h5>
                                    <p className="text-sm mt-2">En raison des conditions météorologiques, le campus sera fermé demain, le 28 mai 2025. Tous les cours sont annulés.</p>
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Récapitulatif</h4>
                                <p className="text-sm"><strong>Audience:</strong> Tous les étudiants, Tous les professeurs</p>
                                <p className="text-sm"><strong>Canaux:</strong> Plateforme, Email</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="border-t pt-4">
                    {step > 1 && <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Précédent</Button>}
                    <div className="flex-grow"></div>
                    {step < 3 && <Button onClick={() => setStep(s => s + 1)}>Suivant</Button>}
                    {step === 3 && <Button onClick={onClose}><Send className="mr-2 h-4 w-4"/>Envoyer l'annonce</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
