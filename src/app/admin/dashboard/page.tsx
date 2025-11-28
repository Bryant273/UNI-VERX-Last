

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Building,
  Briefcase,
  FileCog,
  BookUser,
  Edit,
  Upload,
} from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { userData, VALID_ROLES } from '@/lib/static-data';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import CurrentEventCard from '@/components/dashboard/current-event-card';
import AiReportCard from '@/components/dashboard/ai-report-card';
import AverageCard from '@/components/dashboard/average-card';
import StatsCard from '@/components/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuickActionsCard from '@/components/dashboard/quick-actions-card';

const ComingSoonCard = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        <Icon className="h-6 w-6 text-muted-foreground" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Le tableau de bord pour le rôle de {title.toLowerCase()} est en cours de construction.</p>
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const role = 'admin';

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  const user = userData[role];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name={user.name} role={role} />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        
        {/* Tableau de bord Admin */}
        
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 col-span-full">
            <StatsCard />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nombre total d'étudiants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,405</div>
                <p className="text-xs text-muted-foreground">
                  +150 depuis le dernier semestre
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nombre total de professeurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">873</div>
                <p className="text-xs text-muted-foreground">
                  +12 nouvelles recrues
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cours actifs</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">
                  Tous départements confondus
                </p>
              </CardContent>
            </Card>
            <div className="flex justify-center sm:justify-start">
             <CurrentEventCard role="admin" />
            </div>
            <AiReportCard role={role}/>
          </div>
        
      </div>
    </div>
  );
}


