
import WelcomeBanner from '@/components/dashboard/welcome-banner';
import { userData } from '@/lib/static-data';
import GlobalEventsCard from '@/components/dashboard/global-events-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <p className="mt-2 text-muted-foreground">Le reste du tableau de bord du secrétariat est en cours de construction.</p>
    </div>
  );
}
