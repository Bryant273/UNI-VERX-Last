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
  X,
  User,
  UserPlus,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { initialConversationsData, messagesData, allUsers, type DemoUser, type Conversation, getInitials } from '@/lib/messages-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

const emojiCategories = {
  'Sourires & Émotions': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵'],
  'Personnes & Gestes': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷'],
  'Animaux & Nature': ['🙈', '🙉', '🙊', '🐒', '🐶', '🐕', '🦮', '🐕‍🦺', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐻‍❄️', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱', '🦠'],
  'Nourriture & Boissons': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '𫖚', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪'],
};


const ConversationList = ({ conversations, onSelect, selectedId, onNewConversation }: { conversations: Conversation[], onSelect: (id: string) => void, selectedId: string | null, onNewConversation: () => void }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(c => {
        if (filter === 'unread') return c.unread > 0;
        if (filter === 'students') return c.type === 'user' && !c.name.startsWith('Prof.') && !c.name.startsWith('Dr.') && !c.name.startsWith('Direction') && !c.name.startsWith('Service');
        if (filter === 'teachers') return c.type === 'user' && (c.name.startsWith('Prof.') || c.name.startsWith('Dr.'));
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
                <Button size="sm" variant={filter === 'students' ? 'secondary' : 'ghost'} onClick={() => setFilter('students')}>Étudiants</Button>
                <Button size="sm" variant={filter === 'teachers' ? 'secondary' : 'ghost'} onClick={() => setFilter('teachers')}>Profs</Button>
                <Button size="sm" variant={filter === 'groups' ? 'secondary' : 'ghost'} onClick={() => setFilter('groups')}>Groupes</Button>
              </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={onNewConversation}><Plus className="h-4 w-4"/></Button>
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


const ChatView = ({ conversationId, onBack, onNewMessage }: { conversationId: string | null, onBack: () => void, onNewMessage: (convId: string, message: any) => void }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [message, setMessage] = useState('');
    
    const conversation = conversationId ? initialConversationsData.find(c => c.id === conversationId) : null;
    const currentMessages = (conversationId ? messagesData[conversationId] : []) || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, conversationId]);
    
    useEffect(() => {
        setMessage('');
        setAttachments([]);
        if (conversationId && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 0);
        }
    }, [conversationId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };
    
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleEmojiClick = (emoji: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + emoji + text.substring(end);
            setMessage(newText);
            
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
                textarea.focus();
            }, 0);
        }
    };

    const handleSendMessage = () => {
        if ((!message.trim() && attachments.length === 0) || !conversationId) return;

        const newMessage = {
            id: Date.now(),
            sender: 'M. Jean Moreau', 
            avatar: 'https://i.pravatar.cc/100?img=25',
            content: message.trim(),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
        };
        onNewMessage(conversationId, newMessage);
        setMessage('');
        setAttachments([]);
    };

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
                {(currentMessages || []).map((msg: any) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.isMe ? "justify-end" : "justify-start")}>
                        {!msg.isMe && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{getInitials(msg.sender)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-[70%] p-3 rounded-2xl", msg.isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                            {!msg.isMe && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
                            <p className="text-sm">{msg.content}</p>
                        </div>
                         {msg.isMe && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://i.pravatar.cc/100?img=25" />
                                <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t">
                 {attachments.length > 0 && (
                    <div className="mb-2 p-2 border rounded-lg bg-muted/50">
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="relative group">
                                    <div className="h-14 w-14 rounded-md bg-background border flex items-center justify-center">
                                        <Paperclip className="h-6 w-6 text-muted-foreground"/>
                                    </div>
                                    <button onClick={() => removeAttachment(index)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-4 w-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-3 w-3" />
                                    </button>
                                    <p className="text-xs text-center w-14 truncate mt-1">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Écrivez un message..." 
                        className="pr-28" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0">
                                <ScrollArea className="h-72">
                                <div className='p-2'>
                                {Object.entries(emojiCategories).map(([category, emojis]) => (
                                    <div key={category}>
                                        <h4 className="text-sm font-semibold text-muted-foreground px-2 py-1 sticky top-0 bg-popover/95 backdrop-blur-sm">{category}</h4>
                                        <div className="grid grid-cols-8 gap-1">
                                            {emojis.map((emoji) => (
                                                <Button key={emoji} variant="ghost" size="icon" className="text-lg" onClick={() => handleEmojiClick(emoji)}>
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                        
                        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-5 w-5" /></Button>
                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                        <Button size="icon" onClick={handleSendMessage}><Send className="h-5 w-5" /></Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const NewConversationModal = ({ isOpen, onClose, onCreate }: { isOpen: boolean, onClose: () => void, onCreate: (newConversation: Conversation) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<DemoUser[]>([]);
    const [groupName, setGroupName] = useState('');

    const isGroup = selectedUsers.length > 1;

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !selectedUsers.some(su => su.id === user.id)
        );
    }, [searchTerm, selectedUsers]);

    const handleSelectUser = (user: DemoUser) => {
        if (selectedUsers.some(su => su.id === user.id)) return;

        if (!isGroup && selectedUsers.length === 1) {
            handleCreate();
        } else {
             setSelectedUsers(prev => [...prev, user]);
             setSearchTerm('');
        }
    };
    
    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };
    
    const handleCreate = () => {
        let newConversation: Conversation;
        if (isGroup) {
            if (!groupName) {
                alert('Veuillez donner un nom au groupe.');
                return;
            }
            newConversation = {
                id: `group-${Date.now()}`,
                type: 'group',
                name: groupName,
                avatar: '',
                initials: getInitials(groupName),
                lastMessage: 'Vous avez créé ce groupe.',
                time: 'Maintenant',
                unread: 0,
                online: true,
                members: [ ...selectedUsers, allUsers.find(u => u.id === 'academic-advisor-moreau')! ],
            };
        } else {
            const user = selectedUsers[0];
            newConversation = {
                id: user.id,
                type: 'user',
                name: user.name,
                avatar: user.avatar,
                initials: getInitials(user.name),
                lastMessage: 'Vous avez démarré la conversation.',
                time: 'Maintenant',
                unread: 0,
                online: user.online || false,
            };
        }
        
        onCreate(newConversation);
        resetState();
    };

    const resetState = () => {
        setSearchTerm('');
        setSelectedUsers([]);
        setGroupName('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nouvelle Conversation</DialogTitle>
                    <DialogDescription>
                        Recherchez des personnes ou créez un groupe de discussion.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {selectedUsers.length > 0 && (
                         <div className="p-2 border rounded-lg">
                            <Label>À :</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedUsers.map(user => (
                                    <Badge key={user.id} variant="secondary" className="pl-1">
                                        <Avatar className="h-5 w-5 mr-1">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        {user.name}
                                        <button onClick={() => handleRemoveUser(user.id)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                                            <X className="h-3 w-3"/>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Rechercher un contact..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
                                <CardContent className="p-2">
                                    {searchResults.map(user => (
                                        <div key={user.id} onClick={() => handleSelectUser(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                                            <Avatar>
                                                <AvatarImage src={user.avatar}/>
                                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    {isGroup && (
                        <div className="space-y-2 pt-2">
                            <Label htmlFor="group-name">Nom du groupe</Label>
                            <Input id="group-name" placeholder="Ex: Coordination L3" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={resetState}>Annuler</Button>
                    <Button onClick={handleCreate} disabled={selectedUsers.length === 0 || (isGroup && !groupName)}>
                        {isGroup ? 'Créer le groupe' : 'Démarrer la discussion'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// This is a new global variable to hold dynamically added conversations.
// In a real app, this would be part of a global state management solution (like Zustand, Redux, or React Context).
let conversations: Conversation[] = [];

export default function MessagesPage() {
    const [localConversations, setLocalConversations] = useState<Conversation[]>(initialConversationsData);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);

    useEffect(() => {
      // Combine initial data with dynamically added conversations
      setLocalConversations([...conversations, ...initialConversationsData].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i));
    }, []);

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        setLocalConversations(prev => 
            prev.map(c => 
                c.id === id ? { ...c, unread: 0 } : c
            )
        );
    };

    const handleNewMessage = (convId: string, message: any) => {
        if (messagesData[convId]) {
            messagesData[convId].push(message);
        } else {
            messagesData[convId] = [message];
        }
        setLocalConversations(prev =>
            prev.map(c => 
                c.id === convId ? { ...c, lastMessage: message.content || 'Fichier joint', time: message.time } : c
            )
        );
        // This is to force re-render of ChatView with new message
        setSelectedConversationId('');
        setTimeout(() => setSelectedConversationId(convId), 0);
    };
    
    const handleCreateConversation = (newConversation: Conversation) => {
        if (!messagesData[newConversation.id]) {
            messagesData[newConversation.id] = [];
        }
        
        // Add to conversations list
        const updatedConversations = [newConversation, ...localConversations.filter(c => c.id !== newConversation.id)];
        setLocalConversations(updatedConversations);
        conversations = [newConversation, ...conversations.filter(c => c.id !== newConversation.id)]; // update global var
        
        handleSelectConversation(newConversation.id);
    };

    return (
        <div className="h-full flex gap-6">
            <div className={cn("w-full md:w-1/3 xl:w-1/4 flex-shrink-0", selectedConversationId && 'hidden md:block')}>
              <ConversationList
                conversations={localConversations}
                onSelect={handleSelectConversation}
                selectedId={selectedConversationId}
                onNewConversation={() => setIsNewConversationModalOpen(true)}
              />
            </div>
            <div className={cn("flex-1", !selectedConversationId && 'hidden md:block')}>
              <ChatView 
                conversationId={selectedConversationId} 
                onBack={() => setSelectedConversationId(null)}
                onNewMessage={handleNewMessage}
              />
            </div>
            <NewConversationModal 
                isOpen={isNewConversationModalOpen}
                onClose={() => setIsNewConversationModalOpen(false)}
                onCreate={handleCreateConversation}
            />
        </div>
    );
}
