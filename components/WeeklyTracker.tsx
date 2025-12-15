import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Calendar, 
  CheckCircle2, 
  GitPullRequest, 
  Clock, 
  AlertCircle,
  Target,
  AlertOctagon,
  TrendingUp,
  X,
  ExternalLink,
  Users,
  UserCheck
} from 'lucide-react';
import { Task, UserInfo } from '../types';

interface WeeklyTrackerProps {
  tasks: Task[];
}

// Internal Modal Component for User Tasks
const UserTaskModal: React.FC<{ 
  user: UserInfo; 
  tasks: Task[]; 
  onClose: () => void; 
}> = ({ user, tasks, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={user.photo || ''} 
                alt={user.full_name_display} 
                className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover" 
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${user.is_active ? 'bg-green-500' : 'bg-slate-400'}`}></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{user.full_name_display}</h3>
              <p className="text-sm text-slate-500 font-medium">@{user.username} • {tasks.length} Tasks this week</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task List Body */}
        <div className="overflow-y-auto p-5 space-y-3 bg-slate-50/30 dark:bg-slate-950/30 flex-1 custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Clock size={48} className="mb-3 opacity-20" />
              <p className="font-medium">No tasks found for this period.</p>
            </div>
          ) : (
            tasks.sort((a,b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime()).map(task => (
              <div 
                key={task.id} 
                className="group relative flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-200"
              >
                {/* Status Color Strip */}
                <div 
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" 
                  style={{ backgroundColor: task.status_extra_info.color }}
                />
                
                <div className="pl-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: task.status_extra_info.color }}
                    >
                      {task.status_extra_info.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{task.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                      {task.project_extra_info.name}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {task.subject}
                  </h4>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {new Date(task.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {task.is_blocked && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                      <AlertCircle size={10} /> Blocked
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
           <button 
             onClick={onClose} 
             className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

const WeeklyTracker: React.FC<WeeklyTrackerProps> = ({ tasks }) => {
  const WEEKLY_GOAL = 13;
  const MY_TEAM_IDS = [185, 193];
  
  // State for user details modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'team'>('all');

  // Initialize to the start of the current week (Monday)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const newDate = new Date(d.setDate(diff));
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  });

  const goToCurrentWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const newDate = new Date(d.setDate(diff));
    newDate.setHours(0, 0, 0, 0);
    setStartDate(newDate);
    setSelectedUserId(null);
  };

  const changeWeek = (offset: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setStartDate(newDate);
    // Close modal when changing weeks to avoid stale data context
    setSelectedUserId(null);
  };

  const endDate = useMemo(() => {
    const end = new Date(startDate);
    end.setDate(startDate.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [startDate]);

  // Extract all unique users from entire history (not just this week)
  const allKnownUsers = useMemo(() => {
      const map = new Map<number, UserInfo>();
      tasks.forEach(t => {
          if (t.assigned_to && t.assigned_to_extra_info) {
              if (!map.has(t.assigned_to)) {
                  map.set(t.assigned_to, t.assigned_to_extra_info);
              }
          }
      });
      return Array.from(map.values());
  }, [tasks]);

  // Filter users based on view mode selection
  const filteredUsers = useMemo(() => {
      if (viewMode === 'team') {
          return allKnownUsers.filter(u => MY_TEAM_IDS.includes(u.id));
      }
      return allKnownUsers;
  }, [viewMode, allKnownUsers]);
  
  // Filter tasks for the selected week
  const weeklyTasks = useMemo(() => {
    return tasks.filter(t => {
       const d = new Date(t.modified_date);
       return d >= startDate && d <= endDate;
    });
  }, [tasks, startDate, endDate]);

  // Aggregate Team Stats (based on filtered users)
  const teamAggregates = useMemo(() => {
    let done = 0;
    let mr = 0;
    let progress = 0;
    let pending = 0;

    const visibleUserIds = new Set(filteredUsers.map(u => u.id));
    weeklyTasks.forEach(t => {
       if (t.assigned_to && visibleUserIds.has(t.assigned_to)) {
           const s = t.status_extra_info.name;
           if (s.toLowerCase() === 'done') done++;
           else if (s.toLowerCase() === 'mr') mr++;
           // Combine In Coming and In Progress as requested
           else if (['In Coming', 'In Progress'].includes(s)) progress++;
           else if (s.toLowerCase() === 'pending' || s.toLowerCase() === 'blocked') pending++;
       }
    });

    return { done, mr, progress, pending };
  }, [weeklyTasks, filteredUsers]);

  // Calculate stats for each visible user for the current week
  // We map over filteredUsers (all users) to ensure we show 0 count users
  const userStats = useMemo(() => {
    return filteredUsers.map(user => {
        const userTasks = weeklyTasks.filter(t => t.assigned_to === user.id);
        
        let done = 0, mr = 0, progress = 0, total = 0;
        
        userTasks.forEach(task => {
            total++;
            const statusName = task.status_extra_info.name;
            if (statusName.toLowerCase() === 'done') {
                done++;
            } else if (statusName.toLowerCase() === 'mr') {
                mr++;
            } else if (['In Coming', 'In Progress'].includes(statusName)) {
                progress++;
            }
        });

        return {
            user,
            done,
            mr,
            progress,
            total
        };
    }).sort((a, b) => b.total - a.total);
  }, [filteredUsers, weeklyTasks]);

  // Prepare data for Modal if a user is selected
  const selectedUserStat = useMemo(() => {
     if (!selectedUserId) return null;
     return userStats.find(s => s.user.id === selectedUserId);
  }, [selectedUserId, userStats]);

  const selectedUserTasks = useMemo(() => {
     if (!selectedUserId) return [];
     return weeklyTasks.filter(t => t.assigned_to === selectedUserId);
  }, [selectedUserId, weeklyTasks]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Modal Render */}
      {selectedUserId && selectedUserStat && (
        <UserTaskModal 
          user={selectedUserStat.user} 
          tasks={selectedUserTasks} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}

      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Team Tracker</h2>
              <p className="text-sm text-slate-500">
                {weeklyTasks.length} tasks active this week
              </p>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 sm:ml-4">
            <button 
                onClick={() => setViewMode('all')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <Users size={14} />
                All Members
            </button>
            <button 
                onClick={() => setViewMode('team')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'team' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <UserCheck size={14} />
                My Team
            </button>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-center xl:justify-end">
            <button
                onClick={goToCurrentWeek}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
                <Calendar size={16} />
                Today
            </button>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => changeWeek(-1)} 
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="min-w-[180px] text-center">
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Week</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              </div>

              <button 
                onClick={() => changeWeek(1)} 
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all text-slate-600 dark:text-slate-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
        </div>
      </div>

      {/* --- WEEKLY PERFORMANCE BOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Goal vs Actual Card */}
        <div className="lg:col-span-2 md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-900 dark:to-blue-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-blue-100">
                    <Target size={20} />
                    <span className="font-bold uppercase tracking-wider text-xs">Weekly Target</span>
                </div>
                
                <div className="flex items-end gap-3 mb-5">
                    <div className="flex flex-col">
                       <span className="text-5xl font-bold tracking-tight">{teamAggregates.done}</span>
                       <span className="text-xs font-medium text-blue-100 uppercase mt-1">Actual</span>
                    </div>
                    <div className="text-4xl opacity-40 font-light mb-2">/</div>
                    <div className="flex flex-col">
                       <span className="text-3xl font-bold opacity-90">{WEEKLY_GOAL}</span>
                       <span className="text-xs font-medium text-blue-100 uppercase mt-1">Goal</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/20 rounded-full h-3 mb-2 backdrop-blur-sm">
                    <div 
                       className="bg-white h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                       style={{ width: `${Math.min((teamAggregates.done / WEEKLY_GOAL) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center text-xs text-blue-100">
                    <span>{Math.round((teamAggregates.done / WEEKLY_GOAL) * 100)}% Achieved</span>
                    {teamAggregates.done >= WEEKLY_GOAL && (
                      <span className="flex items-center gap-1 font-bold text-white bg-green-500/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                        <TrendingUp size={12} /> Target Met!
                      </span>
                    )}
                </div>
            </div>
        </div>

        {/* Status Breakdown Cards */}
        
        {/* Done Card (New) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
             <div className="flex items-start justify-between mb-2">
                 <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                     <CheckCircle2 size={22} />
                 </div>
                 {teamAggregates.done > 0 && <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>}
             </div>
             <div>
                 <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{teamAggregates.done}</p>
                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Done</p>
             </div>
        </div>

        {/* MR Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
             <div className="flex items-start justify-between mb-2">
                 <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                     <GitPullRequest size={22} />
                 </div>
                 {teamAggregates.mr > 0 && <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>}
             </div>
             <div>
                 <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{teamAggregates.mr}</p>
                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Merge Requests</p>
             </div>
        </div>

        {/* Progress Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30 shadow-sm flex flex-col justify-between hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
             <div className="flex items-start justify-between mb-2">
                 <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                     <Clock size={22} />
                 </div>
                 {teamAggregates.progress > 0 && <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>}
             </div>
             <div>
                 <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{teamAggregates.progress}</p>
                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">In Progress</p>
             </div>
        </div>

        {/* Pending Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col justify-between hover:border-red-300 dark:hover:border-red-700 transition-colors">
             <div className="flex items-start justify-between mb-2">
                 <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                     <AlertOctagon size={22} />
                 </div>
                 {teamAggregates.pending > 0 && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
             </div>
             <div>
                 <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{teamAggregates.pending}</p>
                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Pending</p>
             </div>
        </div>

      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userStats.length > 0 ? (
          userStats.map((stat) => (
            <div 
              key={stat.user.id} 
              onClick={() => setSelectedUserId(stat.user.id)}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 transition-all cursor-pointer group"
            >
              {/* User Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <img 
                  src={stat.user.photo || ''} 
                  alt={stat.user.full_name_display}
                  className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-700 object-cover group-hover:border-indigo-500 transition-colors"
                />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={stat.user.full_name_display}>
                    {stat.user.full_name_display}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">@{stat.user.username}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                   <ExternalLink size={16} className="text-indigo-400" />
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-2">
                
                {/* DONE */}
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${stat.done > 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-50'}`}>
                  <div className={`${stat.done > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} mb-1`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className={`text-xl font-bold ${stat.done > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>{stat.done}</span>
                  <span className={`text-[10px] font-semibold uppercase ${stat.done > 0 ? 'text-emerald-600/70' : 'text-slate-400'}`}>Done</span>
                </div>

                {/* MR */}
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${stat.mr > 0 ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-50'}`}>
                  <div className={`${stat.mr > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'} mb-1`}>
                    <GitPullRequest size={18} />
                  </div>
                  <span className={`text-xl font-bold ${stat.mr > 0 ? 'text-purple-700 dark:text-purple-300' : 'text-slate-500'}`}>{stat.mr}</span>
                  <span className={`text-[10px] font-semibold uppercase ${stat.mr > 0 ? 'text-purple-600/70' : 'text-slate-400'}`}>MR</span>
                </div>

                {/* Progress */}
                <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${stat.progress > 0 ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-50'}`}>
                  <div className={`${stat.progress > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'} mb-1`}>
                    <Clock size={18} />
                  </div>
                  <span className={`text-xl font-bold ${stat.progress > 0 ? 'text-orange-700 dark:text-orange-300' : 'text-slate-500'}`}>{stat.progress}</span>
                  <span className={`text-[10px] font-semibold uppercase ${stat.progress > 0 ? 'text-orange-600/70' : 'text-slate-400'}`}>Prog.</span>
                </div>

              </div>
              
              <div className="mt-auto pt-2 text-center text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">
                Total {stat.total} tasks assigned
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <p className="font-medium">No activity recorded for this week.</p>
            <button onClick={() => changeWeek(0)} className="mt-2 text-sm text-indigo-500 hover:underline">
              Reset to Current Week
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTracker;
