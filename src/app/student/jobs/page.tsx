'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Bookmark,
  ChevronRight,
  Send,
  Eye,
  Trash2,
  ListFilter,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { jobOffers, jobFilters, type JobOffer, type JobFilter } from '@/lib/jobs-data';
import { applications, statusConfig, type Application, type ApplicationStatus } from '@/lib/applications-data';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const JobCard = ({ offer, onSelect }: { offer: JobOffer, onSelect: (offer: JobOffer) => void }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Image src={offer.companyLogo} alt={offer.company} width={48} height={48} className="rounded-lg border bg-white p-1" />
            <div>
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <CardDescription>{offer.company} - {offer.location}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className={cn(offer.isFavorite && 'text-yellow-400 fill-current')}>
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{offer.contractType}</Badge>
          <Badge variant="secondary">{offer.duration}</Badge>
          {offer.salary && <Badge variant="secondary">{offer.salary}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{offer.postedDate}</span>
        <Button size="sm" onClick={() => onSelect(offer)}>Voir l'offre <ChevronRight className="ml-1 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  );
};

const JobDetailsModal = ({ offer, onClose }: { offer: JobOffer | null; onClose: () => void }) => {
  if (!offer) return null;

  return (
    <Dialog open={!!offer} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
             <Image src={offer.companyLogo} alt={offer.company} width={56} height={56} className="rounded-lg border bg-white p-1" />
             <div>
                <DialogTitle className="text-2xl">{offer.title}</DialogTitle>
                <DialogDescription>{offer.company} - {offer.location}</DialogDescription>
             </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{offer.contractType}</Badge>
                <Badge variant="outline">{offer.duration}</Badge>
                {offer.salary && <Badge variant="outline">{offer.salary}</Badge>}
            </div>
            <div>
                <h4 className="font-semibold mb-2">Description du poste</h4>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
             <div>
                <h4 className="font-semibold mb-2">Missions principales</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {offer.missions.map((mission, index) => <li key={index}>{mission}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                    {offer.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button><Send className="mr-2 h-4 w-4" /> Postuler maintenant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ApplicationDetailsModal = ({ application, onClose }: { application: Application | null; onClose: () => void }) => {
    if (!application) return null;
    const currentStatus = statusConfig[application.status];

    return (
        <Dialog open={!!application} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                 <DialogHeader>
                    <DialogTitle>{application.jobTitle}</DialogTitle>
                    <DialogDescription>Candidature chez {application.company} du {application.date}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Statut actuel</h4>
                        <Badge variant="outline" className={currentStatus.color}>
                            <currentStatus.icon className="mr-2 h-4 w-4" />
                            {currentStatus.text}
                        </Badge>
                    </div>
                    {application.response && (
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Réponse de l'entreprise</CardTitle>
                                <CardDescription>Reçue le {application.response.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm italic">"{application.response.message}"</p>
                                {application.response.details && (
                                    <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-300">
                                        <p className="font-semibold">Détails :</p>
                                        <p>{application.response.details}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Fermer</Button>
                    <Button><Trash2 className="mr-2 h-4 w-4" />Retirer la candidature</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const JobOffersTab = () => {
    const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filtrer les offres</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <Input placeholder="Rechercher par mot-clé..." className="max-w-xs" />
                        {jobFilters.map(filter => (
                            <Button key={filter.id} variant="outline"><filter.icon className="mr-2 h-4 w-4"/>{filter.name}</Button>
                        ))}
                        <Button variant="ghost">Réinitialiser les filtres</Button>
                    </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobOffers.map(offer => (
                        <JobCard key={offer.id} offer={offer} onSelect={setSelectedOffer} />
                    ))}
                </div>
            </div>
            <JobDetailsModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        </>
    )
}

const ApplicationsTab = () => {
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    return (
        <>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Suivi de mes candidatures</CardTitle>
                    <CardDescription>Retrouvez ici toutes vos candidatures et leur état d'avancement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Entreprise</TableHead>
                                <TableHead>Poste</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map(app => {
                                const currentStatus = statusConfig[app.status];
                                return (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.company}</TableCell>
                                        <TableCell>{app.jobTitle}</TableCell>
                                        <TableCell>{app.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={currentStatus.color}>
                                                <currentStatus.icon className="mr-2 h-4 w-4" />
                                                {currentStatus.text}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedApplication(app)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ApplicationDetailsModal application={selectedApplication} onClose={() => setSelectedApplication(null)} />
        </>
    )
}


export default function JobsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Espace Carrière</CardTitle>
          <CardDescription>
            Découvrez des opportunités de stage et d'alternance qui correspondent à votre profil.
          </CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="offers">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offers"><Briefcase className="mr-2"/>Offres d'emploi</TabsTrigger>
            <TabsTrigger value="applications"><Send className="mr-2"/>Mes candidatures</TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="mt-6">
            <JobOffersTab />
        </TabsContent>
        <TabsContent value="applications">
            <ApplicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
