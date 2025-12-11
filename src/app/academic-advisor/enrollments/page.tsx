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
  Printer
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
                            <Input placeholder="Rechercher par nom, matricule..." className="pl-10" />
                        </div>
                        <Select><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Niveau"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les niveaux</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Statut"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
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
                        {enrolledStudentsData.map(student => (
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
             </Card>
        </div>
    )
}


export default function AcademicAdvisorEnrollmentsPage() {
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
