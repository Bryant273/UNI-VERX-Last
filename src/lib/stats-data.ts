
import {
  GraduationCap,
  Users,
  TrendingUp,
  Star,
} from 'lucide-react';

export const kpiData = [
    { title: 'Taux de réussite global', value: '88.5%', change: '+1.2% vs 2024', icon: GraduationCap, color: 'text-green-500' },
    { title: 'Nouveaux inscrits (2025)', value: '2,458', change: '+5.4% vs 2024', icon: Users, color: 'text-blue-500' },
    { title: 'Progression moyenne', value: '+7.2%', change: 'Amélioration générale', icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Satisfaction étudiante', value: '4.3/5', change: '+0.2 vs 2024', icon: Star, color: 'text-amber-500' },
];

export const performanceData = [
  { name: '<8', value: 125, fill: 'hsl(var(--chart-5))' },
  { name: '8-10', value: 342, fill: 'hsl(var(--chart-4))' },
  { name: '10-12', value: 789, fill: 'hsl(var(--chart-3))' },
  { name: '12-14', value: 854, fill: 'hsl(var(--chart-2))' },
  { name: '14-16', value: 521, fill: 'hsl(var(--primary))' },
  { name: '>16', value: 231, fill: 'hsl(var(--chart-1))' },
];

export const enrollmentData = {
    chartData: [
        { year: "2023", L1: 1800, L2: 1500, L3: 1200, M1: 800, M2: 600 },
        { year: "2024", L1: 1950, L2: 1600, L3: 1300, M1: 850, M2: 650 },
        { year: "2025", L1: 2100, L2: 1750, L3: 1400, M1: 900, M2: 700 },
    ],
    chartConfig: {
        L1: { label: 'L1', color: 'hsl(var(--chart-1))' },
        L2: { label: 'L2', color: 'hsl(var(--chart-2))' },
        L3: { label: 'L3', color: 'hsl(var(--chart-3))' },
        M1: { label: 'M1', color: 'hsl(var(--chart-4))' },
        M2: { label: 'M2', color: 'hsl(var(--chart-5))' },
    }
};

export const demographicsData = [
    { name: "Île-de-France", value: 45, color: 'hsl(var(--chart-1))' },
    { name: "Province", value: 30, color: 'hsl(var(--chart-2))' },
    { name: "International (UE)", value: 15, color: 'hsl(var(--chart-3))' },
    { name: "International (Hors UE)", value: 10, color: 'hsl(var(--chart-4))' },
];
