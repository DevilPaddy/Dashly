'use client';

import { CheckSquare, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Task } from '@/types/task';

export default function TodoCard() {
  const { tasks, isLoading, updateTask } = useTasks({ status: 'todo' });
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    setCompletingTasks(prev => new Set(prev).add(taskId));
    try {
      await updateTask(taskId, { 
        status: completed ? 'done' : 'todo'
      });
    } finally {
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const todoTasks = tasks.slice(0, 4);

  return (
    <Card className="bg-[#111111] border-[#1a1a1a] hover:border-[#2a2a2a] transition-all cursor-move">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white font-serif">
          <div className="flex items-center gap-2">
            <CheckSquare size={20} />
            To-Do's
          </div>
          <span className="text-sm text-[#737373] font-normal">
            {tasks.length} tasks
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-[#737373]">Loading...</div>
        ) : todoTasks.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-[#737373] text-sm mb-2">No pending tasks</div>
            <button className="flex items-center gap-2 text-[#a4fc3c] text-sm hover:text-white transition-colors mx-auto">
              <Plus size={16} />
              Add new task
            </button>
          </div>
        ) : (
          todoTasks.map((task: Task) => (
            <div 
              key={task._id} 
              className="flex items-start gap-3 p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
            >
              <Checkbox
                checked={false}
                onCheckedChange={(checked) => handleTaskComplete(task._id, checked as boolean)}
                disabled={completingTasks.has(task._id)}
                className="mt-1 border-[#2a2a2a] data-[state=checked]:bg-[#a4fc3c] data-[state=checked]:border-[#a4fc3c]"
              />
              
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium group-hover:text-[#a4fc3c] transition-colors">
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-[#737373] mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {task.priority && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400' 
                        : task.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                  {task.tags.length > 0 && (
                    <span className="text-xs text-[#737373]">
                      #{task.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}