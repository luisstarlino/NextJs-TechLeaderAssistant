
'use client';
import React, { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import Header from '@/components/layout/header';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [isAuthReady, user, router]);

  if (!isAuthReady || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard')}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/mind-map')}>
                <Link href="/mind-map">
                  <BrainCircuit />
                  Mind Map
                </Link>
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
