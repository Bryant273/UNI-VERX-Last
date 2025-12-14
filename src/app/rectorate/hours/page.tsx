'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, Hourglass } from 'lucide-react';
import { initialTimeSlots, initialDays, initialBreaks, type TimeSlot, type DaySetting, type BreakSetting } from '@/lib/hours-data';

const SlotModal = ({
  slot,
  isOpen,
  onClose,
  onSave,
  type
}: {
  slot: TimeSlot | BreakSetting | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'slot' | 'break';
}) => {
  const [start, setStart] = useState(slot?.start || '');
  const [end, setEnd] = useState(slot?.end || '');
  const [name, setName] = useState(type === 'break' ? (slot as BreakSetting)?.name || '' : '');

  const handleSave = () => {
    const commonData = { id: slot?.id, start, end };
    if (type === 'break') {
      onSave({ ...commonData, name });
    } else {
      onSave(commonData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{slot ? 'Modifier' : 'Ajouter'} un {type === 'slot' ? 'créneau' : 'une pause'}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {type === 'break' && (
            <div className="space-y-2">
              <Label htmlFor="break-name">Nom de la pause</Label>
              <Input id="break-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Pause déjeuner" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Heure de début</Label>
              <Input id="start-time" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">Heure de fin</Label>
              <Input id="end-time" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Annuler</Button></DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function HoursPage() {
  const [days, setDays] = useState<DaySetting[]>(initialDays);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [breaks, setBreaks] = useState<BreakSetting[]>(initialBreaks);
  
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [editingBreak, setEditingBreak] = useState<BreakSetting | null>(null);
  
  const { toast } = useToast();

  const handleToggleDay = (dayId: string) => {
    setDays(days.map(day => day.id === dayId ? { ...day, active: !day.active } : day));
  };

  const handleSaveSlots = (slotData: TimeSlot) => {
    if (slotData.id) {
        setTimeSlots(timeSlots.map(s => s.id === slotData.id ? slotData : s));
    } else {
        setTimeSlots([...timeSlots, { ...slotData, id: Date.now() }]);
    }
  };
  
  const handleDeleteSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(s => s.id !== id));
  };
  
  const handleSaveBreaks = (breakData: BreakSetting) => {
    if (breakData.id) {
        setBreaks(breaks.map(b => b.id === breakData.id ? breakData : b));
    } else {
        setBreaks([...breaks, { ...breakData, id: Date.now() }]);
    }
  };

  const handleDeleteBreak = (id: number) => {
    setBreaks(breaks.filter(b => b.id !== id));
  };

  const handleSaveAll = () => {
    toast({
        title: "Configuration enregistrée",
        description: "La structure de l'emploi du temps a été mise à jour.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2"><Hourglass /> Définition des Heures</CardTitle>
              <CardDescription>
                Configurez la structure des emplois du temps de l'université.
              </CardDescription>
            </div>
             <Button onClick={handleSaveAll}><Save className="mr-2 h-4 w-4"/> Enregistrer la configuration</Button>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Jours d'ouverture</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {days.map(day => (
                    <div key={day.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <Label htmlFor={`day-${day.id}`} className="text-base">{day.name}</Label>
                        <Switch id={`day-${day.id}`} checked={day.active} onCheckedChange={() => handleToggleDay(day.id)} />
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Créneaux Horaires</CardTitle>
                        <Button variant="outline" onClick={() => { setEditingSlot(null); setIsSlotModalOpen(true); }}><Plus className="mr-2 h-4 w-4"/> Ajouter</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Début</TableHead><TableHead>Fin</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {timeSlots.sort((a,b) => a.start.localeCompare(b.start)).map(slot => (
                                <TableRow key={slot.id}>
                                    <TableCell className="font-mono">{slot.start}</TableCell>
                                    <TableCell className="font-mono">{slot.end}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingSlot(slot); setIsSlotModalOpen(true); }}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSlot(slot.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Pauses et Déjeuner</CardTitle>
                        <Button variant="outline" onClick={() => { setEditingBreak(null); setIsBreakModalOpen(true); }}><Plus className="mr-2 h-4 w-4"/> Ajouter</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Début</TableHead><TableHead>Fin</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {breaks.sort((a,b) => a.start.localeCompare(b.start)).map(b => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">{b.name}</TableCell>
                                    <TableCell className="font-mono">{b.start}</TableCell>
                                    <TableCell className="font-mono">{b.end}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingBreak(b); setIsBreakModalOpen(true); }}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteBreak(b.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {isSlotModalOpen && <SlotModal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} slot={editingSlot} onSave={handleSaveSlots} type="slot" />}
      {isBreakModalOpen && <SlotModal isOpen={isBreakModalOpen} onClose={() => setIsBreakModalOpen(false)} slot={editingBreak} onSave={handleSaveBreaks} type="break" />}
    </div>
  );
}
