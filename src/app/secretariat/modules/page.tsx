'use client';
import React, { useState } from 'react';
import {
  BookCopy,
  FolderPlus,
  Plus,
  Edit,
  Trash2,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  teacher: string;
}

interface UE {
  id: string;
  name: string;
  code: string;
  department: string;
  modules: Module[];
}

const initialUes: UE[] = [
  {
    id: 'ue-fondamentaux',
    name: 'UE Fondamentaux',
    code: 'UEF1',
    department: 'Informatique',
    modules: [
      { id: 'mod-algo', name: 'Algorithmique et Structures de Données', code: 'ALG101', credits: 6, teacher: 'Prof. Martin' },
      { id: 'mod-prog', name: 'Programmation Orientée Objet', code: 'POO102', credits: 6, teacher: 'Prof. Laurent' },
    ],
  },
  {
    id: 'ue-systemes',
    name: 'UE Systèmes et Réseaux',
    code: 'UESR1',
    department: 'Informatique',
    modules: [
      { id: 'mod-sys', name: 'Systèmes d\'Exploitation', code: 'SYS201', credits: 5, teacher: 'Prof. Dubois' },
      { id: 'mod-res', name: 'Réseaux Informatiques', code: 'RES202', credits: 5, teacher: 'Prof. Leroy' },
    ],
  },
];

