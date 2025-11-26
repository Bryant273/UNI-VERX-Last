
'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  FileCog,
  History,
  Search,
  ChevronRight,
  File,
  Users,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Settings,
  X,
  FileCheck2,
  ListFilter,
  CheckCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { exportHistory, exportTemplates, dataSources, type ExportHistoryItem, type DataSource } from '@/lib/exports-data';

const ITEMS_PER_PAGE = 5;

const GeneratorStep1 = ({ selectedDataSource, onSelectDataSource }: { selectedDataSource: string, onSelectDataSource: (ds: string) => void }) => (
    <div>
        <h3 className="font-semibold mb-4">1. Choisir la source de données</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dataSources).map(([key, { label, icon: Icon }]) => (
                 <Card 
                    key={key} 
                    className={cn(
                        "text-center p-4 cursor-pointer hover:border-primary",
                        selectedDataSource === key && "border-primary bg-primary/5"
                    )}
                    onClick={() => onSelectDataSource(key)}
                >
                    <Icon className="mx-auto h-8 w-8 text-primary mb-2"/>
                    <p className="text-sm font-medium">{label}</p>
                </Card>
            ))}
        </div>
    </div>
);

const GeneratorStep2 = ({ dataSource }: { dataSource: DataSource }) => (
    <div>
        <h3 className="font-semibold mb-4">2. Sélectionner les champs</h3>
        <p className="text-sm text-muted-foreground mb-4">Cochez les informations que vous souhaitez inclure dans l'export.</p>
        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/50">
            {dataSource.fields.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox id={`field-${field.id}`} defaultChecked={field.default} />
                    <Label htmlFor={`field-${field.id}`} className="text-sm font-normal">{field.label}</Label>
                </div>
            ))}
        </div>
    </div>
);

const GeneratorStep3 = ({ dataSource }: { dataSource: DataSource }) => (
     <div>
        <h3 className="font-semibold mb-4">3. Appliquer des filtres (optionnel)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSource.filters.map(filter => (
                 <div key={filter.id} className="space-y-1">
                    <Label htmlFor={`filter-${filter.id}`}>{filter.label}</Label>
                     <Select>
                        <SelectTrigger id={`filter-${filter.id}`}><SelectValue placeholder={filter.placeholder} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{filter.placeholder}</SelectItem>
                            {filter.options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            ))}
         </div>
    </div>
);

const GeneratorStep4 = () => (
     <div>
        <h3 className="font-semibold mb-4">4. Finaliser et Exporter</h3>
        <div className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="export-filename">Nom du fichier</Label>
                <Input id="export-filename" defaultValue={`export_etudiants_${new Date().toLocaleDateString('fr-CA')}`} />
            </div>
            <div className="space-y-1">
                <Label>Format</Label>
                 <Select defaultValue="csv">
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="csv">CSV (pour tableurs)</SelectItem>
                        <SelectItem value="json">JSON (pour développeurs)</SelectItem>
                        <SelectItem value="pdf">PDF (pour impression)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="save-template" />
                <Label htmlFor="save-template">Enregistrer comme modèle pour une utilisation future</Label>
            </div>
        </div>
    </div>
);


export default function ExportsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [generatorStep, setGeneratorStep] = useState(1);
    const [selectedDataSource, setSelectedDataSource] = useState<string>('students');

    const totalPages = Math.ceil(exportHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = exportHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const currentDataSource = dataSources[selectedDataSource as keyof typeof dataSources];

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Exports de Données</CardTitle>
                            <CardDescription>Créez des exports personnalisés ou utilisez des modèles prêts à l'emploi.</CardDescription>
                        </div>
                        <FileCog className="h-6 w-6 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <div>
                            <h3 className="font-semibold mb-4">Modèles d'exports rapides</h3>
                             <div className="space-y-3">
                                {exportTemplates.map(template => (
                                     <Card key={template.id} className="bg-muted/50 hover:bg-muted/80 transition-colors">
                                        <CardContent className="p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded-md border">
                                                    <template.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{template.title}</p>
                                                    <p className="text-xs text-muted-foreground">{template.description}</p>
                                                </div>
                                            </div>
                                            <Button size="sm"><Download className="mr-2 h-4 w-4" />Exporter</Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                         </div>
                        <div>
                             <h3 className="font-semibold mb-4">Générateur d'export personnalisé</h3>
                             <Card>
                                <CardContent className="p-6">
                                     <div className="relative mb-6">
                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10"></div>
                                        <div className="flex justify-between items-center relative">
                                            {[1,2,3,4].map(step => (
                                                <div key={step} className="flex flex-col items-center">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                                                        generatorStep >= step ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border"
                                                    )}>
                                                        {generatorStep > step ? <CheckCheck className="h-5 w-5"/> : step}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {generatorStep === 1 && <GeneratorStep1 selectedDataSource={selectedDataSource} onSelectDataSource={setSelectedDataSource} />}
                                    {generatorStep === 2 && <GeneratorStep2 dataSource={currentDataSource}/>}
                                    {generatorStep === 3 && <GeneratorStep3 dataSource={currentDataSource} />}
                                    {generatorStep === 4 && <GeneratorStep4 />}
                                </CardContent>
                                <CardFooter className="flex justify-between border-t p-4">
                                     <Button variant="ghost" onClick={() => setGeneratorStep(s => Math.max(1, s-1))} disabled={generatorStep === 1}>Précédent</Button>
                                     {generatorStep < 4 ? (
                                        <Button onClick={() => setGeneratorStep(s => Math.min(4, s+1))}>Suivant <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                     ) : (
                                        <Button><Download className="mr-2 h-4 w-4"/>Générer l'export</Button>
                                     )}
                                </CardFooter>
                             </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des exports</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Nom du fichier</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Demandeur</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedHistory.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.date}</div>
                                        <div className="text-xs text-muted-foreground">{item.time}</div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{item.filename}</TableCell>
                                    <TableCell><Badge variant="secondary">{item.format}</Badge></TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.requester}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm"><Download className="mr-2"/>Télécharger</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedHistory.length} sur {exportHistory.length} exports</p>
                    {totalPages > 1 && (
                         <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                            <span className="text-sm">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
