
'use client';

import React, { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Folder,
  File,
  Search,
  Filter,
  ArrowDownToLine,
  Eye,
  Trash2,
  Share2,
  ChevronRight,
  UploadCloud,
  X,
  GripVertical,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { allResources, filesInsideFolders, resourceConfig, type Resource, type ResourceType } from '@/lib/resources-data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ResourceIcon: React.FC<{ type: ResourceType }> = ({ type }) => {
  const config = resourceConfig[type] || { icon: File, color: 'text-gray-500' };
  const Icon = config.icon;
  return <Icon className={cn('h-5 w-5', config.color)} />;
};

const ResourcesPage = () => {
    const [path, setPath] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const currentFolderContent = useMemo(() => {
        if (path.length === 0) return allResources;
        const currentFolderKey = path[path.length - 1];
        return filesInsideFolders[currentFolderKey] || [];
    }, [path]);

    const filteredContent = useMemo(() => {
        return currentFolderContent.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [currentFolderContent, searchTerm]);

    const navigateTo = (folderName: string) => {
        setPath([...path, folderName]);
    };

    const navigateBack = (index: number) => {
        setPath(path.slice(0, index + 1));
    };
    
    const handleUpload = () => {
        toast({
            title: "Téléversement réussi !",
            description: "Votre fichier a été ajouté à la médiathèque.",
        });
    };

    const Breadcrumb = () => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => setPath([])} className="hover:text-primary">Médiathèque</button>
            {path.map((folder, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="h-4 w-4" />
                    <button onClick={() => navigateBack(index)} className="hover:text-primary capitalize">{folder}</button>
                </React.Fragment>
            ))}
        </div>
    );

    const GridView = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredContent.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => item.type === 'folder' && navigateTo(item.subject)}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-muted rounded-lg mb-3">
                           <ResourceIcon type={item.type} />
                        </div>
                        <p className="text-sm font-semibold truncate w-full">{item.name}</p>
                        {item.type === 'folder' 
                            ? <p className="text-xs text-muted-foreground">{item.fileCount} fichiers</p>
                            : <p className="text-xs text-muted-foreground">{item.size}</p>
                        }
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const ListView = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Dern. modif.</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredContent.map(item => (
                    <TableRow key={item.id} className="cursor-pointer" onClick={() => item.type === 'folder' && navigateTo(item.subject)}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <ResourceIcon type={item.type} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{item.type === 'folder' ? `${item.fileCount} fichiers` : item.size}</TableCell>
                        <TableCell>{item.modified}</TableCell>
                        <TableCell className="text-right">
                             <Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button>
                             <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
                             <Button variant="ghost" size="icon"><Share2 className="h-4 w-4"/></Button>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                    <div>
                        <CardTitle className="text-2xl">Médiathèque</CardTitle>
                        <CardDescription>Gérez toutes vos ressources pédagogiques en un seul endroit.</CardDescription>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button><UploadCloud className="mr-2 h-4 w-4"/> Téléverser un fichier</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Téléverser un fichier</DialogTitle></DialogHeader>
                            <div className="py-6 text-center border-2 border-dashed rounded-lg">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground"/>
                                <p className="mt-4 text-muted-foreground">Glissez-déposez ou cliquez pour choisir un fichier</p>
                                <Input type="file" className="hidden"/>
                            </div>
                            <Button className="w-full" onClick={handleUpload}>Envoyer</Button>
                        </DialogContent>
                     </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Breadcrumb />
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input placeholder="Rechercher..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                            </div>
                             <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                                {viewMode === 'grid' ? <List className="h-4 w-4"/> : <GripVertical className="h-4 w-4"/>}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    {filteredContent.length > 0 ? (
                        viewMode === 'grid' ? <GridView /> : <ListView />
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <Folder className="mx-auto h-16 w-16" />
                            <p className="mt-4 font-semibold">Ce dossier est vide.</p>
                            <p className="text-sm">Téléversez un fichier pour commencer.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResourcesPage;
