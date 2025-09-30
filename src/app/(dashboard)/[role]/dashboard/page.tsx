import { notFound } from 'next/navigation';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart2,
  BrainCircuit,
  MessageSquare,
  Calendar,
  Building,
  Briefcase,
  FileCog,
  BookUser,
} from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { userData, VALID_ROLES } from '@/lib/data';
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import CurrentEventCard from '@/components/dashboard/current-event-card';
import SummarizerCard from '@/components/dashboard/summarizer-card';
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Student Dashboard */}
        {role === 'student' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <SummarizerCard />
            </div>
            <div className="flex justify-center md:justify-end">
                <CurrentEventCard role="student" />
            </div>
          </>
        )}

        {/* Professor Dashboard */}
        {role === 'professor' && (
          <>
            <SummarizerCard />
            <CurrentEventCard role="professor" />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Attendance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grading Progress</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75/120</div>
                <p className="text-xs text-muted-foreground">
                  Mid-term exams graded
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Admin Dashboard */}
        {role === 'admin' && (
          <>
            <StatsCard />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,405</div>
                <p className="text-xs text-muted-foreground">
                  +150 from last semester
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Professors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">873</div>
                <p className="text-xs text-muted-foreground">
                  +12 new hires
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">
                  Across all departments
                </p>
              </CardContent>
            </Card>
            <CurrentEventCard role="admin" />
            <SummarizerCard />
          </>
        )}

        {/* Placeholder Dashboards */}
        {role === 'academic-advisor' && <ComingSoonCard title="Responsable Pédagogique" icon={BookUser} />}
        {role === 'secretariat' && <ComingSoonCard title="Sécrétariat" icon={FileCog} />}
        {role === 'rectorate' && <ComingSoonCard title="Rectorat" icon={Building} />}
        {role === 'erp-provider' && <ComingSoonCard title="Fournisseur ERP" icon={Briefcase} />}
      </div>
    </div>
  );
}
