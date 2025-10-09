
'use client';
import Link from 'next/link';

import {
  Camera,
  Check,
  CheckCircle,
  Clock,
  Code,
  Database,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Medal,
  Phone,
  Settings,
  Star,
  Trophy,
  Users,
  Award,
  BrainCircuit,
  Projector,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { studentData } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { semesterResults } from '@/lib/results-data';

const coursesForTable = [
    ...semesterResults.s1.courses.map(c => ({...c, teacher: 'Prof. A'})),
    ...semesterResults.s2.courses.map(c => ({...c, teacher: 'Prof. B'}))
];

const getStatusForGrade = (grade: string) => {
    const numericGrade = parseFloat(grade.split('/')[0].replace(',', '.'));
    if (numericGrade >= 10) {
        return <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-500/10">Validé</Badge>;
    }
    if (numericGrade < 10 && numericGrade > 0) {
        return <Badge variant="outline" className="text-red-600 border-red-600/30 bg-red-500/10">Rattrapage</Badge>;
    }
    return <Badge variant="outline">En cours</Badge>;
};

const skills = [
  { name: "Python", category: "Technique", acquired: true },
  { name: "SQL", category: "Technique", acquired: true },
  { name: "JavaScript", category: "Technique", acquired: true },
  { name: "React", category: "Technique", acquired: false },
  { name: "Travail en équipe", category: "Transversale", acquired: true },
  { name: "Communication", category: "Transversale", acquired: true },
  { name: "Résolution de problèmes", category: "Transversale", acquired: true },
  { name: "Gestion de projet", category: "Transversale", acquired: false },
  { name: "Français", category: "Langue", acquired: true },
  { name: "Anglais", category: "Langue", acquired: true },
];


const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="px-6 pt-0 pb-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={studentData.avatar} />
                <AvatarFallback className="text-4xl">
                  {studentData.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm group-hover:bg-background"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{studentData.name}</h1>
                  <p className="text-muted-foreground">{studentData.class} • #{studentData.id}</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/student/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Modifier le profil
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{studentData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+33 6 12 34 56 78</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>123 Rue des Étudiants, 75005 Paris</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="progression" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progression">Progression</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>
        <TabsContent value="progression" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progression générale</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="relative h-40 w-40">
                  <Progress
                    value={76}
                    className="absolute w-full h-full rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-foreground">
                    76%
                  </div>
                </div>
                <p className="text-muted-foreground">Avancement du programme du semestre</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center">
                    <div><p className="font-bold text-lg">15</p><p className="text-xs text-muted-foreground">Cours suivis</p></div>
                    <div><p className="font-bold text-lg">87%</p><p className="text-xs text-muted-foreground">Présence</p></div>
                    <div><p className="font-bold text-lg">12.5</p><p className="text-xs text-muted-foreground">Moyenne</p></div>
                    <div><p className="font-bold text-lg">8</p><p className="text-xs text-muted-foreground">Devoirs rendus</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Suivi des Unités d'Enseignement (UE)</CardTitle>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matière</TableHead>
                        <TableHead>Moyenne</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coursesForTable.slice(0,5).map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.module}</TableCell>
                          <TableCell>{course.grade}</TableCell>
                          <TableCell>{getStatusForGrade(course.grade)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="competences" className="mt-6">
           <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader><CardTitle>Référentiel de Compétences</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Compétence</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead className="text-center">Évaluation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {skills.map((skill) => (
                                    <TableRow key={skill.name}>
                                        <TableCell className="font-medium">{skill.name}</TableCell>
                                        <TableCell>{skill.category}</TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={skill.acquired} aria-label={`Compétence ${skill.name} ${skill.acquired ? 'acquise' : 'non acquise'}`} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
           </div>
        </TabsContent>
        <TabsContent value="badges" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Badges Obtenus</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-yellow-400 text-white flex items-center justify-center"><Star/></div><div><p className="font-semibold">Excellence Académique</p><p className="text-xs text-muted-foreground">Moyenne générale supérieure à 16/20</p></div></div>
                        <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center"><Code/></div><div><p className="font-semibold">Expert en Programmation</p><p className="text-xs text-muted-foreground">Note maximale au projet de POO</p></div></div>
                         <div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center"><Database/></div><div><p className="font-semibold">Maître des Bases de Données</p><p className="text-xs text-muted-foreground">100% de réussite aux exercices SQL</p></div></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Badges à Débloquer</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 opacity-50"><div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center"><Trophy/></div><div><p className="font-semibold">Major de Promotion</p><p className="text-xs text-muted-foreground">Terminer 1er de votre promotion</p></div></div>
                        <div className="flex items-center gap-4 opacity-50"><div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center"><Projector/></div><div><p className="font-semibold">Innovateur</p><p className="text-xs text-muted-foreground">Créer un projet innovant primé</p></div></div>
                        <div className="flex items-center gap-4 opacity-50"><div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center"><BrainCircuit/></div><div><p className="font-semibold">Expert en IA</p><p className="text-xs text-muted-foreground">Réaliser un projet d'IA fonctionnel</p></div></div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="parametres" className="mt-6 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Paramètres du Compte</CardTitle>
                    <CardDescription>Modifiez vos informations, préférences et plus encore.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Settings className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                     <Button asChild>
                        <Link href="/student/settings">Accéder aux paramètres</Link>
                     </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;


