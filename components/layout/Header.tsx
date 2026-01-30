'use client';

import { Sparkles, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
      {/* Left side */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">
          Welcome {session?.user?.name?.split(' ')[0] || 'Dev'} 👋
        </h1>
        <p className="text-[#a1a1a1] mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#1a1a1a] hover:bg-[#1a1a1a]"
        >
          <Sparkles size={16} />
          Ask AI
        </Button>
        
        <div 
          className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center cursor-pointer hover:bg-[#3a3a3a] transition-colors"
          onClick={handleSignOut}
          title="Sign out"
        >
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <User size={20} className="text-[#a1a1a1]" />
          )}
        </div>
      </div>
    </div>
  );
}