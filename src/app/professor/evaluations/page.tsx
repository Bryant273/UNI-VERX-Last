'use client';

import React, { useState, useMemo } from 'react';
import {
  BookCheck,
  FileClock,
  ClipboardCheck,
  Plus,
  Trash2,
  FileText,
  Users,
  Eye,
  SlidersHorizontal,
  Clock,
  Send,
  Calendar,
  Upload,
  Paperclip,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  qcmList,
  devoirsList,
  groupWorksList,
  qcmStatusConfig,
  devoirStatusConfig,
  type QCM,
  type Devoir,
  type GroupWork,
} from '@/lib/evaluations-data';
import { studentData } from '@/lib/static-data';
import { studentsData as allStudents } from '@/lib/students-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { getInitials } from '@/lib/messages-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const QcmTab = () => {
  const { toast } = useToast();

  const handleCreateQCM = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Succès', description: 'QCM créé et sauvegardé comme brouillon.' });
  };

  return (
    <div className="mt-6 space-y-6">
       <Dialog>
        <DialogTrigger asChild>
            <Button><Plus className="mr-2"/>Créer un nouveau QCM</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader><DialogTitle>Création d'un QCM</DialogTitle><DialogDescription>Configurez votre QCM, ajoutez vos questions, et publiez-le.</DialogDescription></DialogHeader>
          <form onSubmit={handleCreateQCM}>
            <ScrollArea className="max-h-[70vh] p-1">
            <div className="space-y-6 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="qcm-title">Titre du QCM</Label>
                        <Input id="qcm-title" placeholder="Ex: QCM de mi-semestre" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="qcm-course">Matière</Label>
                        <Select name="qcm-course" required>
                            <SelectTrigger><SelectValue placeholder="Sélectionnez une matière..."/></SelectTrigger>
                            <SelectContent>
                               <SelectItem value="bdd">Bases de Données</SelectItem>
                               <SelectItem value="python">Programmation Python</SelectItem>
                               <SelectItem value="algo">Algorithmique</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Banque de questions (50 questions)</Label>
                    <div className="p-4 border-dashed border-2 rounded-lg text-center bg-muted/50">
                        <p className="text-sm text-muted-foreground">Ici, l'interface permettrait d'ajouter et de modifier 50 questions avec leurs réponses. Pour la démo, nous simulons que cette banque est prête.</p>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Paramètres de l'évaluation</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" placeholder="Nb. de questions par étudiant (ex: 20)" />
                        <Input type="number" placeholder="Durée en minutes (ex: 15)" />
                    </div>
                </div>
            </div>
            </ScrollArea>
             <DialogFooter className="pt-4 mt-4 border-t">
              <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
              <Button type="submit">Sauvegarder en brouillon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader><CardTitle>Liste des QCM</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Matière</TableHead><TableHead>Titre</TableHead><TableHead>Date</TableHead><TableHead>Participation</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {qcmList.map(qcm => {
                const status = qcmStatusConfig[qcm.status];
                return (
                  <TableRow key={qcm.id}>
                    <TableCell className="font-medium">{qcm.course}</TableCell>
                    <TableCell>{qcm.title}</TableCell>
                    <TableCell>{qcm.date}</TableCell>
                    <TableCell>{qcm.participants}/{qcm.totalStudents}</TableCell>
                    <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye/></Button></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const DevoirsTab = () => {
    return (
        <div className="mt-6 space-y-6">
            <Button><Plus className="mr-2"/>Créer un nouveau devoir</Button>
            <Card>
                <CardHeader><CardTitle>Liste des devoirs</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Matière</TableHead><TableHead>Titre</TableHead><TableHead>Date limite</TableHead><TableHead>Soumissions</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {devoirsList.map(devoir => {
                                const status = devoirStatusConfig[devoir.status];
                                return (
                                    <TableRow key={devoir.id}>
                                        <TableCell className="font-medium">{devoir.course}</TableCell>
                                        <TableCell>{devoir.title}</TableCell>
                                        <TableCell>{devoir.deadline}</TableCell>
                                        <TableCell>{devoir.submissions}/{devoir.totalStudents}</TableCell>
                                        <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye/></Button></TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

const GroupWorkTab = () => {
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
        );
    }
    
    return (
         <div className="mt-6 space-y-6">
            <Dialog>
                <DialogTrigger asChild><Button><Plus className="mr-2"/>Créer un nouveau travail de groupe</Button></DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader><DialogTitle>Nouveau Travail de Groupe</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <Input placeholder="Titre du projet"/>
                             <Select><SelectTrigger><SelectValue placeholder="Matière associée"/></SelectTrigger><SelectContent><SelectItem value="projet-m1">Projet M1</SelectItem></SelectContent></Select>
                            <Textarea placeholder="Description du projet et consignes..." rows={10}/>
                             <div className="space-y-2">
                                <Label htmlFor="file-upload">Fichiers joints</Label>
                                <Input id="file-upload" type="file" multiple/>
                             </div>
                        </div>
                         <div className="space-y-4">
                           <h4 className="font-semibold">Constitution des groupes</h4>
                            <ScrollArea className="h-96 border rounded-md p-2">
                                <div className="p-2 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                                   <Input placeholder="Rechercher un étudiant..."/>
                                </div>
                                <div className="space-y-2 p-2">
                                {allStudents.slice(0,30).map(student => (
                                    <div key={student.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8"><AvatarImage src={student.photo}/><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                            <span className="text-sm">{student.name}</span>
                                        </div>
                                        <Checkbox checked={selectedStudents.includes(student.studentId)} onCheckedChange={() => handleSelectStudent(student.studentId)}/>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                            <div className="text-sm text-muted-foreground">{selectedStudents.length} étudiant(s) sélectionné(s).</div>
                            <Button variant="outline" size="sm">Créer un groupe</Button>
                         </div>
                    </div>
                     <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">Annuler</Button></DialogClose>
                        <Button>Créer et assigner</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Card>
                <CardHeader><CardTitle>Liste des travaux de groupe</CardTitle></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Projet</TableHead><TableHead>Matière</TableHead><TableHead>Date limite</TableHead><TableHead>Groupes</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {groupWorksList.map(work => (
                                <TableRow key={work.id}>
                                    <TableCell className="font-medium">{work.title}</TableCell>
                                    <TableCell>{work.course}</TableCell>
                                    <TableCell>{work.deadline}</TableCell>
                                    <TableCell>{work.groupsCount}</TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye/></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ProfessorEvaluationsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Évaluations</CardTitle>
          <CardDescription>Créez, gérez et suivez les QCM, devoirs et travaux de groupe pour vos classes.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="qcm" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="qcm"><ClipboardCheck className="mr-2"/>QCM</TabsTrigger>
          <TabsTrigger value="devoirs"><FileClock className="mr-2"/>Devoirs</TabsTrigger>
          <TabsTrigger value="group-work"><Users className="mr-2"/>TD de Groupe</TabsTrigger>
        </TabsList>
        <TabsContent value="qcm"><QcmTab/></TabsContent>
        <TabsContent value="devoirs"><DevoirsTab/></TabsContent>
        <TabsContent value="group-work"><GroupWorkTab/></TabsContent>
      </Tabs>
    </div>
  );
}
