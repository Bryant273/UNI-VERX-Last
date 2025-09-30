import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/lib/data';
import { courses } from '@/lib/static-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CoursesCard({ role }: { role: UserRole }) {
  const userCourses = courses[role];

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mes Cours</CardTitle>
            <CardDescription>
              {role === 'student' ? 'Cours auxquels vous êtes inscrit' : 'Cours que vous enseignez'}
            </CardDescription>
          </div>
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userCourses.map((course) => {
            const thumbnail = PlaceHolderImages.find(img => img.id === course.thumbnailId);
            return (
              <Card key={course.id} className="overflow-hidden">
                {thumbnail && (
                  <Image
                    src={thumbnail.imageUrl}
                    alt={thumbnail.description}
                    data-ai-hint={thumbnail.imageHint}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover"
                  />
                )}
                <CardHeader className="p-4">
                  <Badge variant="secondary" className="w-fit mb-2">{course.code}</Badge>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {role === 'student' ? course.instructor : `${course.students} étudiants`}
                  </p>
                  <Button className="w-full mt-4" size="sm">Aller au cours</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
