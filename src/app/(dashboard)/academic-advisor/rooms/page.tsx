
'use client';

import React, { useState, useMemo } from 'react';
import {
    DoorOpen, CheckCircle, Users, HardDrive, Search, RefreshCw, Plus, Eye, Edit, CalendarPlus, Wrench,
    Building, CaseSensitive, SortAsc, SortDesc, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { allRooms, type Room, type RoomStatus, type RoomType } from '@/lib/rooms-data';

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<RoomStatus, { text: string; color: string; icon: React.ElementType }> = {
    available: { text: 'Disponible', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300', icon: CheckCircle },
    occupied: { text: 'Occupée', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300', icon: Users },
    reserved: { text: 'Réservée', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300', icon: CalendarPlus },
    maintenance: { text: 'En maintenance', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300', icon: Wrench },
};

const typeConfig: Record<RoomType, { text: string; }> = {
    cours: { text: 'Salle de cours' },
    tp: { text: 'Salle TP' },
    amphi: { text: 'Amphithéâtre' },
    reunion: { text: 'Salle de réunion' },
    laboratoire: { text: 'Laboratoire' },
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string; }) => (
    <Card className="hover-lift">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.replace('text-', 'bg-').replace('-500', '-50 dark:bg-900/20'))}>
                    <Icon className={cn("text-xl", color)} />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function RoomsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [buildingFilter, setBuildingFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortColumn, setSortColumn] = useState<keyof Room>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const filteredRooms = useMemo(() => {
        let rooms = allRooms.filter(room => {
            const searchMatch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
            const buildingMatch = buildingFilter === 'all' || room.building === buildingFilter;
            const typeMatch = typeFilter === 'all' || room.type === typeFilter;
            const statusMatch = statusFilter === 'all' || room.status === statusFilter;
            return searchMatch && buildingMatch && typeMatch && statusMatch;
        });

        rooms.sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return 0;
        });

        return rooms;
    }, [searchTerm, buildingFilter, typeFilter, statusFilter, sortColumn, sortDirection]);

    const stats = useMemo(() => ({
        total: allRooms.length,
        available: allRooms.filter(r => r.status === 'available').length,
        occupied: allRooms.filter(r => r.status === 'occupied').length,
        maintenance: allRooms.filter(r => r.status === 'maintenance').length,
    }), []);
    
    const paginatedRooms = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRooms, currentPage]);

    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);

    const handleSort = (column: keyof Room) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }
    
    const SortableHeader = ({ column, label, icon: Icon }: { column: keyof Room; label: string; icon: React.ElementType }) => (
        <TableHead onClick={() => handleSort(column)} className="cursor-pointer">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4"/>
                <span>{label}</span>
                {sortColumn === column && (sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
            </div>
        </TableHead>
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total salles" value={stats.total} icon={DoorOpen} color="text-blue-500" />
                <StatCard title="Disponibles" value={stats.available} icon={CheckCircle} color="text-green-500" />
                <StatCard title="Occupées" value={stats.occupied} icon={Users} color="text-red-500" />
                <StatCard title="En maintenance" value={stats.maintenance} icon={Wrench} color="text-yellow-500" />
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Gestion des Salles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher une salle..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Select value={buildingFilter} onValueChange={setBuildingFilter}><SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Bâtiment" /></SelectTrigger><SelectContent><SelectItem value="all">Tous bâtiments</SelectItem><SelectItem value="A">Bâtiment A</SelectItem><SelectItem value="B">Bâtiment B</SelectItem><SelectItem value="C">Bâtiment C</SelectItem><SelectItem value="D">Bâtiment D</SelectItem></SelectContent></Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">Tous types</SelectItem><SelectItem value="cours">Salle de cours</SelectItem><SelectItem value="tp">Salle TP</SelectItem><SelectItem value="amphi">Amphi</SelectItem><SelectItem value="reunion">Réunion</SelectItem><SelectItem value="laboratoire">Laboratoire</SelectItem></SelectContent></Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Statut" /></SelectTrigger><SelectContent><SelectItem value="all">Tous statuts</SelectItem><SelectItem value="available">Disponible</SelectItem><SelectItem value="occupied">Occupée</SelectItem><SelectItem value="reserved">Réservée</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select>
                            <Button variant="outline" size="icon"><RefreshCw /></Button>
                            <Button><Plus className="mr-2 h-4 w-4"/>Nouvelle salle</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHeader column="name" label="Salle" icon={DoorOpen} />
                                <SortableHeader column="building" label="Bâtiment" icon={Building} />
                                <SortableHeader column="type" label="Type" icon={CaseSensitive} />
                                <SortableHeader column="capacity" label="Capacité" icon={Users} />
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRooms.map(room => {
                                const status = statusConfig[room.status];
                                return (
                                <TableRow key={room.id} className={cn('hover:bg-muted/40 cursor-pointer', `border-l-4 border-transparent room-row ${room.status}`)} onClick={() => setSelectedRoom(room)}>
                                    <TableCell>
                                        <div className="font-medium">{room.name}</div>
                                        <div className="text-xs text-muted-foreground">Étage {room.floor}</div>
                                    </TableCell>
                                    <TableCell>{room.building}</TableCell>
                                    <TableCell>{typeConfig[room.type].text}</TableCell>
                                    <TableCell>{room.capacity}</TableCell>
                                    <TableCell><Badge variant="outline" className={cn('border-0 font-medium', status.color)}><status.icon className="mr-1.5 h-3.5 w-3.5"/>{status.text}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); setSelectedRoom(room);}}><Eye /></Button></TooltipTrigger><TooltipContent>Détails</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><CalendarPlus /></Button></TooltipTrigger><TooltipContent>Réserver</TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon"><Wrench /></Button></TooltipTrigger><TooltipContent>Maintenance</TooltipContent></Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            
            <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails de la salle {selectedRoom?.name}</DialogTitle>
                        <DialogDescription>
                            {typeConfig[selectedRoom?.type as RoomType]?.text} • Bâtiment {selectedRoom?.building}, Étage {selectedRoom?.floor}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRoom && (
                        <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><Label>Capacité</Label><p>{selectedRoom.capacity} personnes</p></div>
                                <div className="space-y-1"><Label>Surface</Label><p>{selectedRoom.area} m²</p></div>
                                <div className="space-y-1"><Label>Accessibilité PMR</Label><p>{selectedRoom.accessibility ? 'Oui' : 'Non'}</p></div>
                                <div className="space-y-1"><Label>Statut</Label><Badge variant="outline" className={statusConfig[selectedRoom.status].color}>{statusConfig[selectedRoom.status].text}</Badge></div>
                            </div>
                            <Separator />
                            <div>
                                <Label>Équipements</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedRoom.equipment.map(eq => <Badge key={eq.name} variant="secondary"><eq.icon className="h-3 w-3 mr-1.5"/>{eq.name}</Badge>)}
                                </div>
                            </div>
                             <Separator />
                             <div>
                                <Label>Occupation</Label>
                                <p className="text-sm">{selectedRoom.currentOccupation || 'Libre actuellement'}</p>
                                <p className="text-xs text-muted-foreground">Prochaine réservation: {selectedRoom.nextReservation}</p>
                             </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedRoom(null)}>Fermer</Button>
                        <Button><CalendarPlus className="mr-2"/>Réserver</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
