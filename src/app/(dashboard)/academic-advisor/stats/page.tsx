
'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  GraduationCap,
  Users,
  TrendingUp,
  LineChart,
  PieChart as PieChartIcon,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { kpiData, performanceData, enrollmentData, demographicsData } from '@/lib/stats-data';

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string; value: string; change: string; icon: React.ElementType; color: string }) => (
    <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{change}</p>
        </CardContent>
    </Card>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
      {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};


export default function StatsPage() {
  const [yearFilter, setYearFilter] = useState('2024-2025');
  const [semesterFilter, setSemesterFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold">Statistiques Générales</h1>
            <p className="text-muted-foreground">Analyse des performances de l'établissement.</p>
        </div>
         <div className="flex flex-wrap gap-3">
            <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Année académique" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
            </Select>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toute l'année</SelectItem>
                    <SelectItem value="s1">Semestre 1</SelectItem>
                    <SelectItem value="s2">Semestre 2</SelectItem>
                </SelectContent>
            </Select>
         </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map(kpi => <StatCard key={kpi.title} {...kpi} />)}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Performance des étudiants</CardTitle>
                    <CardDescription>Répartition des moyennes générales.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <RechartsBarChart data={performanceData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Démographie des étudiants</CardTitle>
                    <CardDescription>Répartition par région d'origine.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[300px] w-full">
                        <RechartsPieChart>
                             <Tooltip content={<ChartTooltipContent />} />
                            <Pie
                                data={demographicsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                dataKey="value"
                            >
                                {demographicsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </RechartsPieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>
       
        <Card>
            <CardHeader>
                <CardTitle>Évolution des inscriptions par niveau</CardTitle>
                <CardDescription>Comparaison sur les 3 dernières années.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={enrollmentData.chartConfig} className="h-[400px] w-full">
                    <RechartsLineChart data={enrollmentData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Legend />
                        {Object.entries(enrollmentData.chartConfig).map(([key, config]) => (
                            <Line key={key} type="monotone" dataKey={key} stroke={config.color} strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
                        ))}
                    </RechartsLineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
