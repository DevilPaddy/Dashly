'use client';

import { User, ChevronRight } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function TaskCard() {
  const { tasks, isLoading } = useTasks({ status: 'in_progress' });
  const activeTask = tasks[0];

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-serif">
          <User size={20} />
          Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-[#737373]">Loading...</div>
        ) : !activeTask ? (
          <div className="text-[#737373]">No active tasks</div>
        ) : (
          <>
            {/* Active Task */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-[#a4fc3c] text-black text-xs font-bold rounded-full">
                  IN PROGRESS
                </span>
                <span className="text-sm text-[#737373]">
                  {activeTask.dueDate ? 'Due Today' : 'No due date'}
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-3">
                {activeTask.title}
              </h3>
              <Progress value={65} className="h-2 bg-[#2a2a2a]" />
            </div>

            {/* Other Tasks */}
            {tasks.slice(1, 2).map((task) => (
              <div 
                key={task._id} 
                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <span className="text-xs text-[#737373]">
                    {task.tags[0] || 'No tags'}
                  </span>
                </div>
                <ChevronRight size={20} className="text-[#737373]" />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}