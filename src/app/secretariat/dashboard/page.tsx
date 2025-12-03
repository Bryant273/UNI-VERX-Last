
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import { userData } from '@/lib/static-data';
import GlobalEventsCard from '@/components/dashboard/global-events-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SecretariatQuickActions from '@/components/dashboard/secretariat-quick-actions';
import AiReportCard from '@/components/dashboard/ai-report-card';

export default function SecretariatDashboard() {
  const user = userData.secretariat;

  return (
    <div className="space-y-6">
      <WelcomeBanner name={user.name} role="secretariat" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlobalEventsCard />
        <Card>
            <CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">13,463</p></CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Dossiers en attente</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-orange-500">78</p></CardContent>
        </Card>
         <Card>
            <CardHeader><CardTitle>Tickets ouverts</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-blue-500">14</p></CardContent>
        </Card>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SecretariatQuickActions />
          <AiReportCard role="admin" />
        </div>
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Le journal d'activité global sera affiché ici.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
