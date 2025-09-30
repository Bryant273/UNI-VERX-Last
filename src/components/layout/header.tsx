
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PanelLeft, Search, Bell } from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { userData, VALID_ROLES } from '@/lib/data';
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
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DateTime />
        <div className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
            </div>
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
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
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Actions</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
       </div>
    </header>
  );
}
