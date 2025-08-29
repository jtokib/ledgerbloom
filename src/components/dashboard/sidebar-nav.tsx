
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
  History,
  LineChart,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
  { href: '/dashboard/movements', label: 'Movements', icon: History },
  { href: '/dashboard/audit-log', label: 'Audit Log', icon: FileText },
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
  const { state } = useSidebar();

  return (
    <Sidebar collapsible={state === 'collapsed' ? 'icon' : 'offcanvas'}>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="font-headline text-2xl font-bold">LedgerBloom</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(settingsMenuItem.href)}
              tooltip={settingsMenuItem.label}
            >
              <Link href={settingsMenuItem.href}>
                <settingsMenuItem.icon />
                <span>{settingsMenuItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
