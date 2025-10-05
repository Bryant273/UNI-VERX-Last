'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  Users,
  MessageSquare,
  FileText,
  PieChart,
  ClipboardList,
  Paperclip,
  Send,
  MoreVertical,
  ChevronDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Mock Data ---

const teamMembers = {
  'sarah-dupont': { name: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', role: 'Chef de groupe' },
  'thomas-mercier': { name: 'Thomas Mercier', avatar: 'https://i.pravatar.cc/100?img=12', role: 'Membre' },
  'laura-garcia': { name: 'Laura Garcia', avatar: 'https://i.pravatar.cc/100?img=32', role: 'Membre' },
  'julien-petit': { name: 'Julien Petit', avatar: 'https://i.pravatar.cc/100?img=54', role: 'Membre' },
};

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId: string;
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
      { id: 'task-1', title: 'Maquettes UI/UX', status: 'done', assigneeId: 'laura-garcia' },
      { id: 'task-2', title: 'Structurer le HTML', status: 'done', assigneeId: 'thomas-mercier' },
      { id: 'task-3', title: 'Styliser avec CSS Flexbox/Grid', status: 'in-progress', assigneeId: 'sarah-dupont' },
      { id: 'task-4', title: 'Ajouter les media queries', status: 'todo', assigneeId: 'thomas-mercier' },
      { id: 'task-5', title: 'Tester la responsivité', status: 'todo', assigneeId: 'laura-garcia' },
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
      { id: 'task-6', title: 'Analyser les requêtes lentes', status: 'in-progress', assigneeId: 'julien-petit' },
      { id: 'task-7', title: 'Proposer des index pertinents', status: 'todo', assigneeId: 'sarah-dupont' },
      { id: 'task-8', title: 'Rédiger le rapport d\'optimisation', status: 'todo', assigneeId: 'julien-petit' },
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

const KanbanTask = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const member = teamMembers[task.assigneeId as keyof typeof teamMembers];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-background p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium mb-2">{task.title}</p>
      <div className="flex justify-end">
        <Avatar className="h-6 w-6">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, tasks, id }: { title: string, tasks: Task[], id: TaskStatus }) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">{title}</h4>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {tasks.map(task => <KanbanTask key={task.id} task={task} />)}
        </div>
      </SortableContext>
    </div>
  );
};


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
                <Avatar key={memberId} className="h-6 w-6 border-2 border-card">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">{td.deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const TdWorkspace = ({ td, setTds }: { td: any, setTds: React.Dispatch<React.SetStateAction<any[]>> }) => {
    const [tasks, setTasks] = useState<Task[]>(td.tasks);

    const tasksByStatus = useMemo(() => {
        const initial: Record<TaskStatus, Task[]> = {
            todo: [],
            'in-progress': [],
            done: [],
        };
        
        return tasks.reduce((acc, task) => {
            if (acc[task.status]) {
                acc[task.status].push(task);
            } else {
                console.warn(`Task with id ${task.id} has an unknown status: ${task.status}`);
            }
            return acc;
        }, initial);
    }, [tasks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newStatus = (over.data.current?.sortable.containerId || tasks[oldIndex].status) as TaskStatus;
                
                const updatedTasks = [...items];
                updatedTasks[oldIndex] = { ...updatedTasks[oldIndex], status: newStatus };

                // In a real app, you would also reorder the items. For now, just status change is enough.
                return updatedTasks;
            });
        }
    };
    
  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader>
        <CardTitle>{td.title}</CardTitle>
        <CardDescription>Espace de travail du groupe</CardDescription>
      </CardHeader>
      <Tabs defaultValue="discussion" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
            <TabsList>
              <TabsTrigger value="discussion"><MessageSquare className="mr-2 h-4 w-4"/>Discussion</TabsTrigger>
              <TabsTrigger value="tasks"><ClipboardList className="mr-2 h-4 w-4"/>Tâches</TabsTrigger>
              <TabsTrigger value="files"><FileText className="mr-2 h-4 w-4"/>Fichiers</TabsTrigger>
              <TabsTrigger value="submit" disabled={td.status === 'Achevé'}><Send className="mr-2 h-4 w-4"/>Soumettre</TabsTrigger>
            </TabsList>
        </div>
        
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
        <TabsContent value="tasks" className="flex-1 overflow-y-auto p-6">
             <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <div className="flex flex-col lg:flex-row gap-6">
                    <KanbanColumn id="todo" title="À faire" tasks={tasksByStatus.todo} />
                    <KanbanColumn id="in-progress" title="En cours" tasks={tasksByStatus['in-progress']} />
                    <KanbanColumn id="done" title="Terminé" tasks={tasksByStatus.done} />
                </div>
            </DndContext>
        </TabsContent>
        <TabsContent value="files" className="flex-1 overflow-y-auto p-6">
            <p className="text-center text-muted-foreground">La section des fichiers est en construction.</p>
        </TabsContent>
        <TabsContent value="submit" className="flex-1 overflow-y-auto p-6 text-center">
             <CardTitle className="mb-2">Soumission du devoir</CardTitle>
             <CardDescription className="mb-4">Seul le chef de groupe peut soumettre le devoir final.</CardDescription>
             <div className="mx-auto max-w-md border-2 border-dashed rounded-lg p-8">
                <p className="mb-4 text-muted-foreground">Déposez votre fichier ici ou cliquez pour parcourir.</p>
                <Button>
                    <Paperclip className="mr-2 h-4 w-4"/>
                    Choisir un fichier
                </Button>
             </div>
             <Button className="mt-6" onClick={() => {
                 alert('Devoir soumis ! Le statut du TD et du devoir correspondant dans "Évaluations" a été mis à jour.');
                 setTds(prevTds => prevTds.map(t => t.id === td.id ? {...t, status: 'Achevé', progress: 100} : t));
             }}>
                Soumettre le TD
             </Button>
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
        <div className="md:w-1/3 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Mes Travaux Dirigés</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" onValueChange={setFilter}>
                        <TabsList className="w-full">
                            <TabsTrigger value="all" className="flex-1">Tous les TDs</TabsTrigger>
                            <TabsTrigger value="en cours" className="flex-1">En cours</TabsTrigger>
                            <TabsTrigger value="acheve" className="flex-1">Achevés</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
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

      <div className="md:w-2/3 flex">
        {selectedTd ? (
          <TdWorkspace td={selectedTd} setTds={setTds} />
        ) : (
          <Card className="flex-1 flex items-center justify-center border-2 border-dashed">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Sélectionnez un TD</p>
              <p className="text-sm text-muted-foreground">Choisissez un travail dirigé dans la liste pour voir les détails.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
