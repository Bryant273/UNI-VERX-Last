'use client';
import { Button } from "@/components/ui/button";
import SettingsCard from "./SettingsCard";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


export default function PrivacySettingsTab() {
    const { toast } = useToast();
    const [deleteInput, setDeleteInput] = useState('');

    const handleDownloadData = () => {
        toast({
            title: "Exportation en cours...",
            description: "Vos données sont en cours de préparation. Le téléchargement démarrera bientôt.",
        });
    }

    return (
        <div className="space-y-6">
            <SettingsCard title="Visibilité du profil">
                <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0">
                        <div>
                            <h4 className="font-medium">Profil visible par les autres étudiants</h4>
                            <p className="text-sm text-muted-foreground">Permet aux autres étudiants de voir votre profil.</p>
                        </div>
                        <Switch id="profile-visible-students" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between pt-6">
                        <div>
                            <h4 className="font-medium">Profil visible par les entreprises</h4>
                            <p className="text-sm text-muted-foreground">Permet aux entreprises partenaires de voir votre profil.</p>
                        </div>
                        <Switch id="profile-visible-companies" defaultChecked />
                    </div>
                </div>
            </SettingsCard>
            
             <SettingsCard title="Informations partagées">
                <div className="space-y-6 divide-y divide-border">
                    <div className="flex items-center justify-between pt-6 first:pt-0">
                        <div>
                            <h4 className="font-medium">Email de contact</h4>
                            <p className="text-sm text-muted-foreground">Partager votre email avec les autres utilisateurs.</p>
                        </div>
                        <Switch id="share-email" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between pt-6">
                        <div>
                            <h4 className="font-medium">Numéro de téléphone</h4>
                            <p className="text-sm text-muted-foreground">Partager votre numéro de téléphone.</p>
                        </div>
                        <Switch id="share-phone" />
                    </div>
                    <div className="flex items-center justify-between pt-6">
                        <div>
                            <h4 className="font-medium">Résultats académiques</h4>
                            <p className="text-sm text-muted-foreground">Partager vos résultats avec les entreprises.</p>
                        </div>
                        <Switch id="share-results" defaultChecked />
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title="Gestion des données">
                 <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                             <h4 className="font-medium">Exporter vos données</h4>
                            <p className="text-sm text-muted-foreground">Téléchargez une archive de toutes vos données personnelles.</p>
                        </div>
                        <Button variant="outline" onClick={handleDownloadData}>Télécharger</Button>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                                <div>
                                    <h4 className="font-medium text-destructive">Supprimer votre compte</h4>
                                    <p className="text-sm text-destructive/80">Cette action est définitive et irréversible.</p>
                                </div>
                                <Button variant="destructive">Supprimer</Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Êtes-vous absolument sûr ?</DialogTitle>
                                <DialogDescription>
                                    Cette action est irréversible. Toutes vos données seront définitivement supprimées. Pour confirmer, veuillez taper "SUPPRIMER" dans le champ ci-dessous.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="delete-confirm">Confirmation</Label>
                                <Input 
                                    id="delete-confirm" 
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    placeholder='SUPPRIMER'
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="ghost">Annuler</Button></DialogClose>
                                <Button variant="destructive" disabled={deleteInput !== 'SUPPRIMER'}>Je comprends, supprimer mon compte</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                 </div>
            </SettingsCard>
        </div>
    )
}
