
'use client';
import React, { useState, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Bell, AlertTriangle, CheckCircle, Info, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { alertsData, priorityConfig, type Alert, type AlertPriority, type AlertType } from '@/lib/alerts-data';
import { cn } from '@/lib/utils';
import { studentData } from '@/lib/static-data';

const StatCard: React.FC<{ title: string; value: number; icon: LucideIcon; color: string; }> = ({ title, value, icon: Icon, color }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

const AlertsPage = () => {
    const [alerts, setAlerts] = useState(alertsData);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');
    const [readFilter, setReadFilter] = useState<'all' | 'new' | 'read'>('all');

    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => 
            (priorityFilter === 'all' || alert.priority === priorityFilter) &&
            (typeFilter === 'all' || alert.type === typeFilter) &&
            (readFilter === 'all' || (readFilter === 'new' && alert.isNew) || (readFilter === 'read' && !alert.isNew))
        );
    }, [alerts, priorityFilter, typeFilter, readFilter]);

    const stats = useMemo(() => ({
        active: alerts.length,
        critical: alerts.filter(a => a.priority === 'critical').length,
        high: alerts.filter(a => a.priority === 'high').length,
        new: alerts.filter(a => a.isNew).length,
    }), [alerts]);

    const handleMarkAsRead = (alertId: number) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? {...a, isNew: false} : a));
    };

    const handleResolve = (alertId: number) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        setSelectedAlert(null);
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(a => ({...a, isNew: false})));
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <StatCard title="Alertes Actives" value={stats.active} icon={Bell} color="text-yellow-500" />
                 <StatCard title="Alertes Critiques" value={stats.critical} icon={AlertTriangle} color="text-red-500" />
                 <StatCard title="Alertes Hautes" value={stats.high} icon={AlertTriangle} color="text-orange-500" />
                 <StatCard title="Nouvelles Alertes" value={stats.new} icon={Info} color="text-blue-500" />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Centre d'alertes</CardTitle>
                    <CardDescription>Suivez et gérez les alertes système et les notifications critiques.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Priorité"/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les priorités</SelectItem><SelectItem value="critical">Critique</SelectItem><SelectItem value="high">Haute</SelectItem><SelectItem value="medium">Moyenne</SelectItem><SelectItem value="low">Faible</SelectItem></SelectContent></Select>
                            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Type"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les types</SelectItem><SelectItem value="academic">Académique</SelectItem><SelectItem value="administrative">Administratif</SelectItem><SelectItem value="technical">Technique</SelectItem><SelectItem value="attendance">Présence</SelectItem><SelectItem value="content">Contenu</SelectItem></SelectContent></Select>
                            <Select value={readFilter} onValueChange={(v) => setReadFilter(v as any)}><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Statut"/></SelectTrigger><SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="new">Nouvelles</SelectItem><SelectItem value="read">Lues</SelectItem></SelectContent></Select>
                        </div>
                        <Button onClick={markAllAsRead} variant="outline">Tout marquer comme lu</Button>
                    </div>
                </CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Priorité</TableHead>
                                <TableHead>Titre</TableHead>
                                <TableHead>Sujet</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAlerts.map(alert => {
                                const priority = priorityConfig[alert.priority];
                                return (
                                    <TableRow key={alert.id} className={cn("transition-colors", alert.isNew ? "bg-primary-50 dark:bg-primary-900/10" : "hover:bg-muted/50")}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={cn("h-2.5 w-2.5 rounded-full", priority.color)}></span>
                                                <span className="font-medium">{priority.text}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">{alert.title}</TableCell>
                                        <TableCell>{alert.subject.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{alert.date}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedAlert(alert); handleMarkAsRead(alert.id); }}><Eye className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleResolve(alert.id)}><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className={cn("h-3 w-3 rounded-full", selectedAlert && priorityConfig[selectedAlert.priority].color)}></span>
                            {selectedAlert?.title}
                        </DialogTitle>
                        <DialogDescription>Sujet: {selectedAlert?.subject.name} • {selectedAlert?.date}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-muted-foreground">
                        {selectedAlert?.description}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedAlert(null)}>Fermer</Button>
                        <Button onClick={() => selectedAlert && handleResolve(selectedAlert.id)}>Marquer comme résolu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AlertsPage;
