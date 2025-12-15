'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Download,
  UploadCloud,
  Pointer
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { semesterResults } from '@/lib/results-data';

export default function AdminMaquettesPage() {
    const [semesterFilter, setSemesterFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);

    const isFiltered = semesterFilter && classFilter;

    const programData = useMemo(() => {
        if (!isFiltered) return {};

        let courses = [];
        if (semesterFilter === 's1' || semesterFilter === 'annual') {
            courses.push(...semesterResults.s1.courses);
        }
        if (semesterFilter === 's2' || semesterFilter === 'annual') {
            courses.push(...semesterResults.s2.courses);
        }
        
        return courses.reduce((acc, course) => {
            if (!acc[course.ue]) {
                acc[course.ue] = [];
            }
            acc[course.ue].push(course);
            return acc;
        }, {} as Record<string, typeof semesterResults.s1.courses>);
    }, [semesterFilter, classFilter, isFiltered]);
    
    const handleAddModule = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding new module");
        setIsAddModuleModalOpen(false);
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                  <CardTitle>Gestion des Maquettes</CardTitle>
                  <CardDescription>Consultez, modifiez et validez les maquettes de programme pour toutes les filières.</CardDescription>
              </div>
               <div className="flex flex-wrap items-center gap-3">
                  <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Sélectionnez une filière" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="info-l3">Info L3</SelectItem>
                          <SelectItem value="math-l2">Math L2</SelectItem>
                      </SelectContent>
                   </Select>
                   <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Sélectionnez un semestre" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="annual">Annuel</SelectItem>
                          <SelectItem value="s1">Semestre 1</SelectItem>
                          <SelectItem value="s2">Semestre 2</SelectItem>
                      </SelectContent>
                   </Select>
                   <Button onClick={() => setIsAddModuleModalOpen(true)}><Plus className="mr-2 h-4 w-4"/> Ajouter un module</Button>
               </div>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 border-t pt-4">
            <p className="text-sm font-medium">Exportation</p>
            <p className="text-xs text-muted-foreground">Téléchargez la maquette pour la filière et la période sélectionnée.</p>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exporter la maquette (.pdf)</Button>
        </CardFooter>
      </Card>

      {isFiltered ? (
        <Accordion type="multiple" defaultValue={Object.keys(programData)} className="w-full space-y-4">
            {Object.entries(programData).map(([ue, courses]) => (
                <AccordionItem key={ue} value={ue} className="border-0">
                    <Card>
                        <AccordionTrigger className="p-6 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary"><BookOpen /></div>
                                <div>
                                    <h3 className="text-base font-semibold text-left">{ue}</h3>
                                    <p className="text-sm text-muted-foreground text-left">{courses.length} modules</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Module</TableHead>
                                            <TableHead>Crédits</TableHead>
                                            <TableHead>Syllabus</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses.map(course => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-medium">{course.module}</TableCell>
                                                <TableCell>{course.creditsToValidate}</TableCell>
                                                <TableCell>
                                                    <Button variant="link" className="p-0 h-auto">
                                                        Voir le syllabus
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit/></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2/></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            ))}
        </Accordion>
      ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed">
                <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Consulter les maquettes</h3>
                <p className="text-muted-foreground mt-2">Veuillez sélectionner une filière et un semestre pour afficher la maquette du programme.</p>
            </Card>
      )}

      <Dialog open={isAddModuleModalOpen} onOpenChange={setIsAddModuleModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter un nouveau module</DialogTitle>
                <DialogDescription>Remplissez les informations pour créer un nouveau module dans la maquette.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddModule} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="module-name">Nom du module</Label>
                    <Input id="module-name" placeholder="Ex: Systèmes d'Exploitation Avancés"/>
                </div>
                <div className="space-y-2">
                     <Label htmlFor="module-ue">Unité d'Enseignement (UE)</Label>
                    <Select>
                        <SelectTrigger id="module-ue"><SelectValue placeholder="Sélectionnez une UE" /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(programData).map(ue => <SelectItem key={ue} value={ue}>{ue}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="module-credits">Crédits ECTS</Label>
                    <Input id="module-credits" type="number" placeholder="Ex: 6"/>
                </div>
                <div className="space-y-2">
                     <Label htmlFor="module-syllabus">Syllabus (PDF)</Label>
                     <div className="p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-xs text-muted-foreground">Cliquez ou glissez-déposez le fichier</p>
                        <Input id="module-syllabus" type="file" className="hidden" />
                     </div>
                </div>
                 <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddModuleModalOpen(false)}>Annuler</Button>
                    <Button type="submit">Ajouter le module</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
