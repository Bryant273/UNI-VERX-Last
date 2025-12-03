
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Search, Plus, MoreHorizontal, Edit, UserCheck, UserX, KeyRound, Archive, Trash2, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { usersData, roleConfig, statusConfig, UniversityUser, UserStatus } from '@/lib/users-data';
import { getInitials } from '@/lib/messages-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
    const [users, setUsers] = useState<UniversityUser[]>(usersData);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [action, setAction] = useState<{type: 'suspend' | 'archive' | 'delete' | null, user: UniversityUser | null}>({type: null, user: null});
    const { toast } = useToast();

    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            (roleFilter === 'all' || user.role === roleFilter) &&
            (statusFilter === 'all' || user.status === statusFilter) &&
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm, roleFilter, statusFilter]);
    
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const handleAction = (user: UniversityUser, type: 'suspend' | 'archive' | 'delete') => {
        setAction({ type, user });
    };

    const handleConfirmAction = () => {
        if (!action.user || !action.type) return;

        let newStatus: UserStatus | null = null;
        let toastMessage = "";

        if (action.type === 'suspend') {
            newStatus = 'suspended';
            toastMessage = `Le compte de ${action.user.name} a été suspendu.`;
        } else if (action.type === 'archive') {
            newStatus = 'archived';
            toastMessage = `Le compte de ${action.user.name} a été archivé.`;
        } else if (action.type === 'delete') {
            setUsers(prev => prev.filter(u => u.id !== action.user!.id));
            toastMessage = `Le compte de ${action.user.name} a été supprimé.`;
        }
        
        if (newStatus) {
            setUsers(prev => prev.map(u => u.id === action.user!.id ? { ...u, status: newStatus! } : u));
        }

        toast({ title: "Action effectuée", description: toastMessage });
        setAction({ type: null, user: null });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <CardDescription>Gérez tous les comptes de l'université.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 justify-between">
                     <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1 md:grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input placeholder="Rechercher par nom ou email..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="w-full md:w-[200px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les rôles</SelectItem>{Object.entries(roleConfig).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-[180px]"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <Button><Plus className="mr-2 h-4 w-4"/> Ajouter un utilisateur</Button>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Rôle</TableHead><TableHead>Statut</TableHead><TableHead>Dernière connexion</TableHead><TableHead>Date de création</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {paginatedUsers.map(user => {
                                const status = statusConfig[user.status];
                                const role = roleConfig[user.role];
                                const isAdmin = user.role === 'admin';
                                return (
                                    <TableRow key={user.id} className="even:bg-muted/40">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar><AvatarImage src={user.avatar}/><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                                                <div><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{role.label}</TableCell>
                                        <TableCell><Badge variant="outline" className={cn("border-0", status.color.replace('text-', 'bg-'))}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge></TableCell>
                                        <TableCell>{user.lastLogin}</TableCell>
                                        <TableCell>{user.creationDate}</TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={isAdmin}><MoreHorizontal/></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem><Edit className="mr-2"/>Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem><KeyRound className="mr-2"/>Réinitialiser mot de passe</DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() => handleAction(user, 'suspend')} className="text-orange-600 focus:text-orange-600"><Clock className="mr-2"/>Suspendre</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction(user, 'archive')}><Archive className="mr-2"/>Archiver</DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() => handleAction(user, 'delete')} className="text-destructive focus:text-destructive"><Trash2 className="mr-2"/>Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedUsers.length} sur {filteredUsers.length} utilisateurs</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

             <Dialog open={!!action.type} onOpenChange={() => setAction({type: null, user: null})}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmation requise</DialogTitle>
                        <DialogDescription>
                            {action.type === 'suspend' && `Êtes-vous sûr de vouloir suspendre le compte de ${action.user?.name} ?`}
                            {action.type === 'archive' && `Êtes-vous sûr de vouloir archiver le compte de ${action.user?.name} ?`}
                            {action.type === 'delete' && `Êtes-vous sûr de vouloir supprimer définitivement le compte de ${action.user?.name} ? Cette action est irréversible.`}
                        </DialogDescription>
                    </DialogHeader>
                    {action.type === 'suspend' && (
                        <div className="py-4 space-y-2">
                            <Label htmlFor="suspend-duration">Durée de la suspension</Label>
                            <Select defaultValue="7">
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 jour</SelectItem>
                                    <SelectItem value="7">7 jours</SelectItem>
                                    <SelectItem value="30">30 jours</SelectItem>
                                    <SelectItem value="permanent">Indéfinie</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setAction({type: null, user: null})}>Annuler</Button>
                        <Button variant={action.type === 'delete' ? "destructive" : "default"} onClick={handleConfirmAction}>
                            {action.type === 'suspend' && 'Suspendre'}
                            {action.type === 'archive' && 'Archiver'}
                            {action.type === 'delete' && 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
        </div>
    )
}
