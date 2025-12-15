import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Task, UserInfo } from '../types';

// --- Types ---
export interface SummaryStats {
  total: number;
  done: number;
  mr: number;
  inProgressIncoming: number;
  pending: number;
}

// --- Summary Card ---
interface SummaryCardProps {
  title: string;
  count: number;
  type: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  icon?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, type, icon }) => {
  const styles = {
    blue: { bg: 'bg-sky-100 dark:bg-sky-900/30', border: 'border-l-4 border-sky-500', text: 'text-sky-700 dark:text-sky-300' },
    green: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-l-4 border-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-l-4 border-purple-500', text: 'text-purple-700 dark:text-purple-300' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-l-4 border-orange-500', text: 'text-orange-700 dark:text-orange-300' },
    red: { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-l-4 border-red-500', text: 'text-red-700 dark:text-red-300' },
  };

  const style = styles[type];

  return (
    <div className={`flex flex-1 flex-col justify-between rounded-md p-4 shadow-sm ${style.bg} ${style.border} min-w-[140px]`}>
      <div>
        <h3 className={`text-2xl font-bold ${style.text}`}>{count}</h3>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">{title}</p>
      </div>
      <div className={`mt-2 flex justify-end ${style.text}`}>
        {icon}
      </div>
    </div>
  );
};

// --- Completion Progress ---
interface CompletionRateProps {
  percentage: number;
  estimatedHours: number;
  actualHours: number;
}

export const CompletionRate: React.FC<CompletionRateProps> = ({ percentage, estimatedHours, actualHours }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Completion Rate</h4>
      
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">Overall Progress</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{percentage}%</span>
      </div>
      
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2">
        <span>Est. Hours: {estimatedHours}h</span>
        <span>Actual Hours: {actualHours}h</span>
      </div>
    </div>
  );
};

// --- Status Distribution ---
export const StatusDistribution: React.FC<{ stats: SummaryStats }> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm h-full">
      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Status Distribution</h4>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-700 text-xs font-medium dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300">
          incoming: {stats.inProgressIncoming}
        </span>
        <span className="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300">
          DONE: {stats.done}
        </span>
        <span className="px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-xs font-medium dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300">
          MR: {stats.mr}
        </span>
        <span className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-medium dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          Pending: {stats.pending}
        </span>
      </div>
    </div>
  );
};

// --- Date Navigation ---
export const DateNavigation: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 px-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm my-4">
      <div className="flex items-center gap-4">
        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
           Week 15/12 - 21/12/2025
        </span>
        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>
      <button className="text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded flex items-center gap-1">
        <Calendar size={12} /> TODAY
      </button>
    </div>
  );
};

// --- Team Card ---
interface TeamCardProps {
  user: UserInfo;
  tasks: Task[];
}

export const TeamCard: React.FC<TeamCardProps> = ({ user, tasks }) => {
  const stats = {
    done: tasks.filter(t => t.status_extra_info.name === 'DONE').length,
    mr: tasks.filter(t => t.status_extra_info.name === 'MR').length,
    incoming: tasks.filter(t => ['In Coming', 'In Progress'].includes(t.status_extra_info.name)).length,
    pending: tasks.filter(t => t.status_extra_info.name === 'Pending').length,
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <img 
          src={user.photo || ''} 
          alt={user.full_name_display}
          className="w-10 h-10 rounded-full object-cover bg-slate-200"
        />
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.full_name_display}</h4>
          <span className="text-xs text-slate-500">{tasks.length} tasks</span>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>DONE:</span>
          <span className="font-medium text-emerald-600">{stats.done}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>MR:</span>
          <span className="font-medium text-purple-600">{stats.mr}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>In Progress & Incoming:</span>
          <span className="font-medium text-orange-600">{stats.incoming}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Pending:</span>
          <span className="font-medium text-red-600">{stats.pending}</span>
        </div>
      </div>
    </div>
  );
};
