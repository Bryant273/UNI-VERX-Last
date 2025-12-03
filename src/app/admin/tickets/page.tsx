
'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Trash2, File, Paperclip } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ticketsData, Ticket, TicketStatus, ticketStatusConfig, ticketDepartmentConfig } from '@/lib/tickets-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { userData } from '@/lib/static-data';

const ITEMS_PER_PAGE = 8;

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const { toast } = useToast();

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (ticket) =>
        (statusFilter === 'all' || ticket.status === statusFilter) &&
        (departmentFilter === 'all' || ticket.department === departmentFilter)
    );
  }, [tickets, statusFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);
  
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold">Gestion des Tickets</h1>
            <p className="text-muted-foreground">Consultez et gérez les requêtes de toute l'université.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Liste des requêtes</CardTitle>
            <CardDescription>{filteredTickets.length} requêtes trouvées.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(ticketStatusConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
             <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrer par département" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {Object.entries(ticketDepartmentConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
          </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.map((ticket) => {
                  const status = ticketStatusConfig[ticket.status];
                  const department = ticketDepartmentConfig[ticket.department];
                  return (
                    <TableRow key={ticket.id} className="even:bg-muted/40">
                        <TableCell className="font-mono text-muted-foreground">{ticket.id}</TableCell>
                        <TableCell className="font-medium">{ticket.author}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell><div className="flex items-center gap-2"><department.icon className={cn("h-4 w-4", department.color)}/><span>{department.label}</span></div></TableCell>
                        <TableCell>{ticket.date}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={status.color}><status.icon className="mr-1.5 h-3 w-3" />{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleViewTicket(ticket)}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                    </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </div>
        <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">Affichage de {paginatedTickets.length} sur {filteredTickets.length} tickets</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
            </div>
        </CardFooter>
      </Card>
      
      {/* View Ticket Modal */}
      {selectedTicket && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ticket {selectedTicket.id}: {selectedTicket.subject}</DialogTitle>
                    <DialogDescription>
                       Requête de {selectedTicket.author} du {selectedTicket.date} au département "{ticketDepartmentConfig[selectedTicket.department].label}".
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                   {selectedTicket.messages.map((msg, index) => (
                       <div key={index} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                               <p className="font-semibold">{msg.author}</p>
                               <p className="text-xs text-muted-foreground">{new Date(msg.date).toLocaleString('fr-FR')}</p>
                            </div>
                            <div className={cn("p-4 rounded-lg", msg.author === userData.admin.name ? 'bg-primary/10' : 'bg-muted/50')}>
                               <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                               {msg.attachments && msg.attachments.length > 0 && (
                                   <div className="mt-4 border-t pt-2">
                                       <p className="text-xs font-semibold mb-2">Pièces jointes:</p>
                                       {msg.attachments.map((file, i) => (
                                           <Button key={i} variant="link" className="p-0 h-auto text-sm">
                                               <File className="mr-2 h-4 w-4"/> {file}
                                           </Button>
                                       ))}
                                   </div>
                               )}
                            </div>
                       </div>
                   ))}
                </div>
                {selectedTicket.status !== 'closed' && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Répondre</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <Textarea placeholder="Votre réponse..."/>
                        <div className="flex justify-between items-center">
                           <Button variant="outline" size="sm"><Paperclip className="mr-2"/>Joindre un fichier</Button>
                           <Button>Envoyer la réponse</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
