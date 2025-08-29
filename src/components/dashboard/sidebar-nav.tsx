'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  BrainCircuit,
  Home,
  MapPin,
  Package,
  Settings,
  ShoppingCart,
  Users,
  LineChart,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { UserNav } from '../auth/user-nav';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/locations', label: 'Locations', icon: MapPin },
  { href: '/dashboard/reports', label: 'Reports', icon: LineChart },
  { href: '/dashboard/ai-insights', label: 'AI Insights', icon: BrainCircuit },
];

const settingsMenuItem = {
  href: '/dashboard/settings',
  label: 'Settings',
  icon: Settings,
};

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="hidden sm:flex">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl font-bold">LedgerBloom</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={settingsMenuItem.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(settingsMenuItem.href)}
                tooltip={settingsMenuItem.label}
              >
                <a>
                  <settingsMenuItem.icon />
                  <span>{settingsMenuItem.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
