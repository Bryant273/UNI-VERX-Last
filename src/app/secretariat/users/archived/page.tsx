
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Search, Archive, ChevronLeft, ChevronRight, Undo
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usersData, roleConfig, UniversityUser } from '@/lib/users-data';
import { getInitials } from '@/lib/messages-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const ITEMS_PER_PAGE = 10;

export default function ArchivedUsersPage() {
    const [archivedUsers, setArchivedUsers] = useState<UniversityUser[]>(() => usersData.filter(u => u.status === 'archived'));
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredUsers = useMemo(() => {
        return archivedUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [archivedUsers, searchTerm]);
    
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);
    
    const handleRestore = (userId: number) => {
        // This is a mock function. In a real app, you'd update the backend.
        setArchivedUsers(prev => prev.filter(u => u.id !== userId));
        // You might want to also update the main users list state if it's managed globally.
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Utilisateurs Archivés</CardTitle>
                            <CardDescription>Liste des comptes qui ont été archivés.</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                           <Link href="/secretariat/users"><ChevronLeft className="mr-2"/>Retour aux utilisateurs</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Rechercher un utilisateur..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Rôle</TableHead><TableHead>Date d'archivage</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {paginatedUsers.map(user => {
                                const role = roleConfig[user.role];
                                return (
                                    <TableRow key={user.id} className="even:bg-muted/40">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar><AvatarImage src={user.avatar}/><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                                                <div><p className="font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{role.label}</TableCell>
                                        <TableCell>{user.lastLogin}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleRestore(user.id)}>
                                                <Undo className="mr-2 h-4 w-4"/> Restaurer
                                            </Button>
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
        </div>
    );
}
