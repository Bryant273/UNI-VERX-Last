'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Download, MessageSquare, FileText, CalendarCheck } from 'lucide-react';
import { getInitials } from '@/lib/messages-data';
import type { Student } from '@/lib/students-data';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

const getAverageColor = (average: number) => {
  if (average >= 16) return 'text-green-600 dark:text-green-400';
  if (average >= 14) return 'text-blue-600 dark:text-blue-400';
  if (average >= 10) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export default function StudentProfileModal({ student, onClose }: StudentProfileModalProps) {
  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4">
              <AvatarImage src={student.photo} alt={student.name} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{student.name}</DialogTitle>
              <DialogDescription>{student.className} • {student.studentId}</DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="text-xs inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-medium"><Mail className="mr-1 h-3 w-3"/>{student.email}</div>
                <div className="text-xs inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-medium"><Phone className="mr-1 h-3 w-3"/>{student.phone}</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 space-y-6 pt-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">Performance académique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Moyenne générale</span>
                        <span className={cn("text-2xl font-bold", getAverageColor(student.average))}>{student.average}/20</span>
                    </div>
                     <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Classement</span>
                        <span className="font-bold">{student.ranking}/{student.totalStudents}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Crédits validés</span>
                            <span className="font-semibold">{student.validatedCredits}/{student.totalCredits}</span>
                        </div>
                        <Progress value={(student.validatedCredits / student.totalCredits) * 100} />
                    </div>
                </CardContent>
             </Card>
              <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">Assiduité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-baseline">
                        <span className="text-muted-foreground">Taux de présence</span>
                        <span className="text-2xl font-bold">{student.attendance}%</span>
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Statut</span>
                            <span className="font-semibold">{student.passStatus}</span>
                        </div>
                    </div>
                </CardContent>
             </Card>
           </div>
           
            <div>
              <h4 className="font-semibold mb-2">Dernières évaluations</h4>
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Matière</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {student.academicResults.s2.slice(0, 4).map((res, i) => (
                       <TableRow key={i}>
                           <TableCell>{res.module}</TableCell>
                           <TableCell className={cn("font-semibold", getAverageColor(parseFloat(res.grade.replace(',', '.'))))}>{res.grade}</TableCell>
                       </TableRow>
                   ))}
                </TableBody>
              </Table>
            </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>Fermer</Button>
          <Button variant="outline"><CalendarCheck className="mr-2"/>Présences</Button>
          <Button variant="outline"><FileText className="mr-2"/>Bulletin</Button>
          <Button><MessageSquare className="mr-2"/>Contacter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
