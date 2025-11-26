
'use client';

import React, { useState, useMemo, useTransition } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart,
  GraduationCap,
  Users,
  TrendingUp,
  LineChart,
  PieChart as PieChartIcon,
  Filter,
  BrainCircuit,
  Loader2,
  Star,
  Download,
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
import { getStatsDataForYear } from '@/lib/stats-data';
import { getAiStatsReport } from '@/app/actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GenerateStatsReportOutput } from '@/ai/flows/generate-stats-report';
import { Separator } from '@/components/ui/separator';
import AiReportPDF from '@/components/dashboard/ai-report-pdf';

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

const ReportSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-primary mb-3">{title}</h3>
    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-md border">{children}</div>
  </div>
);

const ChartWithComment = ({ title, comment, children }: { title: string, comment: React.ReactNode, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-primary mb-3">{title}</h3>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        {children}
      </div>
      <div className="lg:col-span-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-md border">
        <p className="italic">{comment}</p>
      </div>
    </div>
  </div>
);

const PerformanceChart = ({ data }: { data: any[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Performance des étudiants</CardTitle>
            <CardDescription>Répartition des moyennes générales.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <RechartsBarChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
    </Card>
);

const EnrollmentChart = ({ data }: { data: any }) => (
    <Card>
        <CardHeader>
            <CardTitle>Évolution des inscriptions par niveau</CardTitle>
            <CardDescription>Comparaison sur les dernières années.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={data.chartConfig} className="h-[400px] w-full">
                <RechartsLineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Legend />
                    {Object.entries(data.chartConfig).map(([key, config]: [string, any]) => (
                        <Line key={key} type="monotone" dataKey={key} stroke={config.color} strokeWidth={2} dot={{r:4}} activeDot={{r:6}} />
                    ))}
                </RechartsLineChart>
            </ChartContainer>
        </CardContent>
    </Card>
);

const DemographicsChart = ({ data }: { data: any[] }) => (
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
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </RechartsPieChart>
            </ChartContainer>
        </CardContent>
    </Card>
);

export default function StatsPage() {
  const [yearFilter, setYearFilter] = useState('2024-2025');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<GenerateStatsReportOutput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const statsData = useMemo(() => getStatsDataForYear(yearFilter, semesterFilter), [yearFilter, semesterFilter]);

  const handleGenerateReport = () => {
    setError(null);
    setReport(null);
    startTransition(async () => {
      const dataForAi = {
        kpis: statsData.kpiData.map(({ icon, ...rest }) => rest), // remove icon before sending
        performanceData: statsData.performanceData,
        enrollmentData: statsData.enrollmentData.chartData,
        demographicsData: statsData.demographicsData,
      };
      const result = await getAiStatsReport(dataForAi);
      if (result.error) {
        setError(result.error);
      } else if (result.report) {
        setReport(result.report);
        setIsModalOpen(true);
      }
    });
  };
  
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const reportElement = document.getElementById('ai-report-pdf-content');
    if (reportElement) {
        html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Rapport_Analyse_IA_${yearFilter}.pdf`);
            setIsDownloadingPdf(false);
        });
    }
  };
  
  return (
    <div className="space-y-6">
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {report && <AiReportPDF report={report} chartsData={statsData} year={yearFilter}/>}
      </div>

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
            <Button onClick={handleGenerateReport} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Générer une analyse IA
                </>
              )}
            </Button>
         </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.kpiData.map(kpi => <StatCard key={kpi.title} {...kpi} />)}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={statsData.performanceData} />
            <DemographicsChart data={statsData.demographicsData} />
       </div>
       
        <EnrollmentChart data={statsData.enrollmentData} />

      {report && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Analyse IA des Statistiques</DialogTitle>
                    <DialogDescription>Rapport généré pour l'année académique {yearFilter} ({semesterFilter === 'all' ? 'Annuel' : `Semestre ${semesterFilter.substring(1)}`})</DialogDescription>
                </DialogHeader>
                <div className="max-h-[65vh] overflow-y-auto p-1 pr-4 space-y-4">
                  <ReportSection title="Résumé des Indicateurs Clés">
                      <p>{report.kpiSummary}</p>
                  </ReportSection>

                  <Separator />

                  <ChartWithComment title="Analyse de la Performance Étudiante" comment={report.performanceComment}>
                      <div className="h-[250px]"><PerformanceChart data={statsData.performanceData} /></div>
                  </ChartWithComment>
                  
                  <Separator />

                  <ChartWithComment title="Analyse des Inscriptions" comment={report.enrollmentComment}>
                      <div className="h-[300px]"><EnrollmentChart data={statsData.enrollmentData} /></div>
                  </ChartWithComment>

                  <Separator />

                  <ChartWithComment title="Analyse Démographique" comment={report.demographicsComment}>
                      <div className="h-[250px]"><DemographicsChart data={statsData.demographicsData} /></div>
                  </ChartWithComment>
                  
                  <Separator />

                  <ReportSection title="Conclusion & Recommandations">
                      <p className="font-semibold">{report.globalConclusion}</p>
                  </ReportSection>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fermer</Button>
                     <Button onClick={handleDownloadPdf} disabled={isDownloadingPdf}>
                        {isDownloadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Télécharger en PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
