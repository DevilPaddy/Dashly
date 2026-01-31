'use client';

import { Activity, CheckCircle, Mail, FileText, Calendar } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useEmails } from '@/hooks/useEmails';
import { useNotes } from '@/hooks/useNotes';
import { useCalendar } from '@/hooks/useCalendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatTime } from '@/app/lib/utils';
import { Task } from '@/types/task';
import { Email } from '@/types/email';
import { Note } from '@/types/note';
import { CalendarEvent } from '@/types/calendar';

interface ActivityItem {
  id: string;
  type: 'task' | 'email' | 'note' | 'calendar';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function ActivityCard() {
  const { tasks } = useTasks();
  const { emails } = useEmails();
  const { notes } = useNotes();
  const { events } = useCalendar();

  // Combine all activities
  const activities: ActivityItem[] = [
    // Recent completed tasks
    ...tasks
      .filter((task: Task) => task.status === 'done')
      .map((task: Task) => ({
        id: task._id,
        type: 'task' as const,
        title: 'Task completed',
        description: task.title,
        timestamp: task.updatedAt,
        icon: CheckCircle,
      })),
    
    // Recent emails
    ...emails
      .slice(0, 2)
      .map((email: Email) => ({
        id: email._id,
        type: 'email' as const,
        title: 'New email',
        description: email.subject,
        timestamp: email.receivedAt,
        icon: Mail,
      })),
    
    // Recent notes
    ...notes
      .slice(0, 2)
      .map((note: Note) => ({
        id: note._id,
        type: 'note' as const,
        title: 'Note updated',
        description: note.title,
        timestamp: note.updatedAt,
        icon: FileText,
      })),
    
    // Upcoming events
    ...events
      .filter((event: CalendarEvent) => new Date(event.startTime) > new Date())
      .slice(0, 2)
      .map((event: CalendarEvent) => ({
        id: event._id,
        type: 'calendar' as const,
        title: 'Upcoming event',
        description: event.title,
        timestamp: event.startTime,
        icon: Calendar,
      })),
  ]
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 5);

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task':
        return 'text-green-400';
      case 'email':
        return 'text-blue-400';
      case 'note':
        return 'text-yellow-400';
      case 'calendar':
        return 'text-purple-400';
      default:
        return 'text-[#a1a1a1]';
    }
  };

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-serif">
          <Activity size={20} />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-[#737373] text-center py-4">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
            >
              <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                <activity.icon size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#a1a1a1]">
                    {activity.title}
                  </span>
                  <span className="text-xs text-[#737373] ml-2 flex-shrink-0">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  {activity.description}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}