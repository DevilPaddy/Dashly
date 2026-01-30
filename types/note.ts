export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  linkedTaskIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  tags?: string[];
  linkedTaskIds?: string[];
}