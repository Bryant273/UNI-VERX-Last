
'use client';

import React, { useState, useMemo } from 'react';
import { Building, Plus, Edit, Trash2, Tag, BookCopy, Search, GripVertical } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { initialDepartments, type Department } from '@/lib/departments-data';
import { teachersData } from '@/lib/teachers-data';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedDepartmentForSpecialties, setSelectedDepartmentForSpecialties] = useState<Department | null>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const { toast } = useToast();

  const handleOpenDepartmentModal = (dept: Department | null = null) => {
    setEditingDepartment(dept);
    setIsDepartmentModalOpen(true);
  };

  const handleSaveDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const departmentData = {
      name: formData.get('name') as string,
      head: formData.get('head') as string,
    };

    if (editingDepartment) {
      setDepartments(prev =>
        prev.map(d => (d.id === editingDepartment.id ? { ...d, ...departmentData } : d))
      );
      toast({ title: 'Département modifié !' });
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        ...departmentData,
        specialties: [],
      };
      setDepartments(prev => [...prev, newDept]);
      toast({ title: 'Département créé !' });
    }
    setIsDepartmentModalOpen(false);
  };

  const handleOpenSpecialtyModal = (dept: Department) => {
    setSelectedDepartmentForSpecialties(dept);
    setIsSpecialtyModalOpen(true);
  };
  
  const handleAddSpecialty = () => {
    if (!newSpecialty || !selectedDepartmentForSpecialties) return;
    setDepartments(prev => 
        prev.map(d => 
            d.id === selectedDepartmentForSpecialties.id 
                ? { ...d, specialties: [...d.specialties, newSpecialty] }
                : d
        )
    );
    setSelectedDepartmentForSpecialties(prev => prev ? { ...prev, specialties: [...prev.specialties, newSpecialty] } : null);
    setNewSpecialty('');
  }
  
  const handleRemoveSpecialty = (specialtyToRemove: string) => {
      if (!selectedDepartmentForSpecialties) return;
       setDepartments(prev => 
        prev.map(d => 
            d.id === selectedDepartmentForSpecialties.id 
                ? { ...d, specialties: d.specialties.filter(s => s !== specialtyToRemove) }
                : d
        )
    );
    setSelectedDepartmentForSpecialties(prev => prev ? { ...prev, specialties: prev.specialties.filter(s => s !== specialtyToRemove) } : null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Départements & Spécialités</CardTitle>
              <CardDescription>
                Organisez la structure académique de l'université.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDepartmentModal()}>
              <Plus className="mr-2 h-4 w-4" /> Créer un département
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du département</TableHead>
                <TableHead>Chef de département</TableHead>
                <TableHead>Spécialités</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map(dept => (
                <TableRow key={dept.id}>
                  <TableCell className="font-semibold">{dept.name}</TableCell>
                  <TableCell>{dept.head}</TableCell>
                  <TableCell>{dept.specialties.length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenSpecialtyModal(dept)}><Tag className="mr-2 h-4 w-4"/>Gérer les spécialités</Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDepartmentModal(dept)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Department Modal */}
      <Dialog open={isDepartmentModalOpen} onOpenChange={setIsDepartmentModalOpen}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingDepartment ? "Modifier le" : "Créer un"} département</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveDepartment} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="dept-name">Nom du département</Label>
                    <Input id="dept-name" name="name" defaultValue={editingDepartment?.name} placeholder="Ex: Informatique" required/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="dept-head">Chef de département</Label>
                    <Select name="head" defaultValue={editingDepartment?.head}>
                        <SelectTrigger id="dept-head"><SelectValue placeholder="Sélectionnez un enseignant..." /></SelectTrigger>
                        <SelectContent>{teachersData.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                    <Button type="submit">Enregistrer</Button>
                </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>

      {/* Specialty Modal */}
       <Dialog open={isSpecialtyModalOpen} onOpenChange={setIsSpecialtyModalOpen}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Gérer les spécialités</DialogTitle>
                <DialogDescription>Pour le département : {selectedDepartmentForSpecialties?.name}</DialogDescription>
            </DialogHeader>
             <div className="py-4 space-y-4">
                <div className="flex gap-2">
                    <Input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} placeholder="Nom de la nouvelle spécialité..."/>
                    <Button onClick={handleAddSpecialty}><Plus className="h-4 w-4"/></Button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {selectedDepartmentForSpecialties?.specialties.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground py-4">Aucune spécialité ajoutée.</p>
                    ) : selectedDepartmentForSpecialties?.specialties.map(spec => (
                        <div key={spec} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <span className="text-sm font-medium">{spec}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveSpecialty(spec)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    ))}
                </div>
             </div>
             <DialogFooter>
                <Button variant="outline" onClick={() => setIsSpecialtyModalOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
       </Dialog>
    </div>
  );
}
