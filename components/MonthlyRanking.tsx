import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Medal, User, ArrowRight } from 'lucide-react';
import { Task, UserInfo } from '../types';

interface MonthlyRankingProps {
  tasks: Task[];
}

const MonthlyRanking: React.FC<MonthlyRankingProps> = ({ tasks }) => {
  // Initialize both dates to current month
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  });

  const changeDate = (type: 'from' | 'to', offset: number) => {
    setDateRange((prev) => {
      const newDate = new Date(prev[type]);
      newDate.setMonth(newDate.getMonth() + offset);

      const newRange = { ...prev, [type]: newDate };

      // Auto-correct: If 'From' is after 'To', push 'To' forward
      if (newRange.from > newRange.to) {
        newRange.to = new Date(newRange.from);
      }

      return newRange;
    });
  };

  const filteredTasks = useMemo(() => {
    // Start of the 'From' month
    const start = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1);
    // End of the 'To' month
    const end = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth() + 1, 0, 23, 59, 59);

    return tasks.filter((task) => {
      const tDate = new Date(task.modified_date);
      return tDate >= start && tDate <= end;
    });
  }, [tasks, dateRange]);

  const rankingData = useMemo(() => {
    const userStats = new Map<number, { user: UserInfo; done: number; mr: number; pending: number; total: number }>();

    filteredTasks.forEach((task) => {
      if (task.assigned_to && task.assigned_to_extra_info) {
        const userId = task.assigned_to;
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            user: task.assigned_to_extra_info,
            done: 0,
            mr: 0,
            pending: 0,
            total: 0,
          });
        }

        const stats = userStats.get(userId)!;
        stats.total += 1;

        const status = task.status_extra_info.name;
        if (status === 'DONE') stats.done += 1;
        else if (status === 'MR') stats.mr += 1;
        else if (status === 'Pending') stats.pending += 1;
      }
    });

    return Array.from(userStats.values()).sort((a, b) => b.done - a.done || b.total - a.total);
  }, [filteredTasks]);

  const formatMonth = (date: Date) => date.toLocaleString('default', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      {/* Month Picker Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ranking Board</h2>
            <p className="text-sm text-slate-500">Top performers in selected range</p>
          </div>
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 w-full md:w-auto">
          
          {/* From Control */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm w-full sm:w-auto justify-between">
             <span className="text-xs font-medium text-slate-400 pl-2 uppercase">From</span>
             <div className="flex items-center">
                <button onClick={() => changeDate('from', -1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-[90px] text-center font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {formatMonth(dateRange.from)}
                </span>
                <button onClick={() => changeDate('from', 1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>

          <ArrowRight size={16} className="text-slate-400 hidden sm:block" />
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block md:hidden"></div> {/* Separator for mobile/tablet layouts */}

          {/* To Control */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm w-full sm:w-auto justify-between">
             <span className="text-xs font-medium text-slate-400 pl-2 uppercase">To</span>
             <div className="flex items-center">
                <button onClick={() => changeDate('to', -1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-[90px] text-center font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {formatMonth(dateRange.to)}
                </span>
                <button onClick={() => changeDate('to', 1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-600 dark:text-slate-300">
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* Ranking List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {rankingData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <User size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No active users found for this period</p>
            <p className="text-xs mt-1 text-slate-500">Try expanding the date range</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold w-16">Rank</th>
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold text-center text-emerald-600 dark:text-emerald-400">DONE</th>
                  <th className="px-6 py-4 font-semibold text-center text-purple-600 dark:text-purple-400">MR</th>
                  <th className="px-6 py-4 font-semibold text-center text-red-600 dark:text-red-400">Pending</th>
                  <th className="px-6 py-4 font-semibold text-center">Total Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rankingData.map((data, index) => (
                  <tr key={data.user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {index === 0 && <Medal className="text-yellow-400 fill-yellow-400/20" size={24} />}
                      {index === 1 && <Medal className="text-slate-400 fill-slate-400/20" size={24} />}
                      {index === 2 && <Medal className="text-amber-600 fill-amber-600/20" size={24} />}
                      {index > 2 && <span className="text-lg font-bold text-slate-400 ml-1">#{index + 1}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={data.user.photo || ''} 
                          alt={data.user.full_name_display} 
                          className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-700 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{data.user.full_name_display}</p>
                          <p className="text-xs text-slate-500">@{data.user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 font-bold text-emerald-600 dark:text-emerald-400">
                        {data.done}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-purple-600 dark:text-purple-400">{data.mr}</td>
                    <td className="px-6 py-4 text-center font-medium text-red-600 dark:text-red-400">{data.pending}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{data.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyRanking;
