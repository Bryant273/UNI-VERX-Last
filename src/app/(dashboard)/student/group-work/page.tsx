'use client';

import {
  LayoutGrid,
  List,
  Plus,
  Filter,
  Users,
  MessageSquare,
  FileText,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function GroupWorkPage() {
  return (
    <div className="flex flex-col h-full">
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Tous les TDs</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Achevés</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Récemment mis à jour</SelectItem>
                <SelectItem value="deadline">Date d'échéance</SelectItem>
                <SelectItem value="priority">Priorité</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2" />
              Nouveau TD
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex-1 mt-6">
        <p className="text-center text-muted-foreground">La page des travaux de groupe est en construction.</p>
        <p className="text-center text-muted-foreground mt-2">Nous allons la construire ensemble, étape par étape.</p>
      </div>

    </div>
  );
}
