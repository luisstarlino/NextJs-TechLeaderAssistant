
'use client';
import React from 'react';
import Header from '@/components/layout/header';
import { Loader2, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import TransitionLink from '@/components/layout/transition-link';
import { useTransition } from '@/context/transition-context';
import PageLoader from '@/components/ui/page-loader';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isTransitioning } = useTransition();

  return (
    <SidebarProvider>
      {isTransitioning && <PageLoader />}
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <TransitionLink href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </TransitionLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <TransitionLink href="/mind-map">
                  <BrainCircuit />
                  Mind Map
                </TransitionLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <main className="flex-1 bg-background p-4 lg:p-6">
          <div className="mx-auto max-w-screen-2xl">
            <Header />
            <div className="mt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
