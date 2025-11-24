
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, PanelLeft } from 'lucide-react';

import type { UserRole, NavItem } from '@/lib/data';
import { navLinks, bottomNavLinks } from '@/lib/static-data';
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Logo from '@/components/logo';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';

function isNavGroup(item: any): item is { title: string; links: any[] } {
  return item && typeof item.title === 'string' && Array.isArray(item.links);
}

function SidebarHeaderContent() {
    return (
      <div className="flex items-center justify-center pt-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
    );
  }

export default function AppSidebar() {
  const pathname = usePathname();
  const currentRole = (pathname.split('/')[1] || 'student') as UserRole;
  const currentNavItems = navLinks[currentRole] || [];
  const { isMobile } = useSidebar();


  return (
    <UISidebar>
       {isMobile && (
          <SheetHeader className="p-4">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          </SheetHeader>
        )}
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent className="p-2 pt-8">
        <SidebarMenu>
          {currentNavItems.map((item, index) => {
            if (isNavGroup(item)) {
              return (
                <Collapsible key={index} className="w-full">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.title}
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    <SidebarMenu>
                      {item.links.map((link) => (
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
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          {bottomNavLinks.map((link) => {
            // Make the settings link dynamic
            const href = link.href === '/settings' ? `/${currentRole}/settings` : link.href;
            return (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton asChild className="justify-start" isActive={pathname === href}>
                  <Link href={href}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </UISidebar>
  );
}
