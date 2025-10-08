
'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { studentData } from '@/lib/static-data';
import { enterpriseData } from '@/lib/enterprise-data';
import { getInitials } from '@/lib/messages-data';
import { cn } from '@/lib/utils';


export default function EnterpriseAccessPage() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
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
                            <Button size="lg" className="mt-4 md:mt-0" onClick={() => setLoginModalOpen(true)}>Se Connecter</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Login Modal */}
            <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accès au portail {enterpriseData.company.name}</DialogTitle>
                        <DialogDescription>
                            Saisissez vos identifiants fournis par l'entreprise pour vous connecter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Cette action vous redirigera vers le portail externe de l'entreprise.</p>
                        <p className="text-sm p-3 bg-muted rounded-md">Identifiant: <span className="font-mono bg-background px-2 py-1 rounded">{enterpriseData.loginInfo.username}</span></p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setLoginModalOpen(false)}>Annuler</Button>
                        <Button onClick={() => setLoginModalOpen(false)}>Se connecter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
