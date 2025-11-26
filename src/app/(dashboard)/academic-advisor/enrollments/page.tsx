
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
  ChevronDown
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
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


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

const EnrolledStudentsTab = ({ onShowFile, onOpenReinscription }: { onShowFile: (s: EnrolledStudent) => void, onOpenReinscription: () => void }) => {
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
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Input placeholder="Rechercher par nom, prénom, numéro étudiant..." className="md:max-w-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <div className="flex gap-2 flex-wrap w-full md:w-auto">
                             <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="flex-1 min-w-[150px]"><SelectValue placeholder="Niveau" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous niveaux</SelectItem><SelectItem value="L1">L1</SelectItem><SelectItem value="L2">L2</SelectItem><SelectItem value="L3">L3</SelectItem><SelectItem value="M1">M1</SelectItem><SelectItem value="M2">M2</SelectItem></SelectContent>
                             </Select>
                             <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="flex-1 min-w-[150px]"><SelectValue placeholder="Département" /></SelectTrigger>
                                <SelectContent><SelectItem value="all">Tous départements</SelectItem><SelectItem value="informatique">Informatique</SelectItem><SelectItem value="mathematiques">Mathématiques</SelectItem></SelectContent>
                             </Select>
                              <Button onClick={onOpenReinscription}><Redo className="mr-2 h-4 w-4"/>Réinscription</Button>
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

    const handleOpenReinscription = () => {
        setSelectedStudent(null);
        setIsReinscriptionModalOpen(true);
    };

    const handleNewInscription = () => setIsNewInscriptionModalOpen(true);
    
    const getNextLevel = (currentLevel: string) => {
        if (!currentLevel) return '';
        if (currentLevel.startsWith('L')) {
            const levelNum = parseInt(currentLevel.charAt(1));
            if (levelNum < 3) return `L${levelNum + 1}`;
            return 'M1';
        }
        if (currentLevel.startsWith('M')) {
            const levelNum = parseInt(currentLevel.charAt(1));
            if (levelNum < 2) return `M${levelNum + 1}`;
        }
        return 'Diplômé';
    }

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
                    <EnrolledStudentsTab onShowFile={handleShowFile} onOpenReinscription={handleOpenReinscription} />
                </TabsContent>
            </Tabs>
            
            {/* New Inscription Modal */}
            <Dialog open={isNewInscriptionModalOpen} onOpenChange={setIsNewInscriptionModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                     <DialogHeader>
                        <DialogTitle>Nouvelle Inscription</DialogTitle>
                        <DialogDescription>Remplir les informations de l'étudiant</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-semibold mb-4">Informations personnelles</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><Label>Prénom *</Label><Input name="firstName" required /></div>
                                <div><Label>Nom *</Label><Input name="lastName" required /></div>
                                <div><Label>Date de naissance *</Label><Input type="date" name="birthDate" required /></div>
                                <div><Label>Lieu de naissance *</Label><Input name="birthPlace" required /></div>
                                <div><Label>Email *</Label><Input type="email" name="email" required /></div>
                                <div><Label>Téléphone *</Label><Input type="tel" name="phone" required /></div>
                                <div className="md:col-span-2"><Label>Adresse *</Label><Textarea name="address" required /></div>
                            </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-semibold mb-4">Formation demandée</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><Label>Niveau *</Label><Select name="level" required><SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger><SelectContent><SelectItem value="L1">Licence 1</SelectItem><SelectItem value="M1">Master 1</SelectItem></SelectContent></Select></div>
                                <div><Label>Département *</Label><Select name="department" required><SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger><SelectContent><SelectItem value="informatique">Informatique</SelectItem><SelectItem value="mathematiques">Mathématiques</SelectItem></SelectContent></Select></div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsNewInscriptionModalOpen(false)}>Annuler</Button>
                            <Button type="submit">Enregistrer l'inscription</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Re-inscription Modal */}
            <Dialog open={isReinscriptionModalOpen} onOpenChange={setIsReinscriptionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Réinscription Étudiant</DialogTitle>
                        <DialogDescription>Recherchez un étudiant et confirmez son passage au niveau supérieur.</DialogDescription>
                    </DialogHeader>
                        <form className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Étudiant à réinscrire</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" className="w-full justify-between">
                                            {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : "Sélectionner un étudiant..."}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un étudiant..." />
                                            <CommandList>
                                                <CommandEmpty>Aucun étudiant trouvé.</CommandEmpty>
                                                <CommandGroup>
                                                    {enrolledStudentsData.map((student) => (
                                                        <CommandItem
                                                            key={student.id}
                                                            value={`${student.firstName} ${student.lastName}`}
                                                            onSelect={() => setSelectedStudent(student)}
                                                        >
                                                            {student.firstName} {student.lastName}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                             
                             {selectedStudent && (
                                <>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Informations de l'étudiant</h4>
                                        <p className="text-sm"><strong>Nom:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</p>
                                        <p className="text-sm"><strong>Niveau actuel:</strong> {selectedStudent.currentLevel}</p>
                                        <p className="text-sm"><strong>Moyenne:</strong> {selectedStudent.gpa}/20</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Nouvelle Formation</h4>
                                        <div>
                                            <Label>Nouveau niveau</Label>
                                            <Input value={getNextLevel(selectedStudent.currentLevel)} readOnly />
                                        </div>
                                    </div>
                                </>
                             )}

                             <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsReinscriptionModalOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={!selectedStudent}>Confirmer la réinscription</Button>
                            </DialogFooter>
                        </form>
                </DialogContent>
            </Dialog>

             {/* Student File Modal */}
            <Dialog open={isStudentFileModalOpen} onOpenChange={setIsStudentFileModalOpen}>
               <DialogContent className="sm:max-w-3xl">
                  {selectedStudent && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Dossier Étudiant</DialogTitle>
                            <DialogDescription>Année universitaire 2023-2024</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6 py-4">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20"><AvatarImage src={`https://i.pravatar.cc/80?img=${selectedStudent.id}`} /><AvatarFallback>{getInitials(`${selectedStudent.firstName} ${selectedStudent.lastName}`)}</AvatarFallback></Avatar>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                                    <p className="text-muted-foreground">N° {selectedStudent.studentNumber}</p>
                                    <p className="text-sm">{selectedStudent.currentLevel} {selectedStudent.currentProgram}</p>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Progression des crédits</h4>
                                    <Progress value={(selectedStudent.credits / selectedStudent.totalCredits) * 100} className="mb-2" />
                                    <p className="text-sm text-center">{selectedStudent.credits}/{selectedStudent.totalCredits} ECTS validés</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Moyenne & Statut</h4>
                                    <div className="flex justify-around">
                                        <div className="text-center"><p className="text-lg font-bold">{selectedStudent.gpa}/20</p><p className="text-xs">Moyenne</p></div>
                                        <div className="text-center"><Badge className={cn(getStatusColor(selectedStudent.canProgress))}>{getStatusLabel(selectedStudent.canProgress)}</Badge><p className="text-xs mt-1">Statut</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsStudentFileModalOpen(false)}>Fermer</Button>
                        </DialogFooter>
                    </>
                  )}
               </DialogContent>
            </Dialog>

            {/* Credentials Modal */}
            <Dialog open={isCredentialsModalOpen} onOpenChange={setIsCredentialsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    {newInscriptionData && (
                        <>
                        <DialogHeader>
                            <DialogTitle>Fiche d'inscription - {newInscriptionData.firstName} {newInscriptionData.lastName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p><strong>Formation:</strong> {newInscriptionData.level} - {newInscriptionData.program}</p>
                            <Separator/>
                            <div className="credentials-box p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Identifiants de connexion</h4>
                                <div className="space-y-2">
                                     <div className="flex items-center justify-between"><Label>Identifiant:</Label><code className="font-mono bg-background p-1 rounded">{newInscriptionData.loginId}</code></div>
                                     <div className="flex items-center justify-between"><Label>Mot de passe temporaire:</Label><code className="font-mono bg-background p-1 rounded">{newInscriptionData.password}</code></div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline"><Printer className="mr-2"/>Imprimer</Button>
                            <Button><Mail className="mr-2"/>Envoyer par email</Button>
                            <Button variant="secondary" onClick={() => setIsCredentialsModalOpen(false)}>Fermer</Button>
                        </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
