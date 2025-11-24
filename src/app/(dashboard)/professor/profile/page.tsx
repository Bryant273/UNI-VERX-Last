
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
  BookOpen,
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
import { userData } from '@/lib/static-data';
import { cn } from '@/lib/utils';


const professorData = {
    ...userData.professor,
    title: "Professeur d'Informatique",
    department: "Université Paris-Sud • Département Informatique",
    email: "claire.dubois@univ-paris.fr",
    phone: "+33 1 23 45 67 89",
    office: "Bureau B305",
    bio: "Docteur en Informatique avec 12 ans d'expérience dans l'enseignement supérieur et la recherche. Spécialisée en bases de données, intelligence artificielle et systèmes d'information. Passionnée par l'innovation pédagogique et l'encadrement d'étudiants. Auteure de plus de 20 publications dans des revues internationales et conférences de premier plan.",
    stats: {
        students: 185,
        courses: 4,
        publications: 23,
        experience: 12,
    },
    skills: [
        { name: "Python", level: 95 },
        { name: "Bases de données", level: 90 },
        { name: "Machine Learning", level: 85 },
        { name: "Java", level: 80 },
        { name: "JavaScript", level: 75 },
    ],
    expertise: [
        "Intelligence Artificielle",
        "Bases de Données",
        "Algorithmes",
        "Programmation Web",
        "Réseaux de neurones",
        "Data Mining",
        "Systèmes distribués",
        "Cloud Computing",
    ],
    studentEvaluation: 4.8,
    publications: [
        { title: "Advanced Database Optimization Techniques for Large-Scale Applications", venue: "IEEE Transactions on Knowledge and Data Engineering • 2024", type: "Article de journal", color: "blue" },
        { title: "Machine Learning Applications in Educational Data Mining", venue: "International Conference on Educational Data Mining • 2023", type: "Conférence", color: "green" },
        { title: "Artificial Intelligence in Higher Education: Challenges and Opportunities", venue: "Springer • 2023", type: "Chapitre de livre", color: "purple" },
    ],
    education: [
        { title: "Doctorat en Informatique", institution: "Université Paris-Sud • 2012", description: "Spécialisation en Intelligence Artificielle et Bases de Données", icon: GraduationCap },
        { title: "AWS Certified Solutions Architect", institution: "Amazon Web Services • 2023", description: "Architecture cloud et systèmes distribués", icon: Award },
        { title: "Google Cloud Professional Data Engineer", institution: "Google Cloud • 2022", description: "Ingénierie des données et analyse", icon: Medal },
    ]
};

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
            <Card className="animate-fadeIn">
                <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                            <AvatarImage src={professorData.avatar} />
                            <AvatarFallback className="text-4xl">
                            {professorData.name.split(' ').map((n) => n[0]).join('')}
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
                    <h1 className="text-2xl font-bold">{professorData.name}</h1>
                    <p className="text-primary font-medium">{professorData.title}</p>
                    <p className="text-muted-foreground text-sm mb-4">{professorData.department}</p>
                    
                    <div className="space-y-2 text-sm text-left">
                        <div className="flex items-center text-muted-foreground"><Mail className="mr-3 h-4 w-4"/><span>{professorData.email}</span></div>
                        <div className="flex items-center text-muted-foreground"><Phone className="mr-3 h-4 w-4"/><span>{professorData.phone}</span></div>
                        <div className="flex items-center text-muted-foreground"><MapPin className="mr-3 h-4 w-4"/><span>{professorData.office}</span></div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <Button className="w-full" asChild><Link href="/professor/settings"><Edit className="mr-2"/> Modifier le profil</Link></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.1s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mx-auto mb-2"><Users/></div>
                        <p className="text-2xl font-bold">{professorData.stats.students}</p>
                        <p className="text-xs text-muted-foreground">Étudiants</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.2s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-500 mx-auto mb-2"><BookOpen/></div>
                        <p className="text-2xl font-bold">{professorData.stats.courses}</p>
                        <p className="text-xs text-muted-foreground">Cours actifs</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.3s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 mx-auto mb-2"><FileText/></div>
                        <p className="text-2xl font-bold">{professorData.stats.publications}</p>
                        <p className="text-xs text-muted-foreground">Publications</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.4s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mx-auto mb-2"><Award/></div>
                        <p className="text-2xl font-bold">{professorData.stats.experience}</p>
                        <p className="text-xs text-muted-foreground">Années d'exp.</p>
                    </CardContent>
                </Card>
            </div>
             <Card className="animate-fadeIn" style={{animationDelay: "0.5s"}}>
                <CardHeader>
                    <CardTitle className="flex items-center"><User className="mr-2"/>À propos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{professorData.bio}</p>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fadeIn" style={{animationDelay: "0.6s"}}>
            <CardHeader>
                <CardTitle className="flex items-center"><Code className="mr-2"/>Compétences techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {professorData.skills.map(skill => (
                    <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-muted-foreground">{skill.name}</span>
                            <span className="font-bold text-primary">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} />
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card className="animate-fadeIn" style={{animationDelay: "0.7s"}}>
            <CardHeader>
                <CardTitle className="flex items-center"><BrainCircuit className="mr-2"/>Domaines d'expertise</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {professorData.expertise.map(exp => <Badge key={exp}>{exp}</Badge>)}
                </div>
                 <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">Évaluation étudiante moyenne</h5>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-5 w-5", i < Math.round(professorData.studentEvaluation) ? 'fill-current' : '')} />)}
                            </div>
                            <span className="text-lg font-bold">{professorData.studentEvaluation}/5</span>
                        </div>
                        <span className="text-xs text-muted-foreground">basé sur 127 évaluations</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fadeIn" style={{animationDelay: "0.8s"}}>
            <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2"/>Publications récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {professorData.publications.map((pub, i) => (
                    <div key={i} className={`border-l-4 border-${pub.color}-500 pl-4 py-2`}>
                        <h5 className="font-medium text-sm">{pub.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{pub.venue}</p>
                        <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline">{pub.type}</Badge>
                            <Button variant="link" size="sm" className="h-auto p-0">Voir plus</Button>
                        </div>
                    </div>
                ))}
                 <div className="mt-4 pt-4 border-t">
                    <Button variant="link" className="p-0 h-auto">Voir toutes les publications</Button>
                </div>
            </CardContent>
        </Card>
        <Card className="animate-fadeIn" style={{animationDelay: "0.9s"}}>
            <CardHeader>
                <CardTitle className="flex items-center"><GraduationCap className="mr-2"/>Formation et certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {professorData.education.map((edu, i) => (
                     <div key={i} className="relative">
                        {i < professorData.education.length -1 && <div className="absolute left-5 top-11 -bottom-4 w-0.5 bg-border"></div>}
                        <div className="flex items-start">
                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0 z-10">
                                <edu.icon/>
                            </div>
                            <div className="flex-1">
                                <h5 className="font-medium text-sm">{edu.title}</h5>
                                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default ProfilePage;

    