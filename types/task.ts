export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  linkedEmailId?: string;
  linkedNoteId?: string;
  linkedCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: Date;
  tags?: string[];
}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  tag?: string;
}