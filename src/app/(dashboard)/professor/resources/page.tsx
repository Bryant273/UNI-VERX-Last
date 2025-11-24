
'use client';

import React, { useState, useMemo } from 'react';
import {
  File as FileIcon,
  Folder,
  Plus,
  Search,
  SlidersHorizontal,
  FolderPlus,
  FileUp,
  Download,
  Eye,
  Trash2,
  Edit,
  Share2,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { allResources, resourceConfig, type Resource, type ResourceCategory } from '@/lib/resources-data';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string; }) => (
    <Card>
        <CardContent className="p-6">
        <div className="flex items-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${color.replace('text-', 'bg-').replace('-500', '-100 dark:bg-900/30')}`}>
                <Icon className={`text-xl ${color}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
        </CardContent>
    </Card>
);

export default function ProfessorResourcesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredResources = useMemo(() => {
        return allResources
            .filter(res => searchTerm === '' || res.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(res => subjectFilter === 'all' || res.subject === subjectFilter)
            .filter(res => categoryFilter === 'all' || res.category === categoryFilter);
    }, [searchTerm, subjectFilter, categoryFilter]);

    const paginatedResources = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredResources.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredResources, currentPage]);

    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

    const getCategoryTag = (category: ResourceCategory) => {
        const config = {
            course: { label: 'Cours', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
            exercise: { label: 'Exercice', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
            exam: { label: 'Examen', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
            correction: { label: 'Correction', className: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
            reference: { label: 'Référence', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
            '': { label: '', className: '' }
        };
        const catConfig = config[category];
        if (!catConfig || !catConfig.label) return null;
        return <Badge variant="outline" className={cn('border-0', catConfig.className)}>{catConfig.label}</Badge>
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total ressources" value={allResources.length} icon={FileIcon} color="text-blue-500" />
                <StatCard title="Téléchargements" value="1,428" icon={Download} color="text-green-500" />
                <StatCard title="Dossiers" value={allResources.filter(r => r.type === 'folder').length} icon={Folder} color="text-purple-500" />
                <StatCard title="Espace utilisé" value="124 MB" icon={HardDrive} color="text-amber-500" />
            </div>

            <Card>
                 <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle>Mes ressources pédagogiques</CardTitle>
                            <CardDescription>Gérez et partagez vos documents, vidéos et liens</CardDescription>
                        </div>
                         <div className="flex flex-wrap gap-3">
                            <Button variant="outline"><FolderPlus className="mr-2"/>Nouveau dossier</Button>
                            <Button><FileUp className="mr-2"/>Ajouter ressource</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input placeholder="Rechercher dans les ressources..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger><SelectValue placeholder="Toutes les matières"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les matières</SelectItem>
                                <SelectItem value="bdd">Bases de Données</SelectItem>
                                <SelectItem value="python">Programmation Python</SelectItem>
                                <SelectItem value="algo">Algorithmique</SelectItem>
                                <SelectItem value="web">Développement Web</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger><SelectValue placeholder="Toutes les catégories"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les catégories</SelectItem>
                                <SelectItem value="course">Cours</SelectItem>
                                <SelectItem value="exercise">Exercices/TD</SelectItem>
                                <SelectItem value="exam">Examens</SelectItem>
                                <SelectItem value="correction">Corrections</SelectItem>
                                <SelectItem value="reference">Références</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des ressources</CardTitle>
                    <CardDescription>{filteredResources.length} ressources trouvées</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Vues</TableHead>
                                <TableHead>Modifié le</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedResources.map(resource => {
                                const Icon = resourceConfig[resource.type].icon;
                                const color = resourceConfig[resource.type].color;
                                return (
                                    <TableRow key={resource.id} className="resource-row">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color.replace('text-','bg-').replace('-500','-100 dark:bg-900/30')}`}>
                                                    <Icon className={cn("h-5 w-5", color)} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{resource.name}</p>
                                                    {resource.description && <p className="text-xs text-muted-foreground">{resource.description}</p>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{resource.subject.toUpperCase()}</TableCell>
                                        <TableCell>{getCategoryTag(resource.category)}</TableCell>
                                        <TableCell>{resource.size}</TableCell>
                                        <TableCell>{resource.views > 0 ? resource.views : '-'}</TableCell>
                                        <TableCell>{resource.modified}</TableCell>
                                        <TableCell className="text-right">
                                             <TooltipProvider>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye/></Button></TooltipTrigger><TooltipContent><p>Aperçu</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Download/></Button></TooltipTrigger><TooltipContent><p>Télécharger</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Share2/></Button></TooltipTrigger><TooltipContent><p>Partager</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Edit/></Button></TooltipTrigger><TooltipContent><p>Modifier</p></TooltipContent></Tooltip>
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2/></Button></TooltipTrigger><TooltipContent><p>Supprimer</p></TooltipContent></Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Affichage de {paginatedResources.length} sur {filteredResources.length} ressources
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
