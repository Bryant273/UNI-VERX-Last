'use client';

import { BarChart, Users } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { year: '2020', inscription: 10500, diplome: 2300 },
  { year: '2021', inscription: 11200, diplome: 2500 },
  { year: '2022', inscription: 11800, diplome: 2600 },
  { year: '2023', inscription: 12400, diplome: 2800 },
  { year: '2024', inscription: 13100, diplome: 3000 },
];

const chartConfig = {
  inscription: {
    label: 'Inscriptions',
    color: 'hsl(var(--primary))',
  },
  diplome: {
    label: 'Diplômés',
    color: 'hsl(var(--secondary-foreground))',
  },
} satisfies ChartConfig;

export default function StatsCard() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Statistiques de l'université</CardTitle>
            <CardDescription>Taux d'inscription et de diplomation des 5 dernières années.</CardDescription>
          </div>
          <BarChart className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={chartData}>
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="inscription"
              fill={chartConfig.inscription.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="diplome"
              fill={chartConfig.diplome.color}
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
