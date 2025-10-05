
'use client';

import React, { useState, useMemo } from 'react';
import {
  List,
  Filter,
  Users,
  MessageSquare,
  FileText,
  ClipboardList,
  Paperclip,
  Send,
  MoreVertical,
  ChevronDown,
  Plus,
  Trash2,
  Edit,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Mock Data ---

const teamMembers = {
  'sarah-dupont': { name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', role: 'Chef de groupe' },
  'thomas-mercier': { name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=12', role: 'Membre' },
  'laura-garcia': { name: 'Laura Garcia', avatar: 'https://i.pravatar.cc/100?img=32', role: 'Membre' },
  'julien-petit': { name: 'Julien Petit', avatar: 'https://i.pravatar.cc/100?img=54', role: 'Membre' },
};

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface TaskFile {
    id: string;
    name: string;
    size: string;
    submittedBy: string; // memberId
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  files: TaskFile[];
}

const initialTds = [
  {
    id: 'td-web-responsive',
    title: 'TP1 - Site Responsive',
    module: 'Développement Web',
    deadline: '17/05/2025',
    progress: 80,
    priority: 'Haute',
    status: 'En cours',
    team: ['sarah-dupont', 'thomas-mercier', 'laura-garcia'],
    tasks: [
      { id: 'task-1', title: 'Maquettes UI/UX', description: "Créer les maquettes pour mobile et desktop sur Figma.", status: 'done', assigneeId: 'laura-garcia', dueDate: '10/05/2025', files: [{id: 'file-1', name: 'maquettes-v1.fig', size: '2.3 MB', submittedBy: 'laura-garcia'}] },
      { id: 'task-2', title: 'Structurer le HTML', description: "Mettre en place la structure sémantique HTML pour toutes les pages.", status: 'done', assigneeId: 'thomas-mercier', dueDate: '11/05/2025', files: [{id: 'file-2', name: 'index.html', size: '4 KB', submittedBy: 'thomas-mercier'}] },
      { id: 'task-3', title: 'Styliser avec CSS Flexbox/Grid', description: "Intégrer le design en utilisant Flexbox et Grid pour le layout principal.", status: 'in-progress', assigneeId: 'sarah-dupont', dueDate: '13/05/2025', files: [] },
      { id: 'task-4', title: 'Ajouter les media queries', description: "Rendre le site responsive pour les tablettes et mobiles.", status: 'todo', assigneeId: 'thomas-mercier', dueDate: '14/05/2025', files: [] },
      { id: 'task-5', title: 'Tester la responsivité', description: "Tester sur différents navigateurs et appareils pour corriger les bugs d'affichage.", status: 'todo', assigneeId: 'laura-garcia', dueDate: '15/05/2025', files: [] },
    ] as Task[],
    messages: [
        { id: 1, user: teamMembers['thomas-mercier'], text: "J'ai push la structure HTML de base.", time: "14:30" },
        { id: 2, user: teamMembers['laura-garcia'], text: "Super ! Je commence les styles. J'ai une question sur la maquette mobile, je t'envoie ça.", time: "14:35" },
        { id: 3, user: teamMembers['sarah-dupont'], text: "Parfait, tenez-moi au courant. N'oubliez pas la deadline !", time: "14:40" },
    ]
  },
  {
    id: 'td-db-optimization',
    title: 'TP2 - Optimisation SQL',
    module: 'Base de Données Avancées',
    deadline: '20/05/2025',
    progress: 35,
    priority: 'Moyenne',
    status: 'En cours',
    team: ['sarah-dupont', 'julien-petit'],
    tasks: [
      { id: 'task-6', title: 'Analyser les requêtes lentes', description: "Utiliser EXPLAIN ANALYZE pour identifier les requêtes qui posent problème.", status: 'in-progress', assigneeId: 'julien-petit', dueDate: '16/05/2025', files: [] },
      { id: 'task-7', title: 'Proposer des index pertinents', description: "Suggérer des index pour accélérer les requêtes identifiées.", status: 'todo', assigneeId: 'sarah-dupont', dueDate: '18/05/2025', files: [] },
      { id: 'task-8', title: 'Rédiger le rapport d\'optimisation', description: "Documenter les changements et mesurer le gain de performance.", status: 'todo', assigneeId: 'julien-petit', dueDate: '20/05/2025', files: [] },
    ] as Task[],
     messages: [
        { id: 4, user: teamMembers['julien-petit'], text: "L'analyse initiale est faite. La requête sur la table `orders` est la plus lente.", time: "Hier" },
        { id: 5, user: teamMembers['sarah-dupont'], text: "OK, je regarde pour ajouter un index sur `customer_id` et `order_date`. Je te fais un retour.", time: "Ce matin" },
    ]
  },
  {
    id: 'td-oop-heritage',
    title: 'TP Héritage & Polymorphisme',
    module: 'Programmation Orientée Objet',
    deadline: '08/05/2025',
    progress: 100,
    priority: 'Basse',
    status: 'Achevé',
    team: ['sarah-dupont', 'laura-garcia', 'julien-petit'],
    tasks: [],
    messages: []
  },
];


// --- Components ---

const TdCard = ({ td, onSelect, isActive }: { td: any, onSelect: () => void, isActive: boolean }) => {
  const priorityColors = {
    Haute: 'bg-red-500',
    Moyenne: 'bg-amber-500',
    Basse: 'bg-green-500',
  };
  return (
    <Card
      className={cn(
        'cursor-pointer hover:border-primary transition-all',
        isActive && 'border-primary bg-primary/5'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
            <CardTitle className="text-base">{td.title}</CardTitle>
            <Badge className={cn(priorityColors[td.priority as keyof typeof priorityColors])}>{td.priority}</Badge>
        </div>
        <CardDescription>{td.module}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progression</span>
          <span>{td.progress}%</span>
        </div>
        <Progress value={td.progress} className="h-1.5" />
        <div className="flex justify-between items-center pt-2">
          <div className="flex -space-x-2">
            {td.team.map((memberId: string) => {
              const member = teamMembers[memberId as keyof typeof teamMembers];
              return (
                <TooltipProvider key={memberId}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-6 w-6 border-2 border-card">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{member.name} {member.role === 'Chef de groupe' ? `(${member.role})` : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">{td.deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskCard = ({ task, isGroupLeader }: { task: Task, isGroupLeader: boolean }) => {
    const assignee = teamMembers[task.assigneeId as keyof typeof teamMembers];
    const statusConfig = {
        todo: { label: 'À faire', color: 'bg-gray-400' },
        'in-progress': { label: 'En cours', color: 'bg-blue-500' },
        done: { label: 'Terminé', color: 'bg-green-500' },
    };

    return (
        <div className="bg-background p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                {isGroupLeader && (
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                 <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", statusConfig[task.status].color)}></div>
                    <span>{statusConfig[task.status].label}</span>
                </div>
                <span>Échéance : {task.dueDate}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Assigné à :</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Avatar className="h-7 w-7">
                                    <AvatarImage src={assignee.avatar} />
                                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent><p>{assignee.name}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                 </div>
            </div>

            <div>
                <h5 className="text-sm font-medium mb-2">Fichiers soumis</h5>
                <div className="space-y-2">
                    {task.files.length > 0 ? task.files.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">({file.size})</span>
                            </div>
                            <span className="text-xs text-muted-foreground">par {teamMembers[file.submittedBy as keyof typeof teamMembers].name}</span>
                        </div>
                    )) : (
                        <p className="text-xs text-muted-foreground italic">Aucun fichier pour cette tâche.</p>
                    )}
                </div>
                 <Button variant="outline" size="sm" className="w-full mt-3">
                    <UploadCloud className="mr-2 h-4 w-4"/>
                    Soumettre un fichier
                </Button>
            </div>
        </div>
    );
};

const TdWorkspace = ({ td, setTds }: { td: any, setTds: React.Dispatch<React.SetStateAction<any[]>> }) => {
    // Our demo user is Sarah, the group leader
    const isGroupLeader = true; 
    const allFiles = td.tasks.flatMap((task: Task) => task.files);

  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader>
        <CardTitle>{td.title}</CardTitle>
        <CardDescription>Espace de travail du groupe</CardDescription>
      </CardHeader>
      <Tabs defaultValue="tasks" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
            <TabsList>
              <TabsTrigger value="tasks"><ClipboardList className="mr-2 h-4 w-4"/>Tâches</TabsTrigger>
              <TabsTrigger value="discussion"><MessageSquare className="mr-2 h-4 w-4"/>Discussion</TabsTrigger>
              <TabsTrigger value="submit" disabled={td.status === 'Achevé'}><Send className="mr-2 h-4 w-4"/>Soumettre</TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="tasks" className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
             {isGroupLeader && (
                <div className="flex justify-end">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une tâche
                    </Button>
                </div>
            )}
             {td.tasks.map((task: Task) => (
                <TaskCard key={task.id} task={task} isGroupLeader={isGroupLeader} />
             ))}
             {td.tasks.length === 0 && <p className="text-center text-muted-foreground py-8">Aucune tâche pour ce TD.</p>}
        </TabsContent>

        <TabsContent value="discussion" className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
            <div className="flex-1 space-y-4">
                {td.messages.map((msg: any) => (
                    <div key={msg.id} className="flex items-start gap-3">
                        <Avatar>
                            <AvatarImage src={msg.user.avatar} />
                            <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{msg.user.name}</p>
                                <p className="text-xs text-muted-foreground">{msg.time}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg mt-1">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 pt-4 border-t">
                <Textarea placeholder="Écrire un message..." className="flex-1" />
                <Button><Send className="h-4 w-4"/></Button>
            </div>
        </TabsContent>
        
        <TabsContent value="submit" className="flex-1 overflow-y-auto p-6 text-center">
             <CardTitle className="mb-2">Soumission du devoir</CardTitle>
             <CardDescription className="mb-4">
                {isGroupLeader 
                    ? "Rassemblez les fichiers de l'équipe et soumettez le devoir final." 
                    : "Seul le chef de groupe peut soumettre le devoir final."}
            </CardDescription>

            <Card className="my-6 text-left">
                <CardHeader>
                    <CardTitle className="text-base">Fichiers collectés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-48 overflow-auto">
                    {allFiles.length > 0 ? allFiles.map((file: TaskFile) => (
                         <div key={file.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">({file.size})</span>
                            </div>
                            <span className="text-xs text-muted-foreground">de {teamMembers[file.submittedBy as keyof typeof teamMembers].name.split(' ')[0]}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground italic text-center p-4">Aucun fichier soumis par l'équipe pour le moment.</p>
                    )}
                </CardContent>
            </Card>

             {isGroupLeader && (
                <>
                 <div className="mx-auto max-w-md border-2 border-dashed rounded-lg p-8">
                    <p className="mb-4 text-muted-foreground">Déposez le fichier final ici ou cliquez pour parcourir.</p>
                    <Button>
                        <UploadCloud className="mr-2 h-4 w-4"/>
                        Choisir le fichier final
                    </Button>
                 </div>
                 <Button className="mt-6" onClick={() => {
                     alert('Devoir soumis ! Le statut du TD et du devoir correspondant dans "Évaluations" a été mis à jour.');
                     setTds(prevTds => prevTds.map(t => t.id === td.id ? {...t, status: 'Achevé', progress: 100} : t));
                 }}>
                    Soumettre le TD pour l'équipe
                 </Button>
                </>
             )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};


export default function GroupWorkPage() {
  const [tds, setTds] = useState(initialTds);
  const [selectedTd, setSelectedTd] = useState<any>(tds.find(t => t.status === 'En cours') || null);
  const [filter, setFilter] = useState('all');

  const filteredTds = useMemo(() => {
    if (filter === 'all') return tds;
    return tds.filter(td => td.status.toLowerCase().replace('é', 'e') === filter);
  }, [tds, filter]);

  return (
    <div className="flex h-full gap-6 flex-col md:flex-row">
        <div className="md:w-1/3 xl:w-1/4 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mes Travaux Dirigés</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" onValueChange={setFilter}>
                        <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="all">Tous</TabsTrigger>
                            <TabsTrigger value="en cours">En cours</TabsTrigger>
                            <TabsTrigger value="acheve">Achevés</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 -mr-2">
                {filteredTds.map(td => (
                    <TdCard 
                        key={td.id} 
                        td={td} 
                        onSelect={() => setSelectedTd(td)}
                        isActive={selectedTd?.id === td.id}
                    />
                ))}
            </div>
        </div>

      <div className="md:w-2/3 xl:w-3/4 flex">
        {selectedTd ? (
          <TdWorkspace td={selectedTd} setTds={setTds} />
        ) : (
          <Card className="flex-1 flex items-center justify-center border-2 border-dashed bg-muted/20">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">Sélectionnez un TD</p>
              <p className="mt-1 text-sm text-muted-foreground">Choisissez un travail dirigé dans la liste pour voir l'espace de collaboration.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
