'use client';

import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Users,
  Search,
  ChevronDown,
  ChevronsUpDown,
  Download,
  FileText,
  User as UserIcon,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Undo,
  Printer,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';
import StudentProfileModal from '@/components/students/student-profile-modal';
import { newInscriptionsData, enrolledStudentsData, getStatusColor, getStatusLabel } from '@/lib/enrollments-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle: string; }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
    </Card>
);


const NewInscriptionsTab = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Cette année" value="3" subtitle="+15% vs année préc." />
                <StatCard title="Ce mois" value="2" subtitle="En attente de validation" />
                <StatCard title="Cette semaine" value="1" subtitle="Nouvelle candidature" />
            </div>
            <Card>
                <CardHeader>
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Nouvelles inscriptions</CardTitle>
                            <CardDescription>Validez les nouvelles candidatures et créez les comptes étudiants.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exporter</Button>
                            <Button><UserPlus className="mr-2 h-4 w-4" /> Ajouter manuellement</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Formation demandée</TableHead>
                                <TableHead>Date de soumission</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newInscriptionsData.map(inscription => (
                                <TableRow key={inscription.id}>
                                    <TableCell>
                                        <div className="font-medium">{inscription.firstName} {inscription.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{inscription.email}</div>
                                    </TableCell>
                                    <TableCell>
                                         <div className="font-medium">{inscription.level} - {inscription.program}</div>
                                         <div className="text-xs text-muted-foreground">{inscription.department}</div>
                                    </TableCell>
                                    <TableCell>{inscription.dateSubmitted}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-green-600"><CheckCircle className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive"><XCircle className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

const EnrolledStudentsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const isFiltered = searchTerm || levelFilter || statusFilter;

    const filteredStudents = useMemo(() => {
        if (!isFiltered) return [];
        return enrolledStudentsData.filter(student =>
            (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             student.studentNumber.includes(searchTerm)) &&
            (!levelFilter || student.currentLevel === levelFilter) &&
            (!statusFilter || student.canProgress === (statusFilter === 'canProgress'))
        );
    }, [searchTerm, levelFilter, statusFilter, isFiltered]);

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Étudiants inscrits</CardTitle>
                    <CardDescription>Consultez et gérez les dossiers des étudiants actuels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Rechercher par nom, matricule..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Niveau"/></SelectTrigger>
                            <SelectContent><SelectItem value="">Tous les niveaux</SelectItem><SelectItem value="L1">L1</SelectItem><SelectItem value="L2">L2</SelectItem><SelectItem value="L3">L3</SelectItem><SelectItem value="M1">M1</SelectItem><SelectItem value="M2">M2</SelectItem></SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Statut"/></SelectTrigger>
                            <SelectContent><SelectItem value="">Tous les statuts</SelectItem><SelectItem value="canProgress">Peut progresser</SelectItem><SelectItem value="cannotProgress">Redoublement</SelectItem></SelectContent>
                        </Select>
                    </div>
                </CardContent>
                {isFiltered ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Formation</TableHead>
                                <TableHead>Moyenne</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{student.studentNumber}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{student.currentLevel}</div>
                                        <div className="text-xs text-muted-foreground">{student.currentProgram}</div>
                                    </TableCell>
                                    <TableCell className="font-semibold">{student.gpa}/20</TableCell>
                                    <TableCell><Badge variant="outline" className={getStatusColor(student.canProgress)}>{getStatusLabel(student.canProgress)}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon"><Undo className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-muted/50 border-2 border-dashed m-6">
                        <Pointer className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">Consulter les étudiants inscrits</h3>
                        <p className="text-muted-foreground mt-2">Veuillez utiliser la barre de recherche ou les filtres pour afficher la liste.</p>
                    </CardContent>
                )}
             </Card>
        </div>
    )
}


export default function AdminEnrollmentsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Inscriptions</CardTitle>
          <CardDescription>
            Traitez les nouvelles demandes d'inscription et gérez le statut des étudiants actuels.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="new-inscriptions">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-inscriptions"><UserPlus className="mr-2"/>Nouvelles Inscriptions (3)</TabsTrigger>
            <TabsTrigger value="enrolled-students"><Users className="mr-2"/>Étudiants Inscrits (4)</TabsTrigger>
        </TabsList>
        <TabsContent value="new-inscriptions" className="mt-6">
            <NewInscriptionsTab />
        </TabsContent>
        <TabsContent value="enrolled-students" className="mt-6">
            <EnrolledStudentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
