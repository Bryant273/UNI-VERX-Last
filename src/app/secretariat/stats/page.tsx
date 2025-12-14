
'use client';

import React, { useState, useMemo, useTransition } from 'react';
import {
  GraduationCap,
  Users,
  TrendingUp,
  Star,
  BrainCircuit,
  Loader2,
  FileText
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  PieChart as RechartsPieChart,
  Pie as RechartsPie,
  Cell,
} from 'recharts';
import { getStatsDataForYear } from '@/lib/stats-data';
import { getAiStatsReport } from '@/server/actions';
import AiReportModal from '@/components/dashboard/ai-report-modal';

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

export default function SecretariatStatsPage() {
  const [year, setYear] = useState('2024-2025');
  const [semester, setSemester] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [report, setReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const data = useMemo(() => getStatsDataForYear(year, semester), [year, semester]);

  const handleGenerateReport = () => {
    startTransition(async () => {
        const statsPayload = {
            kpis: data.kpiData,
            performanceData: data.performanceData,
            enrollmentData: data.enrollmentData.chartData,
            demographicsData: data.demographicsData,
        };
        const result = await getAiStatsReport(statsPayload);
        if (result.report) {
            setReport(result.report);
            setIsModalOpen(true);
        }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="text-2xl">Statistiques de l'Université</CardTitle>
                    <CardDescription>Analyse approfondie des performances académiques et des inscriptions.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024-2025">Année 2024-2025</SelectItem>
                            <SelectItem value="2023-2024">Année 2023-2024</SelectItem>
                            <SelectItem value="2022-2023">Année 2022-2023</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Annuel</SelectItem>
                            <SelectItem value="s1">Semestre 1</SelectItem>
                            <SelectItem value="s2">Semestre 2</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button onClick={handleGenerateReport} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        Analyser avec Blue AI
                    </Button>
                </div>
            </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.kpiData.map(kpi => <StatCard key={kpi.title} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Performance des étudiants</CardTitle>
                <CardDescription>Répartition des moyennes générales pour la période sélectionnée.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <RechartsBarChart data={data.performanceData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Démographie</CardTitle>
                <CardDescription>Origine géographique des étudiants inscrits.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <RechartsPieChart>
                        <RechartsPie data={data.demographicsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => { const RADIAN = Math.PI / 180; const radius = innerRadius + (outerRadius - innerRadius) * 0.5; const x = cx + radius * Math.cos(-midAngle * RADIAN); const y = cy + radius * Math.sin(-midAngle * RADIAN); return ( <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium"> {`${(percent * 100).toFixed(0)}%`} </text> ); }}>
                            {data.demographicsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </RechartsPie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend/>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
            <CardDescription>Inscriptions annuelles par niveau.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={data.enrollmentData.chartConfig} className="h-[300px] w-full">
               <RechartsLineChart data={data.enrollmentData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Legend />
                {Object.entries(data.enrollmentData.chartConfig).map(([key, config]: any) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={config.color} strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
                ))}
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {report && (
            <AiReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // @ts-ignore
                report={report}
                role="admin" // Using admin role for stats report type
                chartsData={data}
                year={year}
            />
        )}
    </div>
  );
}
