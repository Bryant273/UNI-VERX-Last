'use client';

import React, { useState } from 'react';
import {
  FileText,
  Palette,
  Edit,
  Plus,
  Eye,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  Heading1,
  Baseline
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { templatesData, type DocumentTemplate } from '@/lib/templates-data';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(templatesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const { toast } = useToast();

  const handleOpenModal = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };
  
  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingTemplate) return;

      const formData = new FormData(e.currentTarget);
      
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? { ...t, isCustomized: true, lastModified: new Date().toLocaleDateString('fr-FR') } : t
      ));

      toast({
          title: 'Modèle sauvegardé !',
          description: `Le modèle pour "${editingTemplate.name}" a été mis à jour.`
      });
      setIsModalOpen(false);
  }

  const handleResetTemplate = () => {
    if (!editingTemplate) return;
    setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? { ...t, isCustomized: false, lastModified: undefined } : t
    ));
    toast({
        title: 'Modèle réinitialisé',
        description: `Le modèle par défaut est maintenant utilisé pour "${editingTemplate.name}".`,
        variant: 'destructive'
    });
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Modèles de Documents</CardTitle>
          <CardDescription>
            Personnalisez les modèles pour tous les documents officiels générés par l'université.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des modèles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de document</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(template => (
                <TableRow key={template.id}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      <template.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{template.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {template.isCustomized ? (
                      <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10">Personnalisé</Badge>
                    ) : (
                      <Badge variant="secondary">Défaut</Badge>
                    )}
                  </TableCell>
                  <TableCell>{template.lastModified || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(template)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(template)}>
                      <Palette className="mr-2 h-4 w-4" />
                      {template.isCustomized ? 'Modifier' : 'Personnaliser'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {editingTemplate && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Personnaliser le modèle : {editingTemplate.name}</DialogTitle>
                    <DialogDescription>
                        Modifiez l'en-tête, le pied de page et le logo pour ce type de document.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaveChanges}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo de l'université</Label>
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-md border flex items-center justify-center bg-muted/50">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground"/>
                                     </div>
                                      <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                                        <UploadCloud className="mr-2"/> Changer le logo
                                    </Button>
                                    <Input id="logo-upload" type="file" className="hidden" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="header-text"><Heading1 className="inline-block mr-2 h-4 w-4"/> Texte de l'en-tête</Label>
                                <Textarea id="header-text" name="header" rows={4} defaultValue={"Université de l'Innovation\nUFR Sciences et Technologies"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="footer-text"><Baseline className="inline-block mr-2 h-4 w-4"/>Texte du pied de page</Label>
                                <Textarea id="footer-text" name="footer" rows={3} defaultValue={"123 Avenue de l'Innovation, 75001 Paris\ncontact@uni-verx.edu - +33 1 23 45 67 89"}/>
                            </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Eye className="h-4 w-4"/> Aperçu (simulation)</h4>
                             <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md border min-h-[400px] flex flex-col">
                                <div className="text-center border-b pb-4 mb-4">
                                    <p className="font-bold">Université de l'Innovation</p>
                                    <p className="text-sm text-muted-foreground">UFR Sciences et Technologies</p>
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-lg font-bold text-center my-4">{editingTemplate.name}</h2>
                                    <p className="text-sm text-center text-muted-foreground">[Contenu du document ici]</p>
                                </div>
                                <div className="text-center border-t pt-4 mt-4 text-xs text-muted-foreground">
                                    <p>123 Avenue de l'Innovation, 75001 Paris</p>
                                    <p>contact@uni-verx.edu - +33 1 23 45 67 89</p>
                                </div>
                             </div>
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="button" variant="destructive" onClick={handleResetTemplate}>Réinitialiser</Button>
                        <div className="flex-grow"></div>
                        <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer les modifications</Button>
                    </DialogFooter>
                  </form>
              </DialogContent>
          </Dialog>
      )}

    </div>
  );
}
