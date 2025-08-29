
import type { PropsWithChildren } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
        <SidebarNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 group-data-[state=expanded]:sm:pl-56 transition-[padding]">
            <DashboardHeader />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
                {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
