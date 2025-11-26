
import {
  GraduationCap,
  Users,
  TrendingUp,
  Star,
} from 'lucide-react';

const generateKpiData = (yearModifier = 0) => ([
    { title: 'Taux de réussite global', value: `${(88.5 - yearModifier * 1.5).toFixed(1)}%`, change: `+${(1.2 - yearModifier * 0.3).toFixed(1)}% vs année préc.`, icon: GraduationCap, color: 'text-green-500' },
    { title: 'Nouveaux inscrits', value: `${(2458 - yearModifier * 150).toLocaleString('fr-FR')}`, change: `+${(5.4 - yearModifier * 0.5).toFixed(1)}% vs année préc.`, icon: Users, color: 'text-blue-500' },
    { title: 'Progression moyenne', value: `+${(7.2 - yearModifier * 0.8).toFixed(1)}%`, change: 'Amélioration générale', icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Satisfaction étudiante', value: `${(4.3 - yearModifier * 0.1).toFixed(1)}/5`, change: `+0.2 vs année préc.`, icon: Star, color: 'text-amber-500' },
]);

const generatePerformanceData = (yearModifier = 0, semester = 'all') => {
    const s_modifier = semester === 's1' ? 0.9 : semester === 's2' ? 1.1 : 1;
    return [
      { name: '<8', value: Math.round(125 * (1 - yearModifier * 0.1) * s_modifier) , fill: 'hsl(var(--chart-5))' },
      { name: '8-10', value: Math.round(342 * (1 - yearModifier * 0.08) * s_modifier), fill: 'hsl(var(--chart-4))' },
      { name: '10-12', value: Math.round(789 * (1 + yearModifier * 0.02) * s_modifier), fill: 'hsl(var(--chart-3))' },
      { name: '12-14', value: Math.round(854 * (1 + yearModifier * 0.03) * s_modifier), fill: 'hsl(var(--chart-2))' },
      { name: '14-16', value: Math.round(521 * (1 + yearModifier * 0.05) * s_modifier), fill: 'hsl(var(--primary))' },
      { name: '>16', value: Math.round(231 * (1 + yearModifier * 0.07) * s_modifier), fill: 'hsl(var(--chart-1))' },
    ];
};

const generateEnrollmentData = (yearModifier = 0) => ({
    chartData: [
        { year: `${2023 - yearModifier}`, L1: 1800, L2: 1500, L3: 1200, M1: 800, M2: 600 },
        { year: `${2024 - yearModifier}`, L1: 1950, L2: 1600, L3: 1300, M1: 850, M2: 650 },
        { year: `${2025 - yearModifier}`, L1: 2100, L2: 1750, L3: 1400, M1: 900, M2: 700 },
    ].slice(yearModifier, 3 + yearModifier),
    chartConfig: {
        L1: { label: 'L1', color: 'hsl(var(--chart-1))' },
        L2: { label: 'L2', color: 'hsl(var(--chart-2))' },
        L3: { label: 'L3', color: 'hsl(var(--chart-3))' },
        M1: { label: 'M1', color: 'hsl(var(--chart-4))' },
        M2: { label: 'M2', color: 'hsl(var(--chart-5))' },
    }
});

const generateDemographicsData = (yearModifier = 0) => {
    const base = [
        { name: "Île-de-France", value: 45, color: 'hsl(var(--chart-1))' },
        { name: "Province", value: 30, color: 'hsl(var(--chart-2))' },
        { name: "International (UE)", value: 15, color: 'hsl(var(--chart-3))' },
        { name: "International (Hors UE)", value: 10, color: 'hsl(var(--chart-4))' },
    ];
    // slightly change data based on year for dynamic feel
    return base.map((item, index) => ({
        ...item,
        value: item.value + (yearModifier * (index % 2 === 0 ? 1 : -1))
    })).filter(item => item.value > 0);
};

export const getStatsDataForYear = (year: string, semester: string) => {
    let yearModifier = 0;
    if (year === '2023-2024') yearModifier = 1;
    if (year === '2022-2023') yearModifier = 2;
    
    return {
        kpiData: generateKpiData(yearModifier),
        performanceData: generatePerformanceData(yearModifier, semester),
        enrollmentData: generateEnrollmentData(yearModifier),
        demographicsData: generateDemographicsData(yearModifier)
    }
};

// Initial data for default view
export const { kpiData, performanceData, enrollmentData, demographicsData } = getStatsDataForYear('2024-2025', 'all');
