'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Search,
  Plus,
  Archive,
  Paperclip,
  Send,
  Phone,
  Video,
  Info,
  Smile,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const conversationsData = [
  {
    id: 'group-1',
    type: 'group',
    name: 'Groupe Universitaire',
    avatar: '',
    initials: 'UNI',
    lastMessage: 'Admin: Rappel des dates d\'examens...',
    time: '10:42',
    unread: 3,
    online: true,
  },
  {
    id: 'group-2',
    type: 'group',
    name: 'L3 Informatique',
    avatar: '',
    initials: 'L3I',
    lastMessage: 'Lucas: Est-ce que quelqu\'un a les corrigés...',
    time: 'Hier',
    unread: 1,
    online: true,
  },
    {
    id: 'student-1',
    type: 'user',
    name: 'Emma Bernard',
    avatar: 'https://i.pravatar.cc/100?img=32',
    initials: 'EB',
    lastMessage: 'Tu as avancé sur le rapport ?',
    time: '08:45',
    unread: 1,
    online: true,
  },
  {
    id: 'professor-1',
    type: 'user',
    name: 'Prof. Martin',
    avatar: 'https://i.pravatar.cc/100?img=60',
    initials: 'PM',
    lastMessage: 'Concernant votre demande de délai...',
    time: '11:22',
    unread: 1,
    online: true,
  },
  {
    id: 'student-2',
    type: 'user',
    name: 'Thomas Mercier',
    avatar: 'https://i.pravatar.cc/100?img=59',
    initials: 'TM',
    lastMessage: 'D\'accord, je t\'envoie ça ce soir.',
    time: 'Hier',
    unread: 0,
    online: false,
  },
];

const messagesData = {
  'group-1': [
    { id: 1, sender: 'Admin Université', avatar: 'https://i.pravatar.cc/100?img=68', content: 'Bonjour à tous ! Voici un rappel des dates importantes pour les examens du premier semestre.', time: '10:30', isMe: false },
    { id: 2, sender: 'Admin Université', avatar: 'https://i.pravatar.cc/100?img=68', content: 'Algorithmique : 15 jan, BDD : 17 jan, Web : 20 jan.', time: '10:31', isMe: false },
    { id: 3, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', content: 'Merci pour l\'info ! Le planning des salles est dispo ?', time: '10:45', isMe: false },
    { id: 4, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', content: 'Bonne question !', time: '10:46', isMe: true },
  ],
  'student-1': [
      { id: 1, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', content: 'Salut Sarah ! Tu as avancé sur le rapport ?', time: '08:45', isMe: false },
      { id: 2, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', content: 'Hey ! Oui, j\'ai fait la première partie. Et toi ?', time: '08:50', isMe: true },
      { id: 3, sender: 'Emma Bernard', avatar: 'https://i.pravatar.cc/100?img=32', content: 'Super ! On peut se retrouver à la BU pour mettre en commun ?', time: '08:52', isMe: false },
  ],
  'professor-1': [
        { id: 1, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', content: 'Bonjour Professeur, j\'ai une question sur le dernier TP.', time: '09:15', isMe: true },
        { id: 2, sender: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', content: 'Bonjour Sarah, je vous écoute.', time: '10:30', isMe: false },
        { id: 3, sender: 'Sarah Dupont', avatar: 'https://i.pravatar.cc/100?img=5', content: 'Concernant la question 3, je ne suis pas sûre de bien comprendre ce qui est attendu pour l\'optimisation.', time: '10:32', isMe: true },
        { id: 4, sender: 'Prof. Martin', avatar: 'https://i.pravatar.cc/100?img=60', content: 'Pensez à utiliser les index. Je vous envoie un document qui pourrait vous aider.', time: '11:22', isMe: false },
  ],
};


const ConversationList = ({ conversations, onSelect, selectedId }: { conversations: typeof conversationsData, onSelect: (id: string) => void, selectedId: string | null }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(c => {
        if (filter === 'unread') return c.unread > 0;
        if (filter === 'groups') return c.type === 'group';
        return true;
      })
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conversations, filter, searchTerm]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Messagerie</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="px-4 py-2 border-b">
          <div className="flex justify-between items-center">
             <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <Button size="sm" variant={filter === 'all' ? 'secondary' : 'ghost'} onClick={() => setFilter('all')}>Tous</Button>
                <Button size="sm" variant={filter === 'unread' ? 'secondary' : 'ghost'} onClick={() => setFilter('unread')}>Non lus</Button>
                <Button size="sm" variant={filter === 'groups' ? 'secondary' : 'ghost'} onClick={() => setFilter('groups')}>Groupes</Button>
              </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon"><Plus className="h-4 w-4"/></Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Nouvelle discussion</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={cn("flex items-center p-3 cursor-pointer hover:bg-muted/50", selectedId === conv.id && "bg-muted")}
              onClick={() => onSelect(conv.id)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback className={cn(conv.type === 'group' && 'bg-primary text-primary-foreground font-bold')}>{conv.initials}</AvatarFallback>
                </Avatar>
                {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-semibold truncate">{conv.name}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  {conv.unread > 0 && <Badge className="flex-shrink-0">{conv.unread}</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const ChatView = ({ conversationId, onBack }: { conversationId: string | null, onBack: () => void }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // @ts-ignore
    const conversation = conversationId ? conversationsData.find(c => c.id === conversationId) : null;
    // @ts-ignore
    const messages = conversationId ? messagesData[conversationId] : [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!conversation) {
        return (
            <Card className="h-full flex-col items-center justify-center hidden md:flex">
                <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-20 w-20 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold">Bienvenue dans votre messagerie</h3>
                    <p className="text-muted-foreground">Sélectionnez une conversation pour commencer.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5"/>
                     </Button>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className={cn(conversation.type === 'group' && 'bg-primary text-primary-foreground font-bold')}>{conversation.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{conversation.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{conversation.online ? "En ligne" : "Hors ligne"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon"><Info className="h-5 w-5"/></Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg: any) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}>
                        {!msg.isMe && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-[70%] p-3 rounded-2xl", msg.isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                            {!msg.isMe && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
                            <p className="text-sm">{msg.content}</p>
                        </div>
                         {msg.isMe && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://i.pravatar.cc/100?img=5" />
                                <AvatarFallback>SD</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t">
                <div className="relative">
                    <Textarea placeholder="Écrivez un message..." className="pr-20" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                        <Button size="icon"><Send className="h-5 w-5" /></Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


export default function MessagesPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>('group-1');

    return (
        <div className="h-full flex gap-6">
            <div className={cn("w-full md:w-1/3 xl:w-1/4 flex-shrink-0", selectedConversationId && 'hidden md:block')}>
              <ConversationList
                conversations={conversationsData}
                onSelect={setSelectedConversationId}
                selectedId={selectedConversationId}
              />
            </div>
            <div className={cn("flex-1", !selectedConversationId && 'hidden md:block')}>
              <ChatView conversationId={selectedConversationId} onBack={() => setSelectedConversationId(null)} />
            </div>
        </div>
    );
}