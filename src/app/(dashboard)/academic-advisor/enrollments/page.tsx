
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Download,
  Calendar,
  FileText,
  Eye,
  Redo,
  CheckCircle,
  Copy,
  Printer,
  Mail,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/messages-data';
import { newInscriptionsData, enrolledStudentsData, getStatusLabel, getStatusColor, type NewEnrollment, type EnrolledStudent } from '@/lib/enrollments-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.replace('text-', 'bg-').replace('-500', '-50 dark:bg-900/20'))}>
                    <Icon className={cn("text-xl", color)} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const NewInscriptionsTab = ({ onShowCredentials, onPrint, onNewInscription }: { onShowCredentials: (i: NewEnrollment) => void, onPrint: (i: NewEnrollment) => void, onNewInscription: () => void }) => {
    const [filter, setFilter] = useState('all');
    
    const filteredInscriptions = useMemo(() => {
        return newInscriptionsData.filter(i => filter === 'all' || i.level === filter);
    }, [filter]);

    const stats = useMemo(() => ({
        yearly: newInscriptionsData.filter(i => new Date(i.dateSubmitted).getFullYear() === new Date().getFullYear()).length,
        monthly: newInscriptionsData.filter(i => new Date(i.dateSubmitted).getMonth() === new Date().getMonth()).length,
        weekly: newInscriptionsData.filter(i => new Date(i.dateSubmitted) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    }), []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Cette année" value={stats.yearly} icon={Calendar} color="text-blue-500" />
                <StatCard title="Ce mois" value={stats.monthly} icon={Calendar} color="text-green-500" />
                <StatCard title="Cette semaine" value={stats.weekly} icon={Calendar} color="text-orange-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les niveaux</SelectItem>
                                <SelectItem value="L1">Licence 1</SelectItem>
                                <SelectItem value="L2">Licence 2</SelectItem>
                                <SelectItem value="L3">Licence 3</SelectItem>
                                <SelectItem value="M1">Master 1</SelectItem>
                                <SelectItem value="M2">Master 2</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button variant="outline"><Download className="mr-2"/>Exporter</Button>
                            <Button onClick={onNewInscription}><UserPlus className="mr-2"/>Nouvelle Inscription</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Formation</TableHead>
                                <TableHead>Établissement précédent</TableHead>
                                <TableHead>Date soumission</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInscriptions.map(inscription => (
                                <TableRow key={inscription.id}>
                                    <TableCell>
                                        <div className="font-medium">{inscription.firstName} {inscription.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{inscription.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{inscription.level}</div>
                                        <div className="text-xs text-muted-foreground">{inscription.program}</div>
                                    </TableCell>
                                    <TableCell>{inscription.previousSchool}</TableCell>
                                    <TableCell>{new Date(inscription.dateSubmitted).toLocaleDateString('fr-FR')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => onShowCredentials(inscription)}><FileText /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => onPrint(inscription)}><Printer /></Button>
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

const EnrolledStudentsTab = ({ onShowFile, onReinscribe }: { onShowFile: (s: EnrolledStudent) => void, onReinscribe: (s: EnrolledStudent) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    const filteredStudents = useMemo(() => {
        return enrolledStudentsData.filter(s => 
            (s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentNumber.includes(searchTerm)) &&
            (levelFilter === 'all' || s.currentLevel === levelFilter) &&
            (departmentFilter === 'all' || s.currentDepartment === departmentFilter)
        );
    }, [searchTerm, levelFilter, departmentFilter]);
    
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <Input placeholder="Nom, prénom, numéro..." className="max-w-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div className="flex gap-2">
                             <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Niveau" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous niveaux</SelectItem><SelectItem value="L1">L1</SelectItem><SelectItem value="L2">L2</SelectItem><SelectItem value="L3">L3</SelectItem><SelectItem value="M1">M1</SelectItem><SelectItem value="M2">M2</SelectItem></SelectContent>
                             </Select>
                             <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Département" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous départements</SelectItem><SelectItem value="informatique">Informatique</SelectItem><SelectItem value="mathematiques">Mathématiques</SelectItem></SelectContent>
                             </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead><TableHead>Numéro</TableHead>
                                <TableHead>Formation</TableHead><TableHead>Moyenne</TableHead>
                                <TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{student.email}</div>
                                    </TableCell>
                                    <TableCell>{student.studentNumber}</TableCell>
                                    <TableCell>
                                        <div>{student.currentLevel}</div>
                                        <div className="text-xs text-muted-foreground">{student.currentProgram}</div>
                                    </TableCell>
                                    <TableCell>{student.gpa}/20</TableCell>
                                    <TableCell><Badge variant="outline" className={cn('border-0', getStatusColor(student.canProgress))}>{getStatusLabel(student.canProgress)}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => onShowFile(student)}><Eye/></Button>
                                        <Button variant="ghost" size="icon" onClick={() => onReinscribe(student)}><Redo/></Button>
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

export default function EnrollmentsPage() {
    const [isNewInscriptionModalOpen, setIsNewInscriptionModalOpen] = useState(false);
    const [isReinscriptionModalOpen, setIsReinscriptionModalOpen] = useState(false);
    const [isStudentFileModalOpen, setIsStudentFileModalOpen] = useState(false);
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
    
    const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);
    const [newInscriptionData, setNewInscriptionData] = useState<NewEnrollment | null>(null);

    const handleShowCredentials = (inscription: NewEnrollment) => {
        setNewInscriptionData(inscription);
        setIsCredentialsModalOpen(true);
    };
    
    const handleShowFile = (student: EnrolledStudent) => {
        setSelectedStudent(student);
        setIsStudentFileModalOpen(true);
    };

    const handleReinscribe = (student: EnrolledStudent) => {
        setSelectedStudent(student);
        setIsReinscriptionModalOpen(true);
    };

    const handleNewInscription = () => setIsNewInscriptionModalOpen(true);

    return (
        <div className="space-y-6">
            <Tabs defaultValue="new">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="new"><UserPlus className="mr-2"/>Nouvelles Inscriptions</TabsTrigger>
                    <TabsTrigger value="enrolled"><Users className="mr-2"/>Étudiants Inscrits</TabsTrigger>
                </TabsList>
                <TabsContent value="new" className="mt-6">
                    <NewInscriptionsTab onShowCredentials={handleShowCredentials} onPrint={() => {}} onNewInscription={handleNewInscription} />
                </TabsContent>
                <TabsContent value="enrolled" className="mt-6">
                    <EnrolledStudentsTab onShowFile={handleShowFile} onReinscribe={handleReinscribe} />
                </TabsContent>
            </Tabs>
            
            {/* --- Modals --- */}
            {/* Add new student modal */}
            <Dialog open={isNewInscriptionModalOpen} onOpenChange={setIsNewInscriptionModalOpen}>
                {/* Content similar to HTML, to be implemented */}
            </Dialog>

            {/* Re-enroll student modal */}
            <Dialog open={isReinscriptionModalOpen} onOpenChange={setIsReinscriptionModalOpen}>
                {/* Content similar to HTML, to be implemented */}
            </Dialog>

             {/* Student File Modal */}
            <Dialog open={isStudentFileModalOpen} onOpenChange={setIsStudentFileModalOpen}>
               <DialogContent className="sm:max-w-3xl">
                  {selectedStudent && (
                    <>
                    <DialogHeader>
                      <DialogTitle>Dossier Étudiant: {selectedStudent.firstName} {selectedStudent.lastName}</DialogTitle>
                    </DialogHeader>
                    {/* Content will be generated based on student data */}
                    <div className="py-4">
                        <p>Détails pour {selectedStudent.firstName}...</p>
                    </div>
                    </>
                  )}
               </DialogContent>
            </Dialog>

            {/* Credentials Modal */}
            <Dialog open={isCredentialsModalOpen} onOpenChange={setIsCredentialsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    {newInscriptionData && (
                        <>
                        <DialogHeader>
                            <DialogTitle>Fiche d'inscription - {newInscriptionData.firstName} {newInscriptionData.lastName}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            {/* Simplified view */}
                             <p><strong>Identifiant:</strong> {newInscriptionData.loginId}</p>
                             <p><strong>Mot de passe temporaire:</strong> {newInscriptionData.password}</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline"><Printer className="mr-2"/>Imprimer</Button>
                            <Button><Mail className="mr-2"/>Envoyer par email</Button>
                        </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
