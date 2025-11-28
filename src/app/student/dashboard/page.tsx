

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
  const role = 'student';

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  const user = userData[role];

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner name={user.name} role={role} />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Tableau de bord Étudiant */}
        
            <div className="xl:col-span-3 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                <AverageCard />
                <AiReportCard role={role} />
            </div>
            <div className="flex justify-center sm:justify-start xl:justify-center">
              <CurrentEventCard role="student" />
            </div>
          
      </div>
    </div>
  );
}


