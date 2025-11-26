
'use client';
import Link from 'next/link';
import {
  Camera,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Settings,
  Award,
  Users,
  BookOpen,
  PieChart,
  UserCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { userData } from '@/lib/static-data';
import { getInitials } from '@/lib/messages-data';

const advisorData = {
    ...userData['academic-advisor'],
    title: "Responsable Pédagogique",
    department: "Département Informatique",
    email: "jean.moreau@univ.fr",
    phone: "+33 1 23 45 67 88",
    office: "Bureau C201",
    bio: "Responsable pédagogique passionné par l'innovation dans l'éducation et l'accompagnement à la réussite étudiante. Plus de 15 ans d'expérience dans l'enseignement supérieur.",
    stats: {
        students: 2450,
        teachers: 124,
        programs: 27,
        successRate: 89,
    },
    responsibilities: [
        "Coordination des programmes de Licence et Master.",
        "Suivi personnalisé des étudiants en difficulté.",
        "Validation des maquettes de cours et des plannings.",
        "Présidence des jurys de semestre.",
        "Relation avec les entreprises pour les stages."
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
                            <AvatarImage src={advisorData.avatar} />
                            <AvatarFallback className="text-4xl">
                            {getInitials(advisorData.name)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <h1 className="text-2xl font-bold">{advisorData.name}</h1>
                    <p className="text-primary font-medium">{advisorData.title}</p>
                    <p className="text-muted-foreground text-sm mb-4">{advisorData.department}</p>
                    
                    <div className="space-y-2 text-sm text-left">
                        <div className="flex items-center text-muted-foreground"><Mail className="mr-3 h-4 w-4"/><span>{advisorData.email}</span></div>
                        <div className="flex items-center text-muted-foreground"><Phone className="mr-3 h-4 w-4"/><span>{advisorData.phone}</span></div>
                        <div className="flex items-center text-muted-foreground"><MapPin className="mr-3 h-4 w-4"/><span>{advisorData.office}</span></div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <Button className="w-full" asChild><Link href="/academic-advisor/settings"><Edit className="mr-2"/> Modifier le profil</Link></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.1s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mx-auto mb-2"><Users/></div>
                        <p className="text-2xl font-bold">{advisorData.stats.students}</p>
                        <p className="text-xs text-muted-foreground">Étudiants</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.2s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-500 mx-auto mb-2"><UserCheck/></div>
                        <p className="text-2xl font-bold">{advisorData.stats.teachers}</p>
                        <p className="text-xs text-muted-foreground">Enseignants</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.3s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 mx-auto mb-2"><BookOpen/></div>
                        <p className="text-2xl font-bold">{advisorData.stats.programs}</p>
                        <p className="text-xs text-muted-foreground">Programmes</p>
                    </CardContent>
                </Card>
                 <Card className="animate-fadeIn hover-lift" style={{animationDelay: "0.4s"}}>
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mx-auto mb-2"><Award/></div>
                        <p className="text-2xl font-bold">{advisorData.stats.successRate}%</p>
                        <p className="text-xs text-muted-foreground">Taux de réussite</p>
                    </CardContent>
                </Card>
            </div>
             <Card className="animate-fadeIn" style={{animationDelay: "0.5s"}}>
                <CardHeader>
                    <CardTitle>À propos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{advisorData.bio}</p>
                </CardContent>
            </Card>
        </div>
      </div>
      <Card className="animate-fadeIn" style={{animationDelay: "0.6s"}}>
        <CardHeader>
            <CardTitle className="flex items-center"><GraduationCap className="mr-2"/>Responsabilités Principales</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {advisorData.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
            </ul>
        </CardContent>
        <CardFooter>
            <Button variant="link" asChild><Link href="/academic-advisor/dashboard">Voir le tableau de bord détaillé</Link></Button>
        </CardFooter>
    </Card>
    </div>
  );
};

export default ProfilePage;
