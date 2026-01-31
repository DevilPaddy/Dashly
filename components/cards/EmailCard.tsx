'use client';

import { Mail } from 'lucide-react';
import { useEmails } from '@/hooks/useEmails';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatTime } from '@/app/lib/utils';
import { Email } from '@/types/email';

export default function EmailCard() {
  const { emails, isLoading } = useEmails({ limit: 3, isRead: false });

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-serif">
          <Mail size={20} />
          Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-[#737373]">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="text-[#737373]">No unread emails</div>
        ) : (
          emails.map((email: Email) => (
            <div 
              key={email._id} 
              className="flex items-start gap-3 hover:bg-[#1a1a1a] p-2 rounded-lg transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white font-medium text-sm">
                {email.from.charAt(0).toUpperCase()}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white truncate text-sm">
                    {email.from.split('<')[0].trim() || email.from}
                  </span>
                  <span className="text-xs text-[#737373]">
                    {formatTime(email.receivedAt)}
                  </span>
                </div>
                <p className="text-sm text-[#a1a1a1] truncate">
                  {email.subject}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}