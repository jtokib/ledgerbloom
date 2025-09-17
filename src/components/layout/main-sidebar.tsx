'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Settings,
  Leaf,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/inventory', icon: Boxes, label: 'Inventory' },
  { href: '/orders', icon: ShoppingCart, label: 'Orders' },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b h-16 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Leaf className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-headline font-bold text-foreground group-data-[collapsible=icon]:hidden">
            LedgerBloom
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild
                isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)} 
                tooltip={{children: item.label}}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={pathname.startsWith('/settings')} 
              tooltip={{children: "Settings"}}
            >
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto" tooltip={{children: 'Account actions'}}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="person portrait" alt="User" />
                    <AvatarFallback>WC</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left truncate">Wildflower Co.</span>
                <LogOut className="h-4 w-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
