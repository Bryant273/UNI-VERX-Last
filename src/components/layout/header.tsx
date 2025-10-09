
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PanelLeft, Search, Bell, User, Settings, LogOut, History } from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { userData, VALID_ROLES } from '@/lib/static-data';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import DateTime from '@/components/dashboard/date-time';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  
  const role = pathname.split('/')[1] as UserRole;
  
  const handleLogout = () => {
    router.push('/');
  };

  const user = VALID_ROLES.includes(role) ? userData[role] : null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Ouvrir/Fermer le menu</span>
        </Button>
        <DateTime />
      </div>
      
      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Afficher les notifications</span>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>{user?.name || 'Mon Compte'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/${role}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/${role}/actions`}>
                    <History className="mr-2 h-4 w-4" />
                    Actions
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={`/${role}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
       </div>
    </header>
  );
}
