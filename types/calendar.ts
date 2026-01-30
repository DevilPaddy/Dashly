export interface CalendarEvent {
  _id: string;
  userId: string;
  googleEventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  linkedTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}