'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  topBarActions?: React.ReactNode;
}

export default function DashboardLayout({ children, title, topBarActions }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <TopBar title={title}>
          {topBarActions}
        </TopBar>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}