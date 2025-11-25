
'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Bell,
  Search,
  Filter,
  Eye,
  Archive,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Cog,
  Check,
  TrendingDown,
  UserX,
  MessageCircleWarning,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { alertsData, priorityConfig, type Alert, type AlertPriority, type AlertType } from '@/lib/alerts-data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-6">
            <div className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${color.replace('text-', 'bg-').replace('-500', '-100 dark:bg-900/30')}`}>
                    <Icon className={`text-xl ${color}`} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const getPriorityBadge = (priority: AlertPriority) => {
    const config = priorityConfig[priority];
    if (priority === 'critical') {
        return (
            <Badge className="bg-red-500 hover:bg-red-500/80 text-white border-red-500">
                 <AlertTriangle className="w-3 h-3 mr-1.5"/>
                {config.text}
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="border-0 font-medium">
            <span className={cn("w-2 h-2 rounded-full mr-2", config.color)}></span>
            {config.text}
        </Badge>
    );
};

const getSubjectIcon = (type: Alert['subject']['type']) => {
    switch (type) {
        case 'student': return <User className="h-4 w-4 text-muted-foreground"/>;
        case 'course': return <BookOpen className="h-4 w-4 text-muted-foreground"/>;
        case 'system': return <Cog className="h-4 w-4 text-muted-foreground"/>;
        case 'conversation': return <MessageCircleWarning className="h-4 w-4 text-muted-foreground"/>;
        default: return <Bell className="h-4 w-4 text-muted-foreground"/>;
    }
}

export default function AlertsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const stats = useMemo(() => ({
        critical: alertsData.filter(a => a.priority === 'critical').length,
        high: alertsData.filter(a => a.priority === 'high').length,
        new: alertsData.filter(a => a.isNew).length,
        total: alertsData.length,
    }), []);

    const filteredAlerts = useMemo(() => {
        return alertsData.filter(alert =>
            (alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || alert.description.toLowerCase().includes(searchTerm.toLowerCase()) || alert.subject.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (priorityFilter === 'all' || alert.priority === priorityFilter) &&
            (typeFilter === 'all' || alert.type === typeFilter)
        );
    }, [searchTerm, priorityFilter, typeFilter]);

    const paginatedAlerts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAlerts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAlerts, currentPage]);

    const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Alertes critiques" value={stats.critical} icon={AlertTriangle} color="text-red-500" />
                <StatCard title="Alertes hautes" value={stats.high} icon={TrendingDown} color="text-orange-500" />
                <StatCard title="Nouvelles alertes" value={stats.new} icon={Bell} color="text-blue-500" />
                <StatCard title="Absences préoccupantes" value="3" icon={UserX} color="text-yellow-500" />
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Centre d'alertes</CardTitle>
                    <CardDescription>Surveillez et traitez les situations importantes de votre établissement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher une alerte ou un étudiant..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-4">
                            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as AlertPriority | 'all')}>
                                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Toutes les priorités"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les priorités</SelectItem>
                                    <SelectItem value="critical">Critique</SelectItem>
                                    <SelectItem value="high">Haute</SelectItem>
                                    <SelectItem value="medium">Moyenne</SelectItem>
                                    <SelectItem value="low">Faible</SelectItem>
                                </SelectContent>
                            </Select>
                             <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AlertType | 'all')}>
                                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Tous les types"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les types</SelectItem>
                                    <SelectItem value="academic">Académique</SelectItem>
                                    <SelectItem value="attendance">Assiduité</SelectItem>
                                    <SelectItem value="administrative">Administratif</SelectItem>
                                    <SelectItem value="technical">Technique</SelectItem>
                                    <SelectItem value="content">Contenu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Priorité</TableHead>
                                <TableHead>Sujet</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedAlerts.map(alert => (
                                <TableRow key={alert.id} className={cn('even:bg-muted/40', alert.isNew && 'bg-primary/5')}>
                                    <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getSubjectIcon(alert.subject.type)}
                                            <div>
                                                <p className="font-medium">{alert.subject.name}</p>
                                                <p className="text-xs text-muted-foreground">{alert.subject.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{alert.title}</p>
                                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{alert.date}</TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Eye/></Button></TooltipTrigger><TooltipContent>Voir détails</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Check/></Button></TooltipTrigger><TooltipContent>Marquer comme traitée</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Archive/></Button></TooltipTrigger><TooltipContent>Archiver</TooltipContent></Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <CardFooter className="flex items-center justify-between p-4 border-t">
                    <p className="text-sm text-muted-foreground">Affichage de {paginatedAlerts.length} sur {filteredAlerts.length} alertes</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
                </CardFooter>
            </Card>

        </div>
    );
}
