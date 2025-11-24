
'use client';

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle,
  TrendingUp,
  Users,
  GraduationCap,
  TrendingDown,
  BarChart,
  LineChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, Legend } from 'recharts';

import WelcomeBanner from '@/components/dashboard/welcome-banner';
import { userData } from '@/lib/static-data';
import {
  advisorStats,
  alerts,
  quickAccessLinks,
  performanceChartData,
  enrollmentChartData,
  enrollmentChartConfig,
} from '@/lib/advisor-data';
import Link from 'next/link';

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: React.ElementType, color: string }) => {
  const isPositive = change.startsWith('+');
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
      </CardContent>
    </Card>
  );
};

export default function AcademicAdvisorDashboard() {
  const user = userData['academic-advisor'];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name={user.name} role="academic-advisor" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Taux de réussite" value={`${advisorStats.successRate}%`} change="+2.5% vs S1" icon={GraduationCap} color="text-green-500" />
        <StatCard title="Étudiants en difficulté" value={`${advisorStats.studentsInDifficulty}`} change="-5 vs S1" icon={TrendingDown} color="text-orange-500" />
        <StatCard title="Enseignants actifs" value={`${advisorStats.activeTeachers}`} change="+8 nouvelles recrues" icon={Users} color="text-blue-500" />
        <StatCard title="Programmes" value={`${advisorStats.programs}`} change="+3 nouveaux masters" icon={BookOpen} color="text-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              Alertes & Actions prioritaires
            </CardTitle>
            <CardDescription>Actions nécessitant votre attention immédiate.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(alert => (
                  <TableRow key={alert.id} className="hover:bg-muted/50">
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700'}`}>
                        {alert.severity === 'high' ? 'Haute' : 'Moyenne'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                        {alert.student && `${alert.student} (${alert.level}): ${alert.reason}`}
                        {alert.course && `${alert.course}: ${alert.reason}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir toutes les alertes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance des étudiants</CardTitle>
            <CardDescription>Répartition des moyennes générales du semestre en cours.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBarChart data={performanceChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>Inscriptions mensuelles par niveau pour l'année 2024.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
               <RechartsLineChart data={enrollmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend />
                {Object.entries(enrollmentChartConfig).map(([key, config]) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={config.color} strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
                ))}
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Accès rapide</CardTitle>
                <CardDescription>Vos outils de gestion principaux.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {quickAccessLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Button key={link.href} variant="outline" className="h-24 flex-col gap-2" asChild>
                           <Link href={link.href}>
                             <Icon className="h-6 w-6 text-primary" />
                             <span className="text-center text-xs">{link.label}</span>
                           </Link>
                        </Button>
                    )
                })}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
