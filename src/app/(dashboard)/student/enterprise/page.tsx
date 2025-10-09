
'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { studentData } from '@/lib/static-data';
import { enterpriseData } from '@/lib/enterprise-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, FileDown, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center py-1.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
    </div>
);

export default function EnterpriseAccessPage() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasInternship = true; // Simule si l'étudiant a un stage

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-0">
                    <div className="bg-primary text-primary-foreground p-6 md:p-8 rounded-t-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Student Info */}
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-4 border-primary-foreground/20">
                                    <AvatarImage src={studentData.avatar} alt={studentData.name} />
                                    <AvatarFallback>{getInitials(studentData.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold">{studentData.name}</h2>
                                    <p className="text-sm opacity-80">Niveau : {studentData.level}</p>
                                    <p className="text-sm opacity-80">Spécialité : {studentData.speciality}</p>
                                </div>
                            </div>
                            {/* Enterprise Info */}
                            {hasInternship && (
                                <div className="flex items-center gap-4 justify-start md:justify-end">
                                    <Avatar className={cn(
                                        "h-20 w-20 border-4 border-primary-foreground/20 bg-white p-2",
                                        !enterpriseData.company.logo && "p-0"
                                    )}>
                                        <AvatarImage src={enterpriseData.company.logo} alt={enterpriseData.company.name} className="object-contain" />
                                        <AvatarFallback>{getInitials(enterpriseData.company.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-bold">{enterpriseData.company.name}</h3>
                                        <p className="text-sm opacity-80">{enterpriseData.company.sector}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     {hasInternship && (
                        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <p className="text-muted-foreground">Poste</p>
                                <p className="font-semibold text-lg">{enterpriseData.internship.title}</p>
                            </div>
                             <p className="text-sm text-muted-foreground text-center md:text-right mt-4 md:mt-0">
                                {enterpriseData.internship.period}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Portail Entreprise</CardTitle>
                    <CardDescription>Connectez-vous à l'ERP de l'entreprise pour suivre vos missions et votre progression.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button size="lg" className="w-full md:w-auto" onClick={() => setLoginModalOpen(true)}>Se Connecter</Button>
                </CardContent>
            </Card>
            
            {hasInternship && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Détails du Contrat</CardTitle>
                            <CardDescription>Informations administratives concernant votre stage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <InfoRow label="Durée" value={enterpriseData.internship.duration} />
                            <Separator />
                            <InfoRow label="Date de début" value={enterpriseData.internship.startDate} />
                             <Separator />
                            <InfoRow label="Date de fin" value={enterpriseData.internship.endDate} />
                             <Separator />
                            <InfoRow label="Type de contrat" value={enterpriseData.internship.contractType} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Accédez aux documents relatifs à votre stage.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                           <Button variant="outline" className="justify-start">
                                <FileDown className="mr-2 h-4 w-4" />
                                Télécharger le contrat
                           </Button>
                            <Button variant="outline" className="justify-start">
                                <FileDown className="mr-2 h-4 w-4" />
                                Télécharger l'attestation de fin de stage
                           </Button>
                            <Button variant="outline" className="justify-start">
                                <FileDown className="mr-2 h-4 w-4" />
                                Télécharger la convention de stage
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {/* Login Modal */}
            <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accès au portail {enterpriseData.company.name}</DialogTitle>
                        <DialogDescription>
                            Vos identifiants UNI-VERX sont utilisés pour accéder au portail de l'entreprise.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={studentData.email} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} value={studentData.password} readOnly />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                         <p className="text-xs text-muted-foreground pt-2">
                            Pour des raisons de sécurité, vous serez redirigé vers le portail de connexion de {enterpriseData.company.name}.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setLoginModalOpen(false)}>Continuer vers la connexion</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
