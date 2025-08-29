
import type { PropsWithChildren } from 'react';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <SidebarNav />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden group-data-[state=expanded]:sm:pl-56 sm:pl-14 transition-[padding]">
            <DashboardHeader />
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
