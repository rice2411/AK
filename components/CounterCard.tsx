import React from 'react';
import { Calendar, MessageSquare, User, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface CounterCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

const CounterCard: React.FC<CounterCardProps> = ({ task, onDelete }) => {
  const date = new Date(task.created_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md border border-slate-100 dark:border-slate-800 group h-full">
      <div 
        className="absolute left-0 top-0 h-full w-1.5" 
        style={{ backgroundColor: task.status_extra_info.color }}
      />
      
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span 
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: task.status_extra_info.color }}
          >
            {task.status_extra_info.name}
          </span>
          {task.is_blocked && (
             <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                <AlertCircle size={14} /> Blocked
             </span>
          )}
        </div>

        <div className="mb-1 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {task.project_extra_info.name}
        </div>

        <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-3" title={task.subject}>
          {task.subject}
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center gap-3">
          {task.assigned_to_extra_info ? (
            <img 
              src={task.assigned_to_extra_info.photo || ''} 
              alt={task.assigned_to_extra_info.full_name_display}
              className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
              title={`Assigned to: ${task.assigned_to_extra_info.full_name_display}`}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400" title="Unassigned">
              <User size={14} />
            </div>
          )}
          
          <div className="flex flex-col">
             <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
               {task.assigned_to_extra_info ? task.assigned_to_extra_info.full_name_display.split(' ')[0] : 'Unassigned'}
             </span>
             <span className="flex items-center gap-1 text-[10px] text-slate-400">
               <Calendar size={10} /> {date}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {task.total_comments > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MessageSquare size={14} /> {task.total_comments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterCard;
