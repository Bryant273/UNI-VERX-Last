'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Download, Eye, Trash2, Plus, ChevronLeft, ChevronRight, FileUp, FileDown, Cog, Users, GraduationCap, BookOpen, Clock, Settings2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  exportTemplates,
  exportHistory,
  dataSources,
  type ExportTemplate,
  type ExportHistoryItem,
} from '@/lib/exports-data';

export default function ExportsPage() {
    const [selectedDataSource, setSelectedDataSource] = useState<string>('students');
    const [selectedFields, setSelectedFields] = useState<string[]>(dataSources.students.fields.filter(f => f.default).map(f => f.id));

    const handleFieldToggle = (fieldId: string) => {
        setSelectedFields(prev => 
            prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
        );
    }
    
    const currentDataSource = dataSources[selectedDataSource];

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Exports de Données</CardTitle>
                    <CardDescription>Générez des exports de données personnalisés au format CSV, PDF ou JSON.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Cog/> Configurer votre export</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold">1. Source de données</Label>
                                <p className="text-sm text-muted-foreground mb-3">Choisissez les données à exporter.</p>
                                <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(dataSources).map(([key, {label, icon: Icon}]) => (
                                            <SelectItem key={key} value={key}><div className="flex items-center gap-2"><Icon className="h-4 w-4"/>{label}</div></SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div>
                                <Label className="text-base font-semibold">2. Champs à inclure</Label>
                                <p className="text-sm text-muted-foreground mb-3">Sélectionnez les colonnes à inclure dans votre fichier.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border rounded-md">
                                    {currentDataSource.fields.map(field => (
                                        <div key={field.id} className="flex items-center space-x-2">
                                            <Checkbox id={`field-${field.id}`} checked={selectedFields.includes(field.id)} onCheckedChange={() => handleFieldToggle(field.id)} />
                                            <Label htmlFor={`field-${field.id}`} className="text-sm font-normal cursor-pointer">{field.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {currentDataSource.filters.length > 0 && (
                                <div>
                                    <Label className="text-base font-semibold">3. Filtres</Label>
                                    <p className="text-sm text-muted-foreground mb-3">Affinez votre sélection de données.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentDataSource.filters.map(filter => (
                                            <div key={filter.id}>
                                                 <Label htmlFor={`filter-${filter.id}`} className="text-sm">{filter.label}</Label>
                                                 <Select><SelectTrigger id={`filter-${filter.id}`}><SelectValue placeholder={filter.placeholder}/></SelectTrigger>
                                                 <SelectContent>
                                                    {filter.options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                 </SelectContent>
                                                 </Select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3">
                             <Button variant="outline">Sauvegarder le modèle</Button>
                             <Button><Download className="mr-2 h-4 w-4"/> Exporter (.csv)</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des exports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Fichier</TableHead><TableHead>Date</TableHead><TableHead>Demandeur</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {exportHistory.slice(0, 4).map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell><div className="font-medium">{item.filename}</div><div className="text-xs text-muted-foreground">{item.format} - {item.size}</div></TableCell>
                                            <TableCell>{item.date} {item.time}</TableCell>
                                            <TableCell>{item.requester}</TableCell>
                                            <TableCell className="text-right"><Button variant="ghost" size="icon"><Download/></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2/></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modèles d'exports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {exportTemplates.map(template => {
                                const Icon = template.icon;
                                return (
                                <button key={template.id} className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-primary"/>
                                        <div>
                                            <p className="font-medium text-sm">{template.title}</p>
                                            <p className="text-xs text-muted-foreground">{template.description}</p>
                                        </div>
                                    </div>
                                </button>
                            )})}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
