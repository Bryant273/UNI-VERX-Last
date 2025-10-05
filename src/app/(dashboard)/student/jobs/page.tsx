
'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Filter,
  SlidersHorizontal,
  Star,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Eye,
  Paperclip,
  CheckCircle,
  MoreHorizontal,
  ArrowRight,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { jobOffers, type JobOffer, jobFilters } from '@/lib/jobs-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { applications, ApplicationStatus, statusConfig } from '@/lib/applications-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const JOBS_PER_PAGE = 5;

export default function JobsPage() {
  const [offers, setOffers] = useState(jobOffers);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('offers');
  const [currentPage, setCurrentPage] = useState(1);

  const [cvFile, setCvFile] = useState<File | { name: string, date: string } | null>({ name: 'CV_Sarah_Dupont.pdf', date: 'il y a 2 jours' });
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => 
      offer.title.toLowerCase().includes(search.toLowerCase()) || 
      offer.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [offers, search]);
  
  const totalPages = Math.ceil(filteredOffers.length / JOBS_PER_PAGE);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOffers(offers.map(offer => offer.id === id ? { ...offer, isFavorite: !offer.isFavorite } : offer));
  }

  const openApplyModal = (e: React.MouseEvent | null, offer: JobOffer) => {
    e?.stopPropagation();
    setSelectedOffer(offer);
    setIsApplyModalOpen(true);
    // Reset files on open
    setCvFile({ name: 'CV_Sarah_Dupont.pdf', date: 'il y a 2 jours' });
    setCoverLetterFile(null);
  }

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
  
  const handleFileSelect = (fileList: FileList | null, type: 'cv' | 'coverLetter') => {
      if (fileList && fileList.length > 0) {
          if (type === 'cv') {
              setCvFile(fileList[0]);
          } else {
              setCoverLetterFile(fileList[0]);
          }
      }
  };
  
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <Button
                key={i}
                variant={currentPage === i ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(i)}
                className="h-8 w-8"
            >
                {i}
            </Button>
        );
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Espace Carrière</CardTitle>
          <CardDescription>Gérez votre avenir professionnel, de la recherche d'offres au suivi de vos candidatures.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="justify-start h-auto py-3" asChild>
                <Link href="#">
                    <GraduationCap className="h-6 w-6 mr-3 text-primary"/>
                    <div className="text-left">
                        <p className="font-semibold">Compléter mon profil</p>
                        <p className="text-xs text-muted-foreground">Profil complété à 85%</p>
                    </div>
                </Link>
            </Button>
            <Button variant="outline" size="lg" className="justify-start h-auto py-3" onClick={() => setActiveTab('applications')}>
                <ClipboardCheck className="h-6 w-6 mr-3 text-green-500"/>
                 <div className="text-left">
                    <p className="font-semibold">Mes candidatures</p>
                    <p className="text-xs text-muted-foreground">{applications.length} candidatures en cours</p>
                </div>
            </Button>
            <Button variant="outline" size="lg" className="justify-start h-auto py-3" asChild>
                <Link href="#">
                    <FileText className="h-6 w-6 mr-3 text-indigo-500"/>
                    <div className="text-left">
                        <p className="font-semibold">Gérer mes documents</p>
                        <p className="text-xs text-muted-foreground">CV, lettres de motivation...</p>
                    </div>
                </Link>
            </Button>
        </CardContent>
      </Card>
      
       <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="offers">
            <Search className="mr-2" /> Parcourir les offres
          </TabsTrigger>
          <TabsTrigger value="applications">
            <ClipboardCheck className="mr-2" /> Mes candidatures
          </TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="space-y-6 mt-6">
             <Card>
                <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher une offre, une entreprise..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {jobFilters.map(filter => (
                        <Select key={filter.id}>
                            <SelectTrigger className="w-full md:w-[150px]">
                            <div className="flex items-center gap-2">
                                {React.createElement(filter.icon, {className: "h-4 w-4"})}
                                <SelectValue placeholder={filter.name} />
                            </div>
                            </SelectTrigger>
                            <SelectContent>
                            {filter.options.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    ))}
                    <Button variant="outline"><SlidersHorizontal className="mr-2 h-4 w-4" />Plus de filtres</Button>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Poste</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Contrat</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {paginatedOffers.map((offer, index) => (
                        <TableRow key={offer.id} className="cursor-pointer even:bg-muted/40" onClick={() => setSelectedOffer(offer)}>
                             <TableCell className="font-medium">{(currentPage - 1) * JOBS_PER_PAGE + index + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-md">
                                        <AvatarImage src={offer.companyLogo} alt={`${offer.company} logo`} className="object-contain" />
                                        <AvatarFallback>{offer.company.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{offer.company}</span>
                                </div>
                            </TableCell>
                            <TableCell>{offer.title}</TableCell>
                            <TableCell>{offer.location}</TableCell>
                            <TableCell>{offer.contractType}</TableCell>
                            <TableCell>{offer.postedDate}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={(e) => toggleFavorite(e, offer.id)}>
                                    <Star className={cn(offer.isFavorite ? "text-yellow-500 fill-yellow-400" : "text-gray-400")} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedOffer(offer)}>
                                    <Eye />
                                </Button>
                                <Button size="sm" onClick={(e) => openApplyModal(e, offer)}>Postuler</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
                 <CardFooter className="p-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Affichage de {paginatedOffers.length} sur {filteredOffers.length} offres
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
                        {renderPagination()}
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
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="applications" className="space-y-6 mt-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Suivi de vos candidatures</CardTitle>
                </CardHeader>
                <CardContent>
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
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.company}</TableCell>
                                    <TableCell>{app.jobTitle}</TableCell>
                                    <TableCell>{app.date}</TableCell>
                                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>


      {selectedOffer && !isApplyModalOpen && (
        <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage src={selectedOffer.companyLogo} alt={`${selectedOffer.company} logo`} className="object-contain" />
                    <AvatarFallback>{selectedOffer.company.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedOffer.title}</DialogTitle>
                    <DialogDescription>{selectedOffer.company} • {selectedOffer.location}</DialogDescription>
                  </div>
              </div>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Contrat</p><p className="font-semibold">{selectedOffer.contractType}</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Durée</p><p className="font-semibold">{selectedOffer.duration}</p></div>
                <div className="bg-muted p-3 rounded-lg"><p className="text-xs text-muted-foreground">Salaire</p><p className="font-semibold">{selectedOffer.salary || 'N/A'}</p></div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description du poste</h3>
                <p className="text-sm text-muted-foreground">{selectedOffer.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Compétences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOffer.skills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                </div>
              </div>
               <div>
                <h3 className="font-semibold mb-2">Missions</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                   {selectedOffer.missions.map((mission, i) => <li key={i}>{mission}</li>)}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSelectedOffer(null)}>Fermer</Button>
              <Button onClick={() => { openApplyModal(null, selectedOffer); }}>Postuler</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedOffer && isApplyModalOpen && (
          <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Postuler à l'offre</DialogTitle>
                    <DialogDescription>{selectedOffer.title} chez {selectedOffer.company}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    
                    <div className="space-y-2">
                        <Label>CV</Label>
                        <Card className="p-3 bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-primary"/>
                                    <div>
                                        <p className="font-medium">{cvFile?.name}</p>
                                        {'date' in (cvFile || {}) && <p className="text-xs text-muted-foreground">Mis à jour { 'date' in cvFile ? cvFile.date : ''}</p>}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => document.getElementById('cv-upload')?.click()}>Changer</Button>
                                <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileSelect(e.target.files, 'cv')} />
                            </div>
                        </Card>
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="cover-letter-upload">Lettre de motivation (optionnel)</Label>
                        {coverLetterFile ? (
                             <Card className="p-3 bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-primary"/>
                                        <p className="font-medium">{coverLetterFile.name}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setCoverLetterFile(null)}><X className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ) : (
                            <Button variant="outline" className="w-full" onClick={() => document.getElementById('cover-letter-upload')?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Télécharger une lettre de motivation
                            </Button>
                        )}
                        <Input id="cover-letter-upload" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileSelect(e.target.files, 'coverLetter')} />
                    </div>

                     <div>
                        <Label htmlFor="cover-letter">Note personnalisée (optionnel)</Label>
                        <Textarea id="cover-letter" placeholder="Ajoutez un message pour le recruteur..." className="mt-2"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Annuler</Button>
                    <Button onClick={() => {
                        setIsApplyModalOpen(false);
                    }}>Envoyer ma candidature</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </div>
  );
}
