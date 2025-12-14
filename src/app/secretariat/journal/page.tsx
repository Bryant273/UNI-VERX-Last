
'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  Key,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { allActionsData, statusConfig, type ActionLog } from '@/lib/actions-data';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/messages-data';
import { roleConfig } from '@/lib/users-data';

const ITEMS_PER_PAGE = 15;

export default function JournalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    action: 'all',
    date: new Date() as Date | undefined,
  });

  const filteredActions = useMemo(() => {
    return allActionsData.filter((log) => {
      const logDate = new Date(log.date);
      const isSameDay = filters.date
        ? logDate.getFullYear() === filters.date.getFullYear() &&
          logDate.getMonth() === filters.date.getMonth() &&
          logDate.getDate() === filters.date.getDate()
        : true;

      const matchesSearch =
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm);
      
      const matchesRole = filters.role === 'all' || log.user.role === filters.role;
      const matchesAction = filters.action === 'all' || log.action === filters.action;

      return isSameDay && matchesSearch && matchesRole && matchesAction;
    });
  }, [searchTerm, filters]);

  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);

  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredActions, currentPage]);

  const handleFilterChange = (key: 'role' | 'action', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFilters(prev => ({ ...prev, date }));
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Journal d'Activité Global</CardTitle>
          <CardDescription>
            Consultez le journal de toutes les activités des utilisateurs sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par utilisateur, description ou IP..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !filters.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={handleDateChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <Select value={filters.role} onValueChange={(v) => handleFilterChange('role', v)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> <SelectValue/></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {Object.entries(roleConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.action} onValueChange={(v) => handleFilterChange('action', v)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2"><Filter className="h-4 w-4" /> <SelectValue/></div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les actions</SelectItem>
                {Object.entries(statusConfig).map(([key, { label, icon: Icon }]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        </Card>
        <Card>
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Adresse IP</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {paginatedActions.map((log) => {
                    const config = statusConfig[log.action];
                    const roleInfo = roleConfig[log.user.role];
                    return (
                    <TableRow key={log.id} className="even:bg-muted/40">
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={log.user.avatar} />
                                    <AvatarFallback>{getInitials(log.user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{log.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{roleInfo.label}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="flex w-fit items-center gap-2">
                                <config.icon className={cn('h-4 w-4', config.color)} />
                                <span>{config.label}</span>
                            </Badge>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>
                            <div>
                                <p className="font-medium">{format(log.date, "dd/MM/yyyy")}</p>
                                <p className="text-xs text-muted-foreground">{format(log.date, "HH:mm:ss")}</p>
                            </div>
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">{log.ip}</TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </div>
            <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">
                Affichage de {paginatedActions.length} sur {filteredActions.length}{' '}
                actions
            </p>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                >
                    <ChevronLeft />
                </Button>
                <span className="text-sm font-medium">
                    Page {currentPage} sur {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                >
                    <ChevronRight />
                </Button>
                </div>
            )}
            </CardFooter>
      </Card>
    </div>
  );
}
