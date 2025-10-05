
'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Mail,
  XCircle,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { jobOffers, type JobOffer } from '@/lib/jobs-data';
import { applications, ApplicationStatus, statusConfig, type Application } from '@/lib/applications-data';
import Link from 'next/link';

const APPLICATIONS_PER_PAGE = 10;

const ApplicationDetailsModal = ({ application, offer, onClose }: { application: Application | null; offer: JobOffer | null; onClose: () => void }) => {
    if (!application || !offer) return null;

    const { icon: StatusIcon, color: statusColor, text: statusText } = statusConfig[application.status];
    
    return (
        <Dialog open={!!application} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl">
                 <DialogHeader>
                    <DialogTitle className="text-xl">Détails de la candidature</DialogTitle>
                    <DialogDescription>
                        Suivi de votre candidature pour le poste de <span className="font-semibold">{offer.title}</span> chez <span className="font-semibold">{offer.company}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 py-4">
                    {/* Section 1: Réponse de l'entreprise */}
                    <section>
                        <h3 className="font-semibold mb-3 text-lg">Réponse de l'entreprise</h3>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Statut</p>
                                        <Badge variant="outline" className={`mt-1 border-0 ${statusColor}`}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {statusText}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">Date de réponse</p>
                                        <p className="text-sm text-muted-foreground mt-1">{application.response.date}</p>
                                    </div>
                                </div>
                                <Separator className="my-4"/>
                                <p className="text-sm text-muted-foreground italic">
                                    {application.response.message}
                                </p>
                                {application.response.details && (
                                     <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-primary"/>
                                            <p className="text-sm font-semibold text-primary">{application.response.details}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Section 2: Votre candidature */}
                    <section>
                        <h3 className="font-semibold mb-3 text-lg">Votre candidature</h3>
                        <Card>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <p className="text-muted-foreground">Date d'envoi</p>
                                    <p className="font-medium">{application.date}</p>
                                </div>
                                <Separator/>
                                <div>
                                     <p className="text-sm font-medium text-muted-foreground mb-2">Documents envoyés</p>
                                     <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                             <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4"/>
                                                <span className="text-sm">CV_Sarah_Dupont.pdf</span>
                                             </div>
                                             <Button variant="ghost" size="sm" className="h-7">Voir</Button>
                                        </div>
                                         <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                             <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4"/>
                                                <span className="text-sm">Lettre_Motivation_TechSolutions.pdf</span>
                                             </div>
                                             <Button variant="ghost" size="sm" className="h-7">Voir</Button>
                                        </div>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                    
                    {/* Section 3: Rappel de l'offre */}
                    <section>
                         <h3 className="font-semibold mb-3 text-lg">Rappel de l'offre</h3>
                        <Card className="p-4 bg-muted/30">
                            <div className="flex items-center mb-4">
                                <Avatar className="h-12 w-12 rounded-lg">
                                    <AvatarImage src={offer.companyLogo} alt={`${offer.company} logo`} className="object-contain" />
                                    <AvatarFallback>{offer.company.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-base">{offer.title}</h4>
                                    <p className="text-sm text-muted-foreground">{offer.company} • {offer.location}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-3">{offer.description}</p>
                        </Card>
                    </section>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function ApplicationsPage() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => 
            app.jobTitle.toLowerCase().includes(search.toLowerCase()) || 
            app.company.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const totalPages = Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * APPLICATIONS_PER_PAGE,
        currentPage * APPLICATIONS_PER_PAGE
    );
    
    const selectedOffer = selectedApplication ? jobOffers.find(o => o.company === selectedApplication.company && o.title === selectedApplication.jobTitle) : null;

    const getStatusBadge = (status: ApplicationStatus) => {
        const config = statusConfig[status];
        if (!config) return <Badge>Inconnu</Badge>;
        const { text, icon: Icon, color } = config;
        return (
            <Badge variant="outline" className={`border-0 ${color}`}>
                <Icon className="h-3 w-3 mr-1" />
                {text}
            </Badge>
        );
    };

    return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
                <Link href="/student/jobs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux offres
                </Link>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Suivi de vos candidatures</CardTitle>
                <CardDescription>Retrouvez ici l'historique et le statut de toutes vos candidatures.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher par poste ou entreprise..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Entreprise</TableHead>
                                <TableHead>Poste</TableHead>
                                <TableHead>Date de candidature</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedApplications.map((app) => (
                                <TableRow key={app.id} className="even:bg-muted/40">
                                    <TableCell className="font-medium">{app.company}</TableCell>
                                    <TableCell>{app.jobTitle}</TableCell>
                                    <TableCell>{app.date}</TableCell>
                                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedApplication(app)}>
                                            <Eye className="mr-2 h-3 w-3" />
                                            Détails
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            {totalPages > 1 && (
                 <CardContent className="p-4 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Affichage de {paginatedApplications.length} sur {filteredApplications.length} candidatures
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
        
        {selectedApplication && (
           <ApplicationDetailsModal
                application={selectedApplication}
                offer={selectedOffer}
                onClose={() => setSelectedApplication(null)}
           />
        )}
    </div>
    );
}
