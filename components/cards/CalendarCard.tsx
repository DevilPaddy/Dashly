'use client';

import { Calendar, Clock } from 'lucide-react';
import { useCalendar } from '@/hooks/useCalendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatTime } from '@/app/lib/utils';
import { CalendarEvent } from '@/types/calendar';

export default function CalendarCard() {
  const { events, isLoading } = useCalendar();
  
  // Get today's events
  const today = new Date();
  const todayEvents = events.filter((event: CalendarEvent) => {
    const eventDate = new Date(event.startTime);
    return eventDate.toDateString() === today.toDateString();
  }).slice(0, 3);

  // Get next upcoming event
  const upcomingEvents = events.filter((event: CalendarEvent) => {
    const eventDate = new Date(event.startTime);
    return eventDate > today;
  }).sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const nextEvent = upcomingEvents[0];

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-serif">
          <Calendar size={20} />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-[#737373]">Loading...</div>
        ) : (
          <>
            {/* Next Event */}
            {nextEvent && (
              <div className="p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-[#a4fc3c]" />
                  <span className="text-xs text-[#a4fc3c] font-medium">NEXT EVENT</span>
                </div>
                <h3 className="text-white font-medium mb-1">{nextEvent.title}</h3>
                <p className="text-sm text-[#737373]">
                  {formatTime(nextEvent.startTime)} - {formatTime(nextEvent.endTime)}
                </p>
                {nextEvent.location && (
                  <p className="text-xs text-[#737373] mt-1">{nextEvent.location}</p>
                )}
              </div>
            )}

            {/* Today's Events */}
            <div>
              <h4 className="text-sm font-medium text-[#a1a1a1] mb-2">Today</h4>
              {todayEvents.length === 0 ? (
                <div className="text-[#737373] text-sm">No events today</div>
              ) : (
                <div className="space-y-2">
                  {todayEvents.map((event: CalendarEvent) => (
                    <div 
                      key={event._id} 
                      className="flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{event.title}</p>
                        <p className="text-xs text-[#737373]">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#a4fc3c] rounded-full ml-2"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}