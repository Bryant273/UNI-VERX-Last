
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Edit,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Calendar,
    UserCircle,
    Award,
    Code,
    Users,
    Languages,
    Trophy,
    BookOpen,
    BrainCircuit,
    Star,
    Check,
    Briefcase,
} from 'lucide-react';
import { studentData } from '@/lib/static-data';
import { profileData, type Skill, type Badge as BadgeType, type Project } from '@/lib/profile-data';
import { getInitials } from '@/lib/messages-data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

const ProfileHeader = () => (
    <Card>
      <div className="h-24 md:h-32 bg-gradient-to-r from-primary to-secondary rounded-t-lg" />
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start -mt-16">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={studentData.avatar} />
            <AvatarFallback>{getInitials(studentData.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-0 sm:ml-4 mt-2 sm:mt-8 flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">{studentData.name}</h1>
                    <p className="text-sm text-muted-foreground">{studentData.class} • {studentData.id}</p>
                </div>
                <Button className="mt-3 sm:mt-0">
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground"/><span>{studentData.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground"/><span>06 12 34 56 78</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground"/><span>Paris, France</span></div>
            <div className="flex items-center gap-3"><GraduationCap className="h-4 w-4 text-muted-foreground"/><span>{studentData.ufr}</span></div>
            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground"/><span>Année {studentData.academicYear}</span></div>
            <div className="flex items-center gap-3"><UserCircle className="h-4 w-4 text-muted-foreground"/><span>Tuteur: Dr. Marie Leclerc</span></div>
        </div>
      </CardContent>
    </Card>
);

const ProgressionTab = () => {
    const chartData = [{ name: 'Complété', value: profileData.progression.general.percentage, fill: 'var(--color-completed)' }];
    const chartConfig = { completed: { label: 'Complété', color: 'hsl(var(--primary))' } };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Progression du semestre</CardTitle></CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-4">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-40">
                         <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={60} startAngle={90} endAngle={450}>
                                <Cell/>
                            </Pie>
                         </PieChart>
                    </ChartContainer>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.progression.stats.coursesTaken}</p>
                            <p className="text-xs text-muted-foreground">Cours suivis</p>
                        </div>
                         <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.progression.stats.attendance}%</p>
                            <p className="text-xs text-muted-foreground">Présence</p>
                        </div>
                         <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.progression.stats.assignmentsDone}</p>
                            <p className="text-xs text-muted-foreground">Devoirs rendus</p>
                        </div>
                         <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.progression.stats.gpa.toFixed(1)}/20</p>
                            <p className="text-xs text-muted-foreground">Moyenne</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Progression par matière</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {profileData.progression.bySubject.map(s => (
                        <div key={s.name}>
                            <div className="flex justify-between mb-1"><span className="text-sm font-medium">{s.name}</span><span className="text-sm text-muted-foreground">{s.progress}%</span></div>
                            <Progress value={s.progress} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

const SkillsTab = () => {
    const SkillCard: React.FC<{title: string, skills: Skill[], icon: LucideIcon}> = ({title, skills, icon: Icon}) => (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/> {title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {skills.map(skill => (
                    <div key={skill.name}>
                        <div className="flex justify-between mb-1"><span className="text-sm font-medium">{skill.name}</span><span className="text-sm text-muted-foreground">{skill.level}%</span></div>
                        <Progress value={skill.level} />
                    </div>
                ))}
            </CardContent>
        </Card>
    )

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard title="Compétences techniques" skills={profileData.skills.technical} icon={Code} />
            <SkillCard title="Compétences transversales" skills={profileData.skills.soft} icon={Users} />
            <div className="space-y-6">
                <SkillCard title="Langues" skills={profileData.skills.languages} icon={Languages} />
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary"/> Projets récents</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {profileData.projects.map(project => (
                            <div key={project.name} className="p-3 bg-muted/50 rounded-lg">
                                <p className="font-semibold text-sm">{project.name}</p>
                                <p className="text-xs text-muted-foreground">{project.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const BadgesTab = () => {
    const BadgeCard: React.FC<{title: string, badges: BadgeType[], locked?: boolean}> = ({title, badges, locked = false}) => (
        <Card>
             <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
             <CardContent className="space-y-3">
                {badges.map(badge => (
                    <div key={badge.name} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${badge.color} ${locked ? 'grayscale opacity-50' : ''}`}>
                            {badge.icon === 'Award' && <Award className="text-white"/>}
                            {badge.icon === 'BookOpen' && <BookOpen className="text-white"/>}
                            {badge.icon === 'BrainCircuit' && <BrainCircuit className="text-white"/>}
                            {badge.icon === 'Star' && <Star className="text-white"/>}
                            {badge.icon === 'Trophy' && <Trophy className="text-white"/>}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{badge.name}</p>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                        <div className="text-right">
                            {locked ? 
                                <Badge variant="secondary"><Clock className="mr-1 h-3 w-3"/> Verrouillé</Badge> :
                                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-700"><Check className="mr-1 h-3 w-3"/>Obtenu</Badge>
                            }
                        </div>
                    </div>
                ))}
             </CardContent>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BadgesTab title="Badges obtenus" badges={profileData.badges.unlocked} />
            <BadgesTab title="Badges à débloquer" badges={profileData.badges.locked} locked />
        </div>
    )
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
        <ProfileHeader />
        
        <Tabs defaultValue="progression" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="progression">Progression</TabsTrigger>
                <TabsTrigger value="competences">Compétences</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
            <TabsContent value="progression" className="mt-4">
                <ProgressionTab />
            </TabsContent>
            <TabsContent value="competences" className="mt-4">
                <SkillsTab />
            </TabsContent>
            <TabsContent value="badges" className="mt-4">
                <BadgesTab />
            </TabsContent>
        </Tabs>
    </div>
  );
}

