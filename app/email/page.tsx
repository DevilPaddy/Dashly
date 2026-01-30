'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function EmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
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
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-white mb-6">Email</h1>
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-6">
              <p className="text-[#a1a1a1]">Email management interface coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}