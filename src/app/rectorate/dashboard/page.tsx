
'use client';

import { notFound } from 'next/navigation';
import {
  Users,
  BookOpen,
} from 'lucide-react';

import { userData, VALID_ROLES } from '@/lib/static-data';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import AiReportCard from '@/components/dashboard/ai-report-card';
import StatsCard from '@/components/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import GlobalEventsCard from '@/components/dashboard/global-events-card';
import RectorateQuickActions from '@/components/dashboard/rectorate-quick-actions';

const StatInfoCard = ({ title, value, subtitle, icon: Icon }: { title: string, value: string, subtitle: string, icon: React.ElementType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
);

export default function DashboardPage() {
  const role = 'rectorate';

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  const user = userData[role];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name={user.name} role={role} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Principale (Gauche) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StatsCard />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <StatInfoCard title="Total Étudiants" value="12,405" subtitle="+150 depuis S1" icon={Users} />
             <StatInfoCard title="Total Professeurs" value="873" subtitle="+12 nouvelles recrues" icon={Users} />
             <StatInfoCard title="Cours Actifs" value="1,250" subtitle="Tous départements" icon={BookOpen} />
             <GlobalEventsCard />
           </div>
        </div>

        {/* Colonne Latérale (Droite) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <RectorateQuickActions />
            <AiReportCard role="admin"/>
        </div>
      </div>
    </div>
  );
}
