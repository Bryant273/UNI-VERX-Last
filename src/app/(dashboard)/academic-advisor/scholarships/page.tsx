
'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Search,
  Download,
  Mail,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Bell,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/messages-data';
import { scholarshipsData, type StudentPayment, getStatusConfig } from '@/lib/scholarships-data';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, subtitle, icon: Icon, color }: { title: string; value: string; subtitle: string; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
                    <div className={cn("flex items-center mt-2 text-xs", subtitle.startsWith('+') ? 'text-green-500' : 'text-red-500')}>
                        {subtitle.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                        <span>{subtitle}</span>
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function ScholarshipsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<StudentPayment | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    
    const stats = useMemo(() => {
        const totalAmount = scholarshipsData.reduce((acc, s) => acc + s.totalAmount, 0);
        const totalPaid = scholarshipsData.reduce((acc, s) => acc + s.paidAmount, 0);
        const latePayments = scholarshipsData.filter(s => s.status === 'late').length;
        const partialPayments = scholarshipsData.filter(s => s.status === 'partial').length;
        return {
            collected: totalPaid,
            remaining: totalAmount - totalPaid,
            late: latePayments,
            partial: partialPayments
        };
    }, []);

    const filteredStudents = useMemo(() => {
        return scholarshipsData
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(s => statusFilter === 'all' || s.status === statusFilter);
    }, [searchTerm, statusFilter]);

    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);
    
    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

    const handleAction = (student: StudentPayment, action: 'payment' | 'alert') => {
        setSelectedStudent(student);
        if (action === 'payment') setPaymentModalOpen(true);
        if (action === 'alert') setAlertModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Collecté" value={`${(stats.collected/1_000_000).toFixed(1)}M FCFA`} subtitle="+5% vs S1" icon={DollarSign} color="bg-green-500" />
                <StatCard title="Solde Restant" value={`${(stats.remaining/1_000_000).toFixed(1)}M FCFA`} subtitle="-2% vs S1" icon={CreditCard} color="bg-orange-500" />
                <StatCard title="Paiements Partiels" value={stats.partial.toString()} subtitle="Stable" icon={TrendingUp} color="bg-blue-500" />
                <StatCard title="En Retard" value={stats.late.toString()} subtitle="+3 étudiants" icon={Bell} color="bg-red-500" />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <CardTitle>Suivi de la scolarité</CardTitle>
                            <CardDescription>Gérez les paiements de scolarité des étudiants.</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Exporter</Button>
                            <Button onClick={() => handleAction({} as StudentPayment, 'payment')}><Plus className="mr-2 h-4 w-4"/>Enregistrer un paiement</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher un étudiant par nom ou matricule..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filtrer par statut"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {Object.entries(getStatusConfig).map(([key, {label}]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Étudiant</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead className="text-right">Montant Total</TableHead>
                                <TableHead className="text-right">Montant Versé</TableHead>
                                <TableHead className="text-right">Solde Restant</TableHead>
                                <TableHead>Progression</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStudents.map(student => {
                                const {icon: StatusIcon, label: statusLabel, color: statusColor} = getStatusConfig(student.status);
                                const progress = (student.paidAmount / student.totalAmount) * 100;
                                return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9"><AvatarImage src={student.avatar}/><AvatarFallback>{getInitials(student.name)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.studentId}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell className="text-right font-medium">{student.totalAmount.toLocaleString()} FCFA</TableCell>
                                    <TableCell className="text-right text-green-600 font-medium">{student.paidAmount.toLocaleString()} FCFA</TableCell>
                                    <TableCell className="text-right text-red-600 font-medium">{(student.totalAmount - student.paidAmount).toLocaleString()} FCFA</TableCell>
                                    <TableCell><Progress value={progress} className="h-2" /></TableCell>
                                    <TableCell><Badge variant="outline" className={cn("border-0 font-medium", statusColor)}><StatusIcon className="h-3.5 w-3.5 mr-1.5"/>{statusLabel}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleAction(student, 'payment')}><Plus className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" disabled={student.status === 'paid'} onClick={() => handleAction(student, 'alert')}><Bell className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4 border-t">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedStudents.length} sur {filteredStudents.length} étudiants</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Enregistrer un paiement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-search-payment">Étudiant</Label>
                            <Input id="student-search-payment" placeholder="Rechercher nom ou matricule..." defaultValue={selectedStudent?.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment-amount">Montant (FCFA)</Label>
                            <Input id="payment-amount" type="number" placeholder="Ex: 500000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="payment-method">Moyen de paiement</Label>
                            <Select><SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger><SelectContent><SelectItem value="cash">Espèces</SelectItem><SelectItem value="transfer">Virement bancaire</SelectItem><SelectItem value="mobile">Paiement Mobile</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment-notes">Notes (optionnel)</Label>
                            <Textarea id="payment-notes" placeholder="Ex: Paiement 2ème tranche..."/>
                        </div>
                    </div>
                     <DialogFooter>
                        <Button variant="ghost" onClick={() => setPaymentModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setPaymentModalOpen(false)}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Dialog open={alertModalOpen} onOpenChange={setAlertModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Envoyer une alerte de paiement</DialogTitle>
                        <DialogDescription>Un message sera envoyé à {selectedStudent?.name} pour l'informer de son solde restant.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                            <p className="text-sm">Solde restant de l'étudiant:</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {(selectedStudent?.totalAmount || 0 - (selectedStudent?.paidAmount || 0)).toLocaleString()} FCFA
                            </p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="alert-message">Message personnalisé (optionnel)</Label>
                            <Textarea id="alert-message" placeholder="Ex: Veuillez régulariser votre situation avant le..."/>
                        </div>
                    </div>
                     <DialogFooter>
                        <Button variant="ghost" onClick={() => setAlertModalOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={() => setAlertModalOpen(false)}><Mail className="mr-2 h-4 w-4"/>Envoyer l'alerte</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

