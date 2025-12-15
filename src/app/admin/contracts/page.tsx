'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Search, Plus, Eye, Download, ChevronLeft, ChevronRight, Briefcase, Building, User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { initialContracts, statusConfig, contractorTypeConfig, type Contract } from '@/lib/contracts-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ITEMS_PER_PAGE = 10;

const ContractDetailsModal = ({ contract, onClose }: { contract: Contract | null, onClose: () => void }) => {
    if (!contract) return null;
    const status = statusConfig[contract.status];
    const contractorType = contractorTypeConfig[contract.contractorType];

    return (
        <Dialog open={!!contract} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                 <DialogHeader>
                    <DialogTitle>Détails du contrat : {contract.id}</DialogTitle>
                    <DialogDescription>
                       Contrat avec {contract.contractorName}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Prestataire</p>
                        <p className="font-semibold">{contract.contractorName}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type de prestataire</p>
                        <div className="flex items-center gap-2"><contractorType.icon className="h-4 w-4"/> {contractorType.label}</div>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type de contrat</p>
                        <p className="font-semibold">{contract.contractType}</p>
                    </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Rôle / Service</p>
                        <p className="font-semibold">{contract.roleOrService}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Date de début</p>
                        <p>{format(new Date(contract.startDate), 'dd MMMM yyyy', { locale: fr })}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Date de fin</p>
                        <p>{contract.endDate ? format(new Date(contract.endDate), 'dd MMMM yyyy', { locale: fr }) : 'Indéterminé'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Montant</p>
                        <p className="font-bold">{contract.amount ? `${contract.amount.toLocaleString('fr-FR')} ${contract.currency}` : 'N/A'}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <Badge variant="outline" className={cn("border-0", status.color)}><status.icon className="mr-1.5 h-3 w-3"/>{status.label}</Badge>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                    <Button><Download className="mr-2 h-4 w-4"/> Télécharger</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminContractsPage() {
    const [contracts, setContracts] = useState(initialContracts);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ type: 'all', status: 'all' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const filteredContracts = useMemo(() => {
        return contracts.filter(c => 
            (c.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) || c.roleOrService.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filters.type === 'all' || c.contractType === filters.type) &&
            (filters.status === 'all' || c.status === filters.status)
        );
    }, [contracts, searchTerm, filters]);

    const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
    const paginatedContracts = useMemo(() => {
        return filteredContracts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    }, [filteredContracts, currentPage]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Contrats</CardTitle>
              <CardDescription>
                Suivez tous les contrats des employés, prestataires et sous-traitants.
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouveau contrat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Rechercher un prestataire ou un service..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                </div>
                <Select value={filters.type} onValueChange={v => setFilters(f => ({...f, type: v}))}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Type de contrat"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les types</SelectItem><SelectItem value="CDI">CDI</SelectItem><SelectItem value="CDD">CDD</SelectItem><SelectItem value="prestation">Prestation</SelectItem><SelectItem value="stage">Stage</SelectItem></SelectContent></Select>
                <Select value={filters.status} onValueChange={v => setFilters(f => ({...f, status: v}))}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Statut"/></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statusConfig).map(([key, {label}]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select>
            </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader><TableRow><TableHead>Prestataire / Employé</TableHead><TableHead>Type</TableHead><TableHead>Rôle / Service</TableHead><TableHead>Période</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                    {paginatedContracts.map(contract => {
                        const status = statusConfig[contract.status];
                        const contractorType = contractorTypeConfig[contract.contractorType];
                        return (
                            <TableRow key={contract.id}>
                                <TableCell className="font-semibold">{contract.contractorName}</TableCell>
                                <TableCell><div className="flex items-center gap-2 text-muted-foreground"><contractorType.icon className="h-4 w-4"/><span>{contractorType.label}</span></div></TableCell>
                                <TableCell>{contract.roleOrService}</TableCell>
                                <TableCell>
                                    <div>{format(new Date(contract.startDate), 'dd/MM/yy')}</div>
                                    <div className="text-xs text-muted-foreground">{contract.endDate ? `au ${format(new Date(contract.endDate), 'dd/MM/yy')}` : 'Actif'}</div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className={cn('border-0', status.color)}><status.icon className="h-3 w-3 mr-1.5"/>{status.label}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedContract(contract)}><Eye className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
         <CardFooter className="flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">Affichage de {paginatedContracts.length} sur {filteredContracts.length} contrats</p>
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="h-8 w-8"><ChevronLeft/></Button>
                    <span className="text-sm font-medium">Page {currentPage} sur {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="h-8 w-8"><ChevronRight/></Button>
                </div>
            )}
        </CardFooter>
      </Card>
      
      <ContractDetailsModal contract={selectedContract} onClose={() => setSelectedContract(null)} />
    </div>
  );
}
