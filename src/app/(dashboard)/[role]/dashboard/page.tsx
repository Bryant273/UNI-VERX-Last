import { notFound } from 'next/navigation';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Building,
  Briefcase,
  FileCog,
  BookUser,
} from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { userData, VALID_ROLES } from '@/lib/static-data';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import CurrentEventCard from '@/components/dashboard/current-event-card';
import AiReportCard from '@/components/dashboard/ai-report-card';
import AverageCard from '@/components/dashboard/average-card';
import StatsCard from '@/components/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ComingSoonCard = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <Card className="lg:col-span-3">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-muted-foreground" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Le tableau de bord pour le rôle de {title.toLowerCase()} est en cours de construction.</p>
    </CardContent>
  </Card>
);


export default function DashboardPage({ params }: { params: { role: UserRole } }) {
  const { role } = params;

  if (!VALID_ROLES.includes(role)) {
    notFound();
  }

  const user = userData[role];

  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner name={user.name} role={role} />
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tableau de bord Étudiant */}
        {role === 'student' && (
          <>
            <AverageCard />
            <AiReportCard />
            <div className="flex justify-center lg:justify-start">
              <CurrentEventCard role="student" />
            </div>
          </>
        )}

        {/* Tableau de bord Professeur */}
        {role === 'professor' && (
          <>
            <AiReportCard />
            <CurrentEventCard role="professor" />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Présence des étudiants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progression des notations</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75/120</div>
                <p className="text-xs text-muted-foreground">
                  Examens de mi-semestre notés
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tableau de bord Admin */}
        {role === 'admin' && (
          <>
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
            <CurrentEventCard role="admin" />
            <AiReportCard />
          </>
        )}

        {/* Tableaux de bord à venir */}
        {role === 'academic-advisor' && <ComingSoonCard title="Responsable Pédagogique" icon={BookUser} />}
        {role === 'secretariat' && <ComingSoonCard title="Secrétariat" icon={FileCog} />}
        {role === 'rectorate' && <ComingSoonCard title="Rectorat" icon={Building} />}
        {role === 'erp-provider' && <ComingSoonCard title="Fournisseur ERP" icon={Briefcase} />}
      </div>
    </div>
  );
}
