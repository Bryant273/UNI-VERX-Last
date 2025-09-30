import { GraduationCap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { studentData } from '@/lib/static-data';

const InfoLine = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default function AverageCard() {
  const { id, class: studentClass, semesters, overallAverage, overallRank, totalStudents } = studentData;
  const overallAverageFormatted = isNaN(overallAverage) ? 'N/A' : overallAverage.toFixed(2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Ma moyenne</CardTitle>
            <CardDescription>Aperçu de vos performances académiques</CardDescription>
          </div>
          <GraduationCap className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
            <InfoLine label="Matricule" value={id} />
            <InfoLine label="Classe" value={studentClass} />
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-xs text-muted-foreground">Moyenne Générale</p>
                <p className="text-2xl font-bold text-primary">{overallAverageFormatted}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Rang</p>
                <p className="text-2xl font-bold">{overallRank}/{totalStudents}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Semestres</p>
                <div className="flex justify-center gap-2 mt-1">
                    {Object.entries(semesters).map(([key, value]) => (
                        <div key={key}>
                           <p className="text-xs font-semibold">{key.replace('Semestre ', 'S')}: <span className="font-bold">{value.average.toFixed(2)}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