const ModulesView = ({ ues, onOpenModuleModal }: { ues: UE[], onOpenModuleModal: (module?: Module, ueId?: string) => void }) => {
    return (
        <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Liste des Modules par UE</CardTitle>
                  <CardDescription>Visualisez la structure actuelle des unités d'enseignement et des modules qui les composent.</CardDescription>
                </div>
                <Button onClick={() => onOpenModuleModal()}><Plus className="mr-2 h-4 w-4"/> Ajouter un module</Button>
              </div>
            </CardHeader>
            <CardContent>
                {ues.length > 0 ? (
                    <Accordion type="multiple" defaultValue={ues.map(ue => ue.id)} className="w-full space-y-2">
                        {ues.map(ue => (
                        <AccordionItem key={ue.id} value={ue.id} className="border-0">
                             <Card>
                                <AccordionTrigger className="p-4 hover:no-underline">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-primary/10 rounded-lg text-primary"><BookOpen /></div>
                                            <div>
                                                <h3 className="text-base font-semibold text-left">{ue.name} ({ue.code})</h3>
                                                <p className="text-sm text-muted-foreground text-left">{ue.department} • {ue.modules.length} modules</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    {ue.modules.length > 0 ? (
                                        <div className="border-t">
                                            {ue.modules.map(module => (
                                                <div key={module.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                                                    <div>
                                                        <p className="font-medium">{module.name} ({module.code})</p>
                                                        <p className="text-xs text-muted-foreground">{module.teacher} • {module.credits} crédits</p>
                                                    </div>
                                                     <div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenModuleModal(module, ue.id)}><Edit/></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2/></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground p-4 border-t">Aucun module dans cette UE.</p>
                                    )}
                                </AccordionContent>
                             </Card>
                        </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">Aucune Unité d'Enseignement créée.</p>
                )}
            </CardContent>
          </Card>
    );
}

const UeView = ({ ues, onOpenUeModal }: { ues: UE[], onOpenUeModal: (ue?: UE) => void }) => {
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Gestion des Unités d'Enseignement</CardTitle>
                        <CardDescription>Créez, modifiez ou supprimez les UE de votre programme.</CardDescription>
                    </div>
                    <Button onClick={() => onOpenUeModal()}><Plus className="mr-2 h-4 w-4" /> Créer une UE</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom de l'UE</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Département</TableHead>
                            <TableHead>Modules</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ues.map(ue => (
                            <TableRow key={ue.id}>
                                <TableCell className="font-semibold">{ue.name}</TableCell>
                                <TableCell>{ue.code}</TableCell>
                                <TableCell>{ue.department}</TableCell>
                                <TableCell>{ue.modules.length}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onOpenUeModal(ue)}><Edit /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

const UeModal = ({ isOpen, onClose, ue, onSave }: { isOpen: boolean, onClose: () => void, ue?: UE, onSave: (data: any) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            code: formData.get('code'),
            department: formData.get('department'),
        };
        onSave({ ...ue, ...data });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ue ? "Modifier" : "Créer"} une Unité d'Enseignement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de l'UE</Label>
                        <Input id="name" name="name" defaultValue={ue?.name} placeholder="Ex: UE Fondamentaux" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="code">Code de l'UE</Label>
                        <Input id="code" name="code" defaultValue={ue?.code} placeholder="Ex: UEF1" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Département</Label>
                        <Select name="department" defaultValue={ue?.department}>
                            <SelectTrigger><SelectValue placeholder="Sélectionnez un département..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Informatique">Informatique</SelectItem>
                                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                                <SelectItem value="Physique">Physique</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const ModuleModal = ({ isOpen, onClose, module, ues, ueId, onSave }: { isOpen: boolean, onClose: () => void, module?: Module, ues: UE[], ueId?: string, onSave: (data: any, ueId: string) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedUeId = formData.get('ueId') as string;
        const data = {
            name: formData.get('moduleName'),
            code: formData.get('moduleCode'),
            credits: Number(formData.get('credits')),
            teacher: formData.get('teacher'),
        };
        onSave({ ...module, ...data }, selectedUeId);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{module ? "Modifier" : "Créer"} un module</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="ueId">Assigner à l'UE</Label>
                        <Select name="ueId" defaultValue={ueId} required>
                            <SelectTrigger id="ueId"><SelectValue placeholder="Sélectionnez une UE..."/></SelectTrigger>
                            <SelectContent>{ues.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="moduleName">Nom du module</Label>
                        <Input id="moduleName" name="moduleName" defaultValue={module?.name} placeholder="Ex: Algorithmique Avancée" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="moduleCode">Code</Label>
                            <Input id="moduleCode" name="moduleCode" defaultValue={module?.code} placeholder="ALG201"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="credits">Crédits</Label>
                            <Input id="credits" name="credits" type="number" defaultValue={module?.credits} placeholder="5"/>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="teacher">Enseignant</Label>
                        <Input id="teacher" name="teacher" defaultValue={module?.teacher} placeholder="Ex: Prof. Durand"/>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default function ModulesPage() {
  const [ues, setUes] = useState<UE[]>(initialUes);
  const [isUeModalOpen, setIsUeModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingUe, setEditingUe] = useState<UE | undefined>();
  const [editingModule, setEditingModule] = useState<{ module?: Module, ueId?: string } | undefined>();
  const { toast } = useToast();

  const handleOpenUeModal = (ue?: UE) => {
      setEditingUe(ue);
      setIsUeModalOpen(true);
  }
  
  const handleSaveUe = (data: any) => {
      if(data.id) { // Editing
          setUes(prev => prev.map(u => u.id === data.id ? data : u));
          toast({ title: "UE modifiée !", description: `L'UE "${data.name}" a été mise à jour.` });
      } else { // Creating
          const newUe = { ...data, id: `ue-${Date.now()}`, modules: [] };
          setUes(prev => [...prev, newUe]);
          toast({ title: "UE créée !", description: `L'UE "${data.name}" a été ajoutée.` });
      }
  }

  const handleOpenModuleModal = (module?: Module, ueId?: string) => {
      setEditingModule({ module, ueId });
      setIsModuleModalOpen(true);
  }

  const handleSaveModule = (data: any, ueId: string) => {
    if(data.id) { // Editing
        setUes(prev => prev.map(u => {
            const newModules = u.modules.filter(m => m.id !== data.id);
            if(u.id === ueId) {
                return { ...u, modules: [...newModules, data] };
            }
            return { ...u, modules: newModules };
        }));
         toast({ title: "Module modifié !", description: `Le module "${data.name}" a été mis à jour.` });
    } else { // Creating
        const newModule = { ...data, id: `mod-${Date.now()}`};
        setUes(prev => prev.map(u => u.id === ueId ? { ...u, modules: [...u.modules, newModule] } : u));
        toast({ title: "Module créé !", description: `Le module "${data.name}" a été ajouté.` });
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Modules et UE</CardTitle>
          <CardDescription>
            Organisez l'offre de formation en créant des Unités d'Enseignement (UE) et en y assignant des modules.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="modules">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules">
                <BookCopy className="mr-2 h-4 w-4"/> Modules
            </TabsTrigger>
            <TabsTrigger value="ue">
                <FolderPlus className="mr-2 h-4 w-4"/> UE
            </TabsTrigger>
        </TabsList>
        <TabsContent value="modules" className="mt-4">
            <ModulesView ues={ues} onOpenModuleModal={handleOpenModuleModal} />
        </TabsContent>
        <TabsContent value="ue" className="mt-4">
            <UeView ues={ues} onOpenUeModal={handleOpenUeModal} />
        </TabsContent>
      </Tabs>

      <UeModal 
        isOpen={isUeModalOpen}
        onClose={() => setIsUeModalOpen(false)}
        ue={editingUe}
        onSave={handleSaveUe}
      />
      
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        module={editingModule?.module}
        ues={ues}
        ueId={editingModule?.ueId}
        onSave={handleSaveModule}
      />
    </div>
  );
}
