import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SettingsHeaderProps {
  title: string;
  description?: string;
}

export default function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  );
}
