
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Send,
  Paperclip,
  Video,
  Phone,
  MoreVertical,
  Users,
  User,
  Star,
  Archive,
  Trash2,
  MessageSquare,
  Inbox,
  AtSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  initialConversationsData,
  messagesData,
  allUsers,
  getInitials,
  type Conversation,
  type DemoUser,
} from '@/lib/messages-data';
import { studentData } from '@/lib/static-data';

const currentUser = allUsers.find(u => u.name === studentData.name)!;

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelect,
}: {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelect: (conv: Conversation) => void;
}) => {
  return (
    <ScrollArea className="flex-1 -mx-2">
      <div className="flex flex-col gap-1 p-2">
        {conversations.length > 0 ? conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg text-left transition-colors w-full',
              selectedConversation?.id === conv.id
                ? 'bg-primary/10 text-primary font-semibold'
                : 'hover:bg-muted/50'
            )}
          >
            <div className="relative">
              <Avatar className="h-11 w-11">
                <AvatarImage src={conv.avatar} alt={conv.name} />
                <AvatarFallback className={cn(conv.type === 'group' && 'bg-muted text-foreground font-semibold')}>
                  {conv.initials}
                </AvatarFallback>
              </Avatar>
              {conv.online && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{conv.name}</p>
                <p className="text-xs text-muted-foreground">{conv.time}</p>
              </div>
              <div className="flex justify-between items-start">
                <p className="text-xs text-muted-foreground truncate pr-2">
                  {conv.lastMessage}
                </p>
                {conv.unread > 0 && (
                  <Badge className="bg-primary h-5 min-w-[1.25rem] p-0 flex items-center justify-center text-xs">
                    {conv.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        )) : (
            <div className="text-center py-16 text-muted-foreground">
                <Inbox className="mx-auto h-10 w-10" />
                <p className="mt-4 text-sm font-semibold">Aucune conversation</p>
                <p className="text-xs">Cette boîte de réception est vide.</p>
            </div>
        )}
      </div>
    </ScrollArea>
  );
};

const ChatPanel = ({
  conversation,
}: {
  conversation: Conversation | null;
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      setMessages(messagesData[conversation.id] || []);
    } else {
      setMessages([]);
    }
  }, [conversation]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted/30 rounded-r-lg">
        <MessageSquare className="h-16 w-16 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          Sélectionnez une conversation pour commencer
        </p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMsg = {
        id: messages.length + 1,
        sender: currentUser.name,
        avatar: currentUser.avatar,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        content: newMessage,
        isMe: true,
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-r-lg">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback className={cn(conversation.type === 'group' && 'bg-muted text-foreground font-semibold')}>
              {conversation.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{conversation.name}</p>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><User className="mr-2"/>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem><Star className="mr-2"/>Ajouter aux favoris</DropdownMenuItem>
              <DropdownMenuItem><Archive className="mr-2"/>Archiver</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2"/>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4">
         <div className="space-y-6">
            {messages.map((msg, index) => (
                <div key={index} className={cn("flex items-end gap-3", msg.isMe && "justify-end")}>
                {!msg.isMe && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>{getInitials(msg.sender)}</AvatarFallback></Avatar>}
                <div className={cn("max-w-md p-3 rounded-xl", msg.isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn("text-xs mt-1 text-right", msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{msg.time}</p>
                </div>
                {msg.isMe && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>{getInitials(msg.sender)}</AvatarFallback></Avatar>}
                </div>
            ))}
         </div>
         <div ref={messagesEndRef} />
      </ScrollArea>
      <footer className="p-4 border-t">
        <div className="relative">
          <Input
            placeholder="Écrivez votre message..."
            className="pr-24"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NewMessageModal = ({ onSelectUser }: { onSelectUser: (user: DemoUser) => void }) => {
    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Nouveau Message</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <Input placeholder="Rechercher un professeur ou un étudiant..."/>
                 <ScrollArea className="h-64 mt-4">
                    <div className="space-y-2">
                        {allUsers.filter(u => u.id !== currentUser.id).map(user => (
                            <button key={user.id} onClick={() => onSelectUser(user)} className="flex items-center gap-3 p-2 rounded-lg text-left transition-colors w-full hover:bg-muted/50">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </DialogContent>
    )
}

type FilterType = 'all' | 'unread' | 'groups' | 'contacts';

export default function StudentMessagingPage() {
  const [conversations, setConversations] = useState(initialConversationsData);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');


  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    if (activeFilter === 'unread') {
        filtered = filtered.filter(c => c.unread > 0);
    } else if (activeFilter === 'groups') {
        filtered = filtered.filter(c => c.type === 'group');
    } else if (activeFilter === 'contacts') {
        filtered = filtered.filter(c => c.type === 'user');
    }
    
    return filtered.filter((conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm, activeFilter]);

  useEffect(() => {
    // If the selected conversation is no longer in the filtered list (due to filter change), deselect it.
    if (selectedConversation && !filteredConversations.find(c => c.id === selectedConversation.id)) {
      setSelectedConversation(null);
    }
  }, [filteredConversations, selectedConversation]);


  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === conv.id ? {...c, unread: 0} : c));
  };
  
  const handleSelectUserFromModal = (user: DemoUser) => {
    const existingConversation = conversations.find(c => c.type === 'user' && c.name === user.name);
    if (existingConversation) {
        handleSelectConversation(existingConversation);
    } else {
        const newConversation: Conversation = {
            id: user.id,
            type: 'user',
            name: user.name,
            avatar: user.avatar,
            initials: getInitials(user.name),
            lastMessage: "Dites bonjour !",
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            online: user.online || false,
        };
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        if(!messagesData[newConversation.id]) {
            messagesData[newConversation.id] = [];
        }
    }
    setIsModalOpen(false);
  }

  const FilterButton = ({ filter, icon: Icon, label }: { filter: FilterType; icon: LucideIcon; label: string }) => (
    <Button 
        variant={activeFilter === filter ? "secondary" : "ghost"}
        className="justify-start gap-2"
        onClick={() => setActiveFilter(filter)}
    >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
    </Button>
);

  return (
    <div className="h-[calc(100vh_-_8rem)]">
       <Card className="h-full flex overflow-hidden">
        <div className="w-[320px] flex flex-col border-r h-full">
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Messages</h2>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Plus/></Button>
                        </DialogTrigger>
                        <NewMessageModal onSelectUser={handleSelectUserFromModal} />
                    </Dialog>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Rechercher..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    <FilterButton filter="all" icon={Inbox} label="Tous" />
                    <FilterButton filter="unread" icon={AtSign} label="Non lus" />
                    <FilterButton filter="groups" icon={Users} label="Groupes" />
                    <FilterButton filter="contacts" icon={User} label="Contacts" />
                 </div>
            </div>
            <Separator />
            <ConversationList
                conversations={filteredConversations}
                selectedConversation={selectedConversation}
                onSelect={handleSelectConversation}
            />
        </div>
        <div className="flex-1 h-full">
            <ChatPanel conversation={selectedConversation} />
        </div>
       </Card>
    </div>
  );
}
