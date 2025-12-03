'use client';
import React, { useState, useMemo } from 'react';
import {
  LogIn,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
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
import {
  actionsData,
  statusConfig,
  type ActionLog,
  type ActionType,
} from '@/lib/actions-data';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

export default function RectorateActionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredActions = useMemo(() => {
    return actionsData.filter(
      (action) =>
        (action.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          action.ip.includes(searchTerm)) &&
        (filterType === 'all' || action.action === filterType)
    );
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);

  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredActions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredActions, currentPage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Historique des actions</CardTitle>
          <CardDescription>
            Consultez le journal de toutes les activités de votre compte.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par description ou IP..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filtrer par type" />
                </div>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Adresse IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActions.map((action) => {
                const config = statusConfig[action.action];
                return (
                  <TableRow
                    key={action.id}
                    className={cn(
                      action.isFirstLogin &&
                        'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/30',
                      'even:bg-muted/40'
                    )}
                  >
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="flex w-fit items-center gap-2"
                            >
                              <config.icon className={cn('h-4 w-4', config.color)} />
                              <span>{config.label}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{config.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{action.date}</p>
                        <p className="text-xs text-muted-foreground">{action.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                        <p>{action.description}</p>
                        {action.isFirstLogin && <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Première connexion de la journée</p>}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {action.ip}
                      <p className="text-xs text-muted-foreground">{action.location}</p>
                    </TableCell>
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
