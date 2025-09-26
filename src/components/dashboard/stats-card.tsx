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
  { year: '2020', enrollment: 10500, graduation: 2300 },
  { year: '2021', enrollment: 11200, graduation: 2500 },
  { year: '2022', enrollment: 11800, graduation: 2600 },
  { year: '2023', enrollment: 12400, graduation: 2800 },
  { year: '2024', enrollment: 13100, graduation: 3000 },
];

const chartConfig = {
  enrollment: {
    label: 'Enrollment',
    color: 'hsl(var(--primary))',
  },
  graduation: {
    label: 'Graduation',
    color: 'hsl(var(--secondary-foreground))',
  },
} satisfies ChartConfig;

export default function StatsCard() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>University Statistics</CardTitle>
            <CardDescription>Enrollment and graduation rates over the last 5 years.</CardDescription>
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
              dataKey="enrollment"
              fill={chartConfig.enrollment.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="graduation"
              fill={chartConfig.graduation.color}
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
