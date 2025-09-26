import { Calendar } from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { timetableEvents } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TimetableCard({ role }: { role: UserRole }) {
  const events = timetableEvents[role] || [];
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                 <CardTitle className="text-lg">Today's Timetable</CardTitle>
                <CardDescription>{day}, {date}</CardDescription>
            </div>
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id}>
                <div className="flex items-start gap-4">
                  <div className="text-sm font-medium text-muted-foreground w-24 pt-0.5">{event.time}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{event.course}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                {index < events.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No events scheduled for today.</p>
        )}
      </CardContent>
    </Card>
  );
}
