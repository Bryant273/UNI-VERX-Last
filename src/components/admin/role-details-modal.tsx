'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInitials } from '@/lib/messages-data';
import { roleConfig, usersData, type UniversityUser } from '@/lib/users-data';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

interface RoleDetailsModalProps {
  role: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleDetailsModal({ role, isOpen, onClose }: RoleDetailsModalProps) {
  const [permissions, setPermissions] = useState(role?.permissions || []);
  const [users, setUsers] = useState(role?.users || []);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (role) {
      setPermissions(role.permissions);
      setUsers(role.users);
    }
  }, [role]);

  if (!role) return null;

  const handlePermissionChange = (permission: string) => {
    setPermissions((prev: string[]) => 
      prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
    );
  };
  
  const handleSave = () => {
    toast({
        title: "Permissions mises à jour",
        description: `Les permissions pour le rôle "${role.label}" ont été enregistrées.`
    });
    onClose();
  }

  const AddUserModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const availableUsers = usersData.filter(u => u.role !== role.key && !users.some((ru: UniversityUser) => ru.id === u.id));
    
    const filteredAvailableUsers = availableUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, id]);
    }
    
    const handleAddUsers = () => {
        const usersToAdd = availableUsers.filter(u => selectedUsers.includes(u.id));
        setUsers((prev: UniversityUser[]) => [...prev, ...usersToAdd]);
        setIsAddUserModalOpen(false);
        toast({ title: `${selectedUsers.length} utilisateur(s) ajouté(s)`});
    }

    return (
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter des utilisateurs au rôle: {role.label}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <Input placeholder="Rechercher un utilisateur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <ScrollArea className="h-64">
                        <div className="space-y-2">
                        {filteredAvailableUsers.map(user => (
                             <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{roleConfig[user.role].label}</p>
                                    </div>
                                </div>
                                <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => handleSelectUser(user.id)}/>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsAddUserModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleAddUsers} disabled={selectedUsers.length === 0}>Ajouter les utilisateurs</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Gérer le rôle : {role.label}</DialogTitle>
          <DialogDescription>{role.description}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0 py-4">
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Utilisateurs ({users.length})</h3>
                <ScrollArea className="border rounded-md">
                    <Table>
                        <TableBody>
                            {users.map((user: UniversityUser) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                 <Button variant="outline" onClick={() => setIsAddUserModalOpen(true)}>Ajouter un utilisateur</Button>
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Permissions</h3>
                <ScrollArea className="border rounded-md p-4">
                    <div className="space-y-4">
                        {role.permissions.map((perm: string) => (
                            <div key={perm} className="flex items-center space-x-2">
                                <Checkbox id={perm} checked={permissions.includes(perm)} onCheckedChange={() => handlePermissionChange(perm)} />
                                <Label htmlFor={perm} className="text-sm font-normal">{perm}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AddUserModal />
    </>
  );
}