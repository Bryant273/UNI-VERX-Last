import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SettingsHeader from './SettingsHeader';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export default function SettingsCard({ title, description, children, footer, className }: SettingsCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <SettingsHeader title={title} description={description} />
      <CardContent className="p-6">
        {children}
      </CardContent>
      {footer && (
        <div className="p-6 pt-0 text-right">
            {footer}
        </div>
      )}
    </Card>
  );
}
