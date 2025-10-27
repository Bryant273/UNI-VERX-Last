
'use client';

import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  FileText,
  Clock,
  CalendarDays,
  FileUp,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Paperclip,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertTriangle,
  Info,
  Download,
  Search,
  Plus,
  Ban
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColors: { [key: string]: string } = {
  'Terminé': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  'Programmé': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  'En cours': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
};


export default function ProfessorEvaluationsPage() {
    
  return (
    <div className="space-y-6">
      <Tabs defaultValue="interrogations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interrogations">
            <ClipboardList className="mr-2" /> Interrogations QCM
          </TabsTrigger>
          <TabsTrigger value="devoirs">
            <FileText className="mr-2" /> Devoirs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interrogations" className="space-y-6 mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gérer les interrogations QCM</CardTitle>
                        <CardDescription>Créez et programmez des interrogations QCM pour vos classes.</CardDescription>
                    </div>
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une interrogation
                    </Button>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Interrogations programmées</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Toutes les matières" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les matières</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Toutes les classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les classes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Interrogation</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Date publication</TableHead>
                                <TableHead>Étudiants</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <div className="font-medium">QCM SQL Avancé</div>
                                    <div className="text-xs text-muted-foreground">20 questions • 15 min</div>
                                </TableCell>
                                <TableCell>Bases de Données</TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>18/05/2025 à 09:00</TableCell>
                                <TableCell>
                                    <div className="font-medium">78 / 89</div>
                                    <div className="text-xs text-muted-foreground">88% participation</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['Terminé']}>Terminé</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>
                                    <div className="font-medium">QCM Algorithmes de tri</div>
                                    <div className="text-xs text-muted-foreground">20 questions • 15 min</div>
                                </TableCell>
                                <TableCell>Algorithmique</TableCell>
                                <TableCell>L1 Informatique</TableCell>
                                <TableCell>20/05/2025 à 14:00</TableCell>
                                <TableCell>
                                    <div className="font-medium">0 / 31</div>
                                    <div className="text-xs text-muted-foreground">Non démarré</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['Programmé']}>Programmé</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Ban className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </div>
            </Card>
        </TabsContent>

        <TabsContent value="devoirs" className="space-y-6 mt-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gérer les devoirs</CardTitle>
                        <CardDescription>Programmez des devoirs avec date limite pour vos classes.</CardDescription>
                    </div>
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Programmer un devoir
                    </Button>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Devoirs programmés</CardTitle>
                </CardHeader>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                             <TableRow>
                                <TableHead>Devoir</TableHead>
                                <TableHead>Matière</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Date limite</TableHead>
                                <TableHead>Rendus</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             <TableRow>
                                <TableCell>
                                    <div className="font-medium">TP1 - Site responsive</div>
                                    <div className="text-xs text-muted-foreground">Développement web</div>
                                </TableCell>
                                <TableCell>Développement Web</TableCell>
                                <TableCell>L3 Informatique</TableCell>
                                <TableCell>
                                    <div className="font-medium text-red-600">17/05/2025</div>
                                    <div className="text-xs text-muted-foreground">23:59:59</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">67 / 89</div>
                                    <div className="text-xs text-muted-foreground">75% rendu</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={statusColors['En cours']}>En cours</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon"><Clock className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
