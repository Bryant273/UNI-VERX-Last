'use client';
import React, { useState, useMemo } from 'react';
import {
  DoorOpen,
  Filter,
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CalendarPlus,
  CheckCircle,
  Users,
  XCircle,
  Clock,
  Wrench,
  Projector,
  Wifi,
  Mic,
  Tv,
  Wind,
  FlaskConical,
  Monitor,
  ChevronsUpDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { allRooms, type Room, type RoomStatus, type RoomType } from '@/lib/rooms-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Label } from '@/components/ui/label';

const ITEMS_PER_PAGE = 10;

const StatCard: React.FC<{ title: string; value: number; icon: LucideIcon; color: string; }> = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const statusConfig: Record<RoomStatus, { label: string; icon: LucideIcon; color: string; }> = {
  available: { label: 'Disponible', icon: CheckCircle, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
  occupied: { label: 'Occupée', icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
  reserved: { label: 'Réservée', icon: Clock, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
};

const typeConfig: Record<RoomType, { label: string; icon: LucideIcon }> = {
  cours: { label: 'Cours', icon: Projector },
  tp: { label: 'TP', icon: Monitor },
  amphi: { label: 'Amphi', icon: Users },
  reunion: { label: 'Réunion', icon: Users },
  laboratoire: { label: 'Labo', icon: FlaskConical },
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState(allRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ building: 'all', type: 'all', status: 'all', capacity: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Room, direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const { toast } = useToast();

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter(room => {
      const capacityClass =
        room.capacity <= 20 ? 'small' :
        room.capacity <= 50 ? 'medium' :
        room.capacity <= 100 ? 'large' : 'xlarge';

      return (
        (room.name.toLowerCase().includes(searchTerm.toLowerCase()) || room.building.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.building === 'all' || room.building === filters.building) &&
        (filters.type === 'all' || room.type === filters.type) &&
        (filters.status === 'all' || room.status === filters.status) &&
        (filters.capacity === 'all' || filters.capacity === capacityClass)
      );
    });

    filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
  }, [rooms, searchTerm, filters, sortConfig]);

  const stats = useMemo(() => ({
    total: filteredAndSortedRooms.length,
    available: filteredAndSortedRooms.filter(r => r.status === 'available').length,
    occupied: filteredAndSortedRooms.filter(r => r.status === 'occupied').length,
    maintenance: filteredAndSortedRooms.filter(r => r.status === 'maintenance').length,
  }), [filteredAndSortedRooms]);

  const totalPages = Math.ceil(filteredAndSortedRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredAndSortedRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key: keyof Room) => {
    setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Salles" value={stats.total} icon={DoorOpen} color="text-blue-500" />
            <StatCard title="Disponibles" value={stats.available} icon={CheckCircle} color="text-green-500" />
            <StatCard title="Occupées" value={stats.occupied} icon={XCircle} color="text-red-500" />
            <StatCard title="En Maintenance" value={stats.maintenance} icon={Wrench} color="text-yellow-500" />
        </div>
        
        <Card>
             <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <CardTitle>Liste des salles</CardTitle>
                        <CardDescription>Consultez, filtrez et gérez toutes les salles de l'université.</CardDescription>
                    </div>
                    <Button><Plus className="mr-2 h-4 w-4"/> Nouvelle réservation</Button>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Rechercher une salle..." className="pl-10 w-full md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={filters.building} onValueChange={v => setFilters(f => ({...f, building: v}))}><SelectTrigger className="w-full sm:w-auto"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les bâtiments</SelectItem><SelectItem value="A">Bât. A</SelectItem><SelectItem value="B">Bât. B</SelectItem><SelectItem value="C">Bât. C</SelectItem><SelectItem value="D">Bât. D</SelectItem></SelectContent></Select>
                        <Select value={filters.type} onValueChange={v => setFilters(f => ({...f, type: v}))}><SelectTrigger className="w-full sm:w-auto"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les types</SelectItem>{Object.entries(typeConfig).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
                        <Select value={filters.status} onValueChange={v => setFilters(f => ({...f, status: v}))}><SelectTrigger className="w-full sm:w-auto"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent></Select>
                        <Select value={filters.capacity} onValueChange={v => setFilters(f => ({...f, capacity: v}))}><SelectTrigger className="w-full sm:w-auto"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Toutes capacités</SelectItem><SelectItem value="small">Petite (1-20)</SelectItem><SelectItem value="medium">Moyenne (21-50)</SelectItem><SelectItem value="large">Grande (51-100)</SelectItem><SelectItem value="xlarge">Très grande (100+)</SelectItem></SelectContent></Select>
                    </div>
                </div>
            </CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}><div className="flex items-center">Salle <ChevronsUpDown className="ml-2 h-4 w-4"/></div></TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('building')}>Bât.</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>Type</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('capacity')}>Capacité</TableHead>
                            <TableHead>Occupation</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRooms.map(room => {
                            const status = statusConfig[room.status];
                            const type = typeConfig[room.type];
                            return(
                                <TableRow key={room.id} className="hover:bg-muted/50">
                                    <TableCell><div className="font-medium">{room.name}</div><div className="text-xs text-muted-foreground">Étage {room.floor}</div></TableCell>
                                    <TableCell>{room.building}</TableCell>
                                    <TableCell><div className="flex items-center gap-2"><type.icon className="h-4 w-4 text-muted-foreground"/><span>{type.label}</span></div></TableCell>
                                    <TableCell>{room.capacity} pl.</TableCell>
                                    <TableCell><div className={cn(room.currentOccupation ? "text-red-600" : "text-green-600")}>{room.currentOccupation || 'Libre'}</div><div className="text-xs text-muted-foreground">{room.nextReservation}</div></TableCell>
                                    <TableCell><Badge variant="outline" className={status.color}><status.icon className="mr-1 h-3 w-3"/>{status.label}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <CardFooter className="flex items-center justify-between p-4">
                 <p className="text-sm text-muted-foreground">Affichage de {paginatedRooms.length} sur {filteredAndSortedRooms.length} salles</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                            <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    )}
            </CardFooter>
        </Card>
    </div>
  );
}
