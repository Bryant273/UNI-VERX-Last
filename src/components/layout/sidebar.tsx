'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookAIcon } from 'lucide-react';

import type { UserRole } from '@/lib/data';
import { navLinks, bottomNavLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

export default function AppSidebar() {
  const pathname = usePathname();
  const currentRole = (pathname.split('/')[1] || 'student') as UserRole;
  const currentNavLinks = navLinks[currentRole] || [];

  return (
    <UISidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <BookAIcon className="h-6 w-6 text-primary" />
          <span>VerxLink</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {currentNavLinks.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomNavLinks.map((link) => (
            <SidebarMenuItem key={link.label}>
              <SidebarMenuButton asChild className="justify-start">
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </UISidebar>
  );
}
