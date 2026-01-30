export interface Email {
  _id: string;
  userId: string;
  gmailId: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  snippet: string;
  body?: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  receivedAt: Date;
  linkedTaskId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailFilters {
  isRead?: boolean;
  isStarred?: boolean;
  limit?: number;
}