'use client';

import { FileText, Plus } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatTime } from '@/app/lib/utils';

export default function NotesCard() {
  const { notes, isLoading } = useNotes();
  
  // Get recent notes (last 3)
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white font-serif">
          <div className="flex items-center gap-2">
            <FileText size={20} />
            Notes
          </div>
          <button className="text-[#a4fc3c] hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-[#737373]">Loading...</div>
        ) : recentNotes.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-[#737373] text-sm mb-2">No notes yet</div>
            <button className="flex items-center gap-2 text-[#a4fc3c] text-sm hover:text-white transition-colors mx-auto">
              <Plus size={16} />
              Create your first note
            </button>
          </div>
        ) : (
          recentNotes.map((note) => (
            <div 
              key={note._id} 
              className="p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium text-sm group-hover:text-[#a4fc3c] transition-colors line-clamp-1">
                  {note.title}
                </h3>
                <span className="text-xs text-[#737373] ml-2 flex-shrink-0">
                  {formatTime(note.updatedAt)}
                </span>
              </div>
              
              <p className="text-sm text-[#a1a1a1] line-clamp-2 mb-2">
                {note.content}
              </p>
              
              {note.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-[#2a2a2a] text-[#a1a1a1] text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-xs text-[#737373]">
                      +{note.tags.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}