'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Users,
  AlertTriangle,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Bell,
  Plus,
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
import { Progress } from '@/components/ui/progress';
import { getInitials } from '@/lib/messages-data';
import { scholarshipsData, getStatusConfig, type StudentPayment } from '@/lib/scholarships-data';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, subtitle, icon: Icon, color }: { title: string; value: string; subtitle: string; icon: React.ElementType; color: string; }) => (
    <Card>
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                 <CardTitle className="text-sm font-medium">{title}</CardTitle>
                 <Icon className={`h-5 w-5 ${color}`} />
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
    </Card>
);

export default function AdminScholarshipsPage() {
    const [students, setStudents] = useState<StudentPayment[]>(scholarshipsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentModalStudent, setPaymentModalStudent] = useState<StudentPayment | null>(null);
    const { toast } = useToast();

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.includes(searchTerm)) &&
            (classFilter === 'all' || student.class.includes(classFilter)) &&
            (statusFilter === 'all' || student.status === statusFilter)
        );
    }, [students, searchTerm, classFilter, statusFilter]);

    const stats = useMemo(() => {
        const totalAmount = students.reduce((acc, s) => acc + s.totalAmount, 0);
        const paidAmount = students.reduce((acc, s) => acc + s.paidAmount, 0);
        const lateCount = students.filter(s => s.status === 'late').length;
        const totalStudents = students.length;
        return {
            total: totalAmount.toLocaleString('fr-FR') + ' FCFA',
            paid: paidAmount.toLocaleString('fr-FR') + ' FCFA',
            remaining: (totalAmount - paidAmount).toLocaleString('fr-FR') + ' FCFA',
            late: lateCount,
            totalStudents: totalStudents,
        };
    }, [students]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const paginatedStudents = useMemo(() => {
        return filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);

    const handleSendReminder = (studentName: string) => {
        toast({
            title: 'Rappel envoyé !',
            description: `Un rappel de paiement a été envoyé à ${studentName}.`,
        });
    };
    
    const handleRegisterPayment = (studentId: string, amount: number) => {
        setStudents(prev => prev.map(s => {
            if(s.id.toString() === studentId) {
                const newPaidAmount = s.paidAmount + amount;
                let newStatus: 'paid' | 'partial' = 'partial';
                if(newPaidAmount >= s.totalAmount) newStatus = 'paid';
                
                return { ...s, paidAmount: newPaidAmount, status: newStatus, lastPaymentDate: new Date().toISOString().split('T')[0] };
            }
            return s;
        }));
        setPaymentModalStudent(null);
        toast({ title: 'Paiement enregistré !', description: `Le paiement de ${amount.toLocaleString('fr-FR')} FCFA a bien été enregistré.` });
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Montant Total Attendu" value={stats.total} subtitle={`${stats.totalStudents} étudiants`} icon={DollarSign} color="text-blue-500" />
                <StatCard title="Total Perçu" value={stats.paid} subtitle="Paiements enregistrés" icon={Users} color="text-green-500" />
                <StatCard title="Solde Restant" value={stats.remaining} subtitle="À recouvrer" icon={FileText} color="text-purple-500" />
                <StatCard title="Paiements en Retard" value={stats.late.toString()} subtitle="Étudiants à relancer" icon={AlertTriangle} color="text-red-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Suivi de la scolarité</CardTitle>
                            <CardDescription>Consultez et gérez les paiements des étudiants.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Rechercher par nom ou matricule..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={classFilter} onValueChange={setClassFilter}><SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Toutes les classes"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les classes</SelectItem><SelectItem value="L1">Licence 1</SelectItem><SelectItem value="L2">Licence 2</SelectItem><SelectItem value="L3">Licence 3</SelectItem><SelectItem value="M1">Master 1</SelectItem><SelectItem value="M2">Master 2</SelectItem></SelectContent></Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Tous les statuts"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem><SelectItem value="paid">Payé</SelectItem><SelectItem value="partial">Partiel</SelectItem><SelectItem value="late">En retard</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Progression</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map(student => {
                                const status = getStatusConfig(student.status);
                                const progress = Math.min(100, Math.round((student.paidAmount / student.totalAmount) * 100));
                                return (
                                    <TableRow key={student.id} className="even:bg-muted/40">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10"><AvatarImage src={student.avatar} /><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={progress} className="w-24 h-2" />
                                                <span className="text-xs font-mono text-muted-foreground">{progress}%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{student.paidAmount.toLocaleString('fr-FR')} / {student.totalAmount.toLocaleString('fr-FR')} FCFA</p>
                                        </TableCell>
                                        <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => setPaymentModalStudent(student)}><Plus className="h-4 w-4"/></Button>
                                            {student.status === 'late' && <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleSendReminder(student.name)}><Bell className="h-4 w-4"/></Button>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedStudents.length} sur {filteredStudents.length} étudiants</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="icon" className="h-8 w-8" onClick={() => setCurrentPage(page)}>{page}</Button>
                            ))}
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={!!paymentModalStudent} onOpenChange={() => setPaymentModalStudent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enregistrer un paiement</DialogTitle>
                        <DialogDescription>Pour {paymentModalStudent?.name} ({paymentModalStudent?.studentId})</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const amount = parseFloat((e.target as HTMLFormElement).amount.value);
                        if (paymentModalStudent && amount > 0) {
                            handleRegisterPayment(paymentModalStudent.id.toString(), amount);
                        }
                    }}>
                        <div className="py-4 space-y-4">
                            <div className="text-sm">
                                <p>Total à payer: <span className="font-semibold">{paymentModalStudent?.totalAmount.toLocaleString('fr-FR')} FCFA</span></p>
                                <p>Déjà payé: <span className="font-semibold">{paymentModalStudent?.paidAmount.toLocaleString('fr-FR')} FCFA</span></p>
                                <p>Solde restant: <span className="font-semibold text-red-600">{(paymentModalStudent?.totalAmount ?? 0 - (paymentModalStudent?.paidAmount ?? 0)).toLocaleString('fr-FR')} FCFA</span></p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Montant du versement</Label>
                                <Input id="amount" name="amount" type="number" placeholder="ex: 500000" required/>
                            </div>
                            <div className="space-y-2">
                                 <Label htmlFor="method">Méthode de paiement</Label>
                                 <Select name="method" defaultValue="cash">
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Espèces</SelectItem>
                                        <SelectItem value="cheque">Chèque</SelectItem>
                                        <SelectItem value="transfer">Virement bancaire</SelectItem>
                                        <SelectItem value="mobile">Paiement mobile</SelectItem>
                                    </SelectContent>
                                 </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                            <Button type="submit">Enregistrer le paiement</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
