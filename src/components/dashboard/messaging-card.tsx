import { MessageSquare, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { messages, userData } from '@/lib/data';

function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

export default function MessagingCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Boîte de réception</CardTitle>
                <CardDescription>Messages et annonces récents.</CardDescription>
            </div>
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.slice(0, 3).map((message) => {
            const sender = Object.values(userData).find(u => u.name === message.sender);
            return (
              <div key={message.id} className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={sender?.avatar} alt={message.sender} />
                  <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{message.sender}</p>
                    <p className="text-sm text-muted-foreground">{message.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
