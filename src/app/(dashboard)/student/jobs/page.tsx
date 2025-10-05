
'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Pen,
  Upload,
  Eye,
  Paperclip,
  CheckCircle,
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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { jobOffers, type JobOffer, jobFilters } from '@/lib/jobs-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


const JobCard = ({ offer, onSelect, onApply, onToggleFavorite }: { offer: JobOffer, onSelect: () => void, onApply: (e: React.MouseEvent) => void, onToggleFavorite: (e: React.MouseEvent) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={offer.companyLogo} alt={`${offer.company} logo`} className="object-contain" />
              <AvatarFallback>{offer.company.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h4 className="text-base font-semibold">{offer.title}</h4>
              <p className="text-sm text-muted-foreground">{offer.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onToggleFavorite}>
            <Star className={offer.isFavorite ? "text-yellow-500 fill-yellow-400" : "text-gray-400"} />
          </Button>
        </div>

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center"><MapPin className="w-4 mr-2" />{offer.location}</div>
          <div className="flex items-center"><Clock className="w-4 mr-2" />{offer.contractType} - {offer.duration}</div>
          {offer.salary && <div className="flex items-center text-green-600 font-medium"><Briefcase className="w-4 mr-2" />{offer.salary}</div>}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {offer.skills.slice(0, 3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{offer.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{offer.postedDate}</span>
          <Button size="sm" onClick={onApply}>Postuler</Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default function JobsPage() {
  const [offers, setOffers] = useState(jobOffers);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const searchTermMatch = offer.title.toLowerCase().includes(search.toLowerCase()) || offer.company.toLowerCase().includes(search.toLowerCase());
      if (!searchTermMatch) return false;

      return Object.entries(activeFilters).every(([key, values]) => {
        if (values.length === 0) return true;
        // @ts-ignore
        return values.includes(offer[key]);
      });
    });
  }, [offers, search, activeFilters]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOffers(offers.map(offer => offer.id === id ? { ...offer, isFavorite: !offer.isFavorite } : offer));
  }

  const openApplyModal = (e: React.MouseEvent, offer: JobOffer) => {
    e.stopPropagation();
    setSelectedOffer(offer);
    setIsApplyModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Espace Carrière</CardTitle>
          <CardDescription>Trouvez votre prochain stage, alternance ou premier emploi.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Profil Candidat</p>
                <p className="font-semibold">Complété à 85%</p>
              </div>
            </div>
             <div className="flex items-center space-x-4">
              <ClipboardCheck className="h-10 w-10 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Candidatures</p>
                <p className="font-semibold">4 actives</p>
              </div>
            </div>
             <div className="flex items-center space-x-4">
              <FileText className="h-10 w-10 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="font-semibold">CV & Lettre de motivation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map(offer => (
          <JobCard 
            key={offer.id} 
            offer={offer} 
            onSelect={() => setSelectedOffer(offer)}
            onApply={(e) => openApplyModal(e, offer)}
            onToggleFavorite={(e) => toggleFavorite(e, offer.id)}
          />
        ))}
      </div>

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
              <Button onClick={() => { setSelectedOffer(null); openApplyModal({} as React.MouseEvent, selectedOffer); }}>Postuler</Button>
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
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Documents à joindre</Label>
                        <div className="space-y-2 mt-2">
                            <Card className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-primary"/>
                                        <div>
                                            <p className="font-medium">CV_Sarah_Dupont.pdf</p>
                                            <p className="text-xs text-muted-foreground">Mis à jour il y a 2 jours</p>
                                        </div>
                                    </div>
                                    <Checkbox defaultChecked />
                                </div>
                            </Card>
                            <Card className="p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-6 w-6 text-primary"/>
                                        <div>
                                            <p className="font-medium">Lettre_Motivation_Tech.pdf</p>
                                            <p className="text-xs text-muted-foreground">Mis à jour il y a 1 semaine</p>
                                        </div>
                                    </div>
                                    <Checkbox defaultChecked />
                                </div>
                            </Card>
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="cover-letter">Note personnalisée (optionnel)</Label>
                        <Textarea id="cover-letter" placeholder="Ajoutez un message pour le recruteur..." className="mt-2"/>
                    </div>
                     <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                            En postulant, vous confirmez que votre profil est à jour et que vous êtes disponible pour les dates indiquées.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Annuler</Button>
                    <Button onClick={() => {
                        setIsApplyModalOpen(false);
                        // In a real app, you would show a toast or confirmation here.
                    }}>Envoyer ma candidature</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
      )}

    </div>
  );
}
