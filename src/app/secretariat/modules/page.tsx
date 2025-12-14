'use client';
import React, { useState } from 'react';
import {
  BookCopy,
  FolderPlus,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
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
  modules: Module[];
}

const initialUes: UE[] = [
  {
    id: 'ue-fondamentaux',
    name: 'UE Fondamentaux',
    code: 'UEF1',
    modules: [
      { id: 'mod-algo', name: 'Algorithmique et Structures de Données', code: 'ALG101', credits: 6, teacher: 'Prof. Martin' },
      { id: 'mod-prog', name: 'Programmation Orientée Objet', code: 'POO102', credits: 6, teacher: 'Prof. Laurent' },
    ],
  },
  {
    id: 'ue-systemes',
    name: 'UE Systèmes et Réseaux',
    code: 'UESR1',
    modules: [
      { id: 'mod-sys', name: 'Systèmes d\'Exploitation', code: 'SYS201', credits: 5, teacher: 'Prof. Dubois' },
      { id: 'mod-res', name: 'Réseaux Informatiques', code: 'RES202', credits: 5, teacher: 'Prof. Leroy' },
    ],
  },
];

export default function ModulesPage() {
  const [ues, setUes] = useState<UE[]>(initialUes);
  const [newUeName, setNewUeName] = useState('');
  const [newUeCode, setNewUeCode] = useState('');
  const { toast } = useToast();

  const handleCreateUe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUeName || !newUeCode) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs pour créer une UE.', variant: 'destructive'});
      return;
    }
    const newUe: UE = {
      id: `ue-${Date.now()}`,
      name: newUeName,
      code: newUeCode,
      modules: [],
    };
    setUes([...ues, newUe]);
    setNewUeName('');
    setNewUeCode('');
    toast({ title: 'Succès', description: `L'UE "${newUeName}" a été créée.` });
  };
  
  const handleDeleteUe = (ueId: string) => {
    setUes(ues.filter(ue => ue.id !== ueId));
    toast({ title: 'Succès', description: 'UE supprimée.', variant: 'destructive' });
  }

  const handleCreateModule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ueId = formData.get('ue') as string;
    const moduleName = formData.get('moduleName') as string;

    if (!ueId || !moduleName) {
        toast({ title: 'Erreur', description: 'Veuillez sélectionner une UE et nommer le module.', variant: 'destructive'});
        return;
    }
    
    const newModule: Module = {
        id: `mod-${Date.now()}`,
        name: moduleName,
        code: formData.get('moduleCode') as string,
        credits: Number(formData.get('credits')),
        teacher: formData.get('teacher') as string,
    }

    setUes(ues.map(ue => ue.id === ueId ? { ...ue, modules: [...ue.modules, newModule] } : ue));
    toast({ title: 'Succès', description: `Module "${newModule.name}" ajouté.` });
    e.currentTarget.reset();
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section de gauche : Gestion des UE et création de modules */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus />
                Unités d'Enseignement (UE)
              </CardTitle>
              <CardDescription>Créez et gérez les grands blocs de votre programme.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUe} className="flex gap-2 mb-4">
                <Input value={newUeName} onChange={(e) => setNewUeName(e.target.value)} placeholder="Nom de l'UE (ex: Fondamentaux)" />
                <Input value={newUeCode} onChange={(e) => setNewUeCode(e.target.value)} placeholder="Code (ex: UEF1)" className="w-28" />
                <Button type="submit" size="icon"><Plus /></Button>
              </form>
              <div className="space-y-2">
                {ues.map(ue => (
                    <div key={ue.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div>
                            <p className="font-semibold">{ue.name}</p>
                            <p className="text-xs text-muted-foreground">{ue.code} - {ue.modules.length} modules</p>
                        </div>
                        <div>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit/></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteUe(ue.id)}><Trash2/></Button>
                        </div>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus />
                Nouveau Module
              </CardTitle>
               <CardDescription>Créez un module et assignez-le à une UE.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreateModule} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="ue">Assigner à l'UE</Label>
                         <Select name="ue" required>
                            <SelectTrigger id="ue"><SelectValue placeholder="Sélectionnez une UE..."/></SelectTrigger>
                            <SelectContent>{ues.map(ue => <SelectItem key={ue.id} value={ue.id}>{ue.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="moduleName">Nom du module</Label>
                        <Input id="moduleName" name="moduleName" placeholder="Ex: Algorithmique Avancée" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="moduleCode">Code</Label>
                            <Input id="moduleCode" name="moduleCode" placeholder="ALG201"/>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="credits">Crédits</Label>
                            <Input id="credits" name="credits" type="number" placeholder="5"/>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="teacher">Enseignant</Label>
                        <Input id="teacher" name="teacher" placeholder="Ex: Prof. Durand"/>
                    </div>
                    <Button type="submit" className="w-full">Créer le module</Button>
                </form>
            </CardContent>
          </Card>

        </div>

        {/* Section de droite : Visualisation des modules par UE */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Modules par UE</CardTitle>
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
                                                <p className="text-sm text-muted-foreground text-left">{ue.modules.length} modules</p>
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
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit/></Button>
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
        </div>
      </div>
    </div>
  );
}
