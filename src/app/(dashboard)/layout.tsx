import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar>
          <MainSidebar />
        </Sidebar>
        <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
