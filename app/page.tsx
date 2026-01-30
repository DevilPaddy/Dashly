'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardGrid from '@/components/DashboardGrid';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <DashboardGrid />
        </main>
      </div>
    </div>
  );
}